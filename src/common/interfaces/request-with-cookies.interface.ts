import { Request } from 'express';

// Extend the Request to include cookies (because Express.Request doesn't have it by default)
export interface RequestWithCookies extends Request {
  cookies: { [key: string]: string };
}
