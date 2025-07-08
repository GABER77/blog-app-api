import { SetMetadata } from '@nestjs/common';

// Use @Public() above any controller method to bypasses global auth guard
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
