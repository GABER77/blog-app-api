# **Blog App API**

## **Introduction**

This project is a RESTful API built with NestJS, using PostgreSQL with TypeORM, designed to serve as the backend for a modern blogging platform. It features user registration and authentication using JWT refresh tokens, and supports Google OAuth login. Users can create posts with associated metadata, assign tags to posts, and manage tags efficiently. The application supports file uploads via Amazon S3 cloud storage, includes integrated email functionality, and provides a modular, scalable architecture for development, production, and test environments. Testing is implemented using both unit and end-to-end (E2E) tests to ensure reliability of core features. The API is documented using Swagger (OpenAPI).

## **Technologies Used**

- **Node.js** – JavaScript runtime used for building the server-side application
- **NestJS** – A structured and scalable Node.js framework built with TypeScript
- **PostgreSQL** – A powerful, open-source relational database system
- **TypeORM** – Object-relational mapper used to interact with the PostgreSQL database
- **Swagger (OpenAPI)** – For API documentation and testing
- **Jest** – A JavaScript testing framework used for writing unit tests
- **Supertest** – Used for performing HTTP assertions in end-to-end tests

## **Features**

### Authentication & Authorization

- Secure login with JWT refresh tokens
- OAuth 2.0 login via Google
- Password hashing using bcrypt
- ProtectGuard for securing routes accessible only to authenticated users
- Token validation with expiry handling
- Session persistence through HTTP-only cookies

### File Uploads & Processing

- Media storage using Amazon S3 cloud service
- CloudFront integration for optimized media delivery
- Image processing and compression using Sharp

### Email Integration

- Email sending with Mailtrap (for development/testing)
- Templated transactional emails (e.g., password reset, welcome)

### Advanced Query Features

- **Filtering**, **sorting**, **field limiting**, and **pagination** on user and post listings

### Validation & Error Handling

- Global exception filters for consistent error responses
- DTO-based input validation using class-validator
- Automatic response shaping with interceptors

### Testing

- Unit tests implemented using Jest
- End-to-end (E2E) tests using Supertest
- Mocked repositories and isolated test setup

### API Documentation

- Custom-built REST API documentation using Swagger (OpenAPI)

### Environment Configuration

- Multiple .env files for development, production, and test
- JOI for environment variable validation

### Security

- **Rate limiting** to prevent brute-force and denial-of-service (DoS) attacks
- **HTTP-only cookies** to protect refresh tokens from XSS attacks
- **ProtectGuard** to restrict access to authenticated routes
- **Request body size limit** to prevent large payload attacks

## Environment Variables

To run this project, you’ll need to configure the following environment variables.</br>
Create `.env.development`, `.env.production`, and `.env.test` files.</br>
Place them in the root directory with the following keys:

```
PORT=3000

# PostgreSQL Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=your_db_name          # use different DB for testing
DATABASE_AUTOLOAD=true        # Only true for dev and test
DATABASE_SYNC=true            # Only true for dev and test

# JWT Authentication
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_jwt_secret
JWT_EXPIRES_IN=15m
JWT_COOKIE_EXPIRES_IN=15
JWT_REFRESH_EXPIRES_IN=7d
JWT_REFRESH_COOKIE_EXPIRES_IN=7

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
GOOGLE_SUCCESS_REDIRECT=http://localhost:4200/dashboard

# AWS S3 bucket
AWS_S3_BUCKET_NAME=your_s3_bucket
AWS_REGION=your_aws_region
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
CLOUDFRONT_URL=your_cloudfront_url

# Mailtrap (Dev/Testing)
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=587
EMAIL_USERNAME=your_mailtrap_username
EMAIL_PASSWORD=your_mailtrap_password

# Default sender email address
EMAIL_FROM=no-reply@example.com

# Bcrypt
BCRYPT_SALT_ROUNDS=12

# API Version
API_VERSION=0.1.1
```

## Deployment Notes

- Run `npm install` to install all necessary dependencies before starting the server
- Set `NODE_ENV=production` to enable secure cookies
- Never commit your `.env` files to version control
- Configure CORS origin inside `app.create.ts` file to match your frontend domain
- Run the project in production mode using: `npm run start:prod`
