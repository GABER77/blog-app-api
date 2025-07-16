// src/common/swagger/auth.swagger.ts
import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { LoginDto } from 'src/auth/dto/login.dto';

export function SwaggerSignup() {
  return applyDecorators(
    ApiOperation({ summary: 'User signup with optional profile image' }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description: 'User signup data with optional image upload',
      type: CreateUserDto,
    }),
    ApiResponse({ status: 201, description: 'User created successfully' }),
    ApiResponse({ status: 400, description: 'Validation or duplicate error' }),
  );
}

export function SwaggerLogin() {
  return applyDecorators(
    ApiOperation({ summary: 'User login' }),
    ApiBody({ type: LoginDto }),
    ApiResponse({ status: 200, description: 'Login successful' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}

export function SwaggerRefreshToken() {
  return applyDecorators(
    ApiOperation({
      summary: 'Refresh access token using refresh_token cookie',
    }),
    ApiResponse({ status: 200, description: 'Access token refreshed' }),
    ApiResponse({ status: 401, description: 'Invalid or missing token' }),
  );
}

export function SwaggerGoogleAuth() {
  return applyDecorators(
    ApiOperation({ summary: 'Redirect to Google OAuth' }),
    ApiResponse({ status: 302, description: 'Redirect to Google login' }),
  );
}

export function SwaggerGoogleCallback() {
  return applyDecorators(
    ApiOperation({ summary: 'Google OAuth callback' }),
    ApiResponse({ status: 302, description: 'Redirect to success page' }),
    ApiResponse({ status: 401, description: 'Google login failed' }),
  );
}
