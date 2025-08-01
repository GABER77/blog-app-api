import { Reflector } from '@nestjs/core';
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import * as cookieParser from 'cookie-parser';
import * as AWS from 'aws-sdk';
import { DataResponseInterceptor } from './common/interceptors/data-response.interceptor';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import * as compression from 'compression';
import * as express from 'express';

export function appCreate(app: INestApplication) {
  // Allow requests from other domains (Cross-Origin Resource Sharing)
  app.enableCors({
    origin: ['http://localhost:3000'], // Frontend origin
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // // enable cookies and JWTs with credentials
  });

  // Set secure HTTP headers
  app.use(helmet());

  // Body parser, Reading data from the body into req.body
  // limit the body size to 10kb to prevent large payload attacks
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));

  // Reading data from the cookies (req.cookies)
  app.use(cookieParser());

  // Enable compression to speed up response delivery
  app.use(compression());

  // Limit requests from same IP
  const limiter = rateLimit({
    limit: 500,
    windowMs: 60 * 60 * 1000, // Maximum of 500 request in 1 hour
    message: 'Too many requests from this IP, please try again after an hour',
  });
  app.use('/api', limiter);

  // Enable global validation pipe with strict rules
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // removes properties not defined in your DTO
      forbidNonWhitelisted: true, // throws error if extra fields are present
      stopAtFirstError: true, // stops showing multiple errors per property
      transform: true, // transforms incoming request to match the DTO type
      transformOptions: {
        enableImplicitConversion: true, // Enable automatic type conversion for incoming request
      },
    }),
  );

  // Global Exception Filter
  // Handle DB related errors (e.g. failed .findOne, .save, .create, etc.)
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Global Interceptors
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(
    // Remove fields marked with @Exclude() in your entity when returning responses
    new ClassSerializerInterceptor(reflector),
    new DataResponseInterceptor(),
  );

  // Initialize AWS S3 as runtime assignment of a global variable
  globalThis.s3 = new AWS.S3({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Blog App API')
    .setDescription(
      'RESTful API for managing users, authentication, posts, and comments in a modular blog application.',
    )
    .addServer('http://localhost:3000')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}
