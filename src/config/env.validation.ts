import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),

  // PostreSQL Configuration
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().port().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DATABASE_AUTOLOAD: Joi.boolean().default(false),
  DATABASE_SYNC: Joi.boolean().default(false),

  // JWT Authentication
  JWT_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required(),
  JWT_COOKIE_EXPIRES_IN: Joi.number().required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().required(),
  JWT_REFRESH_COOKIE_EXPIRES_IN: Joi.number().required(),

  // Google Authentication
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  GOOGLE_CALLBACK_URL: Joi.string().uri().required(),
  GOOGLE_SUCCESS_REDIRECT: Joi.string().uri().required(),

  // AWS S3 bucket
  AWS_S3_BUCKET_NAME: Joi.string().required(),
  AWS_REGION: Joi.string().required(),
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  CLOUDFRONT_URL: Joi.string().uri().required(),

  // Mailtrap Configuration
  EMAIL_HOST: Joi.string().required(),
  EMAIL_PORT: Joi.number().port().required(),
  EMAIL_USERNAME: Joi.string().required(),
  EMAIL_PASSWORD: Joi.string().required(),

  // Default sender email address
  EMAIL_FROM: Joi.string().required(),

  // Bcrypt
  BCRYPT_SALT_ROUNDS: Joi.number().default(12),

  // API Version
  API_VERSION: Joi.string().required(),
});
