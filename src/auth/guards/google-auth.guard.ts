import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {}
// This guard handles redirecting to Google and extracting profile
