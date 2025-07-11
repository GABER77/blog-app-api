import { CookieOptions, Request } from 'express';

// Extend the Request to include cookies (because Express.Request doesn't have it by default)
export interface RequestWithCookies extends Request {
  cookies: { [key: string]: string };
}

export interface GoogleUser {
  googleId: string;
  name: string;
  email: string;
  photo: string;
}

export interface RequestWithUser extends Request {
  user: GoogleUser;
}

export interface TokenCookie {
  name: string;
  value: string;
  options: CookieOptions;
}
