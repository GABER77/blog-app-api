import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!, // The URL Google will redirect to after authentication is complete
      scope: ['email', 'profile'], // The data you're asking Google for
    });
  }

  // This method is called automatically when Google sends back the user profile
  validate(
    // These tokens you can use it to make requests to Google's APIs (e.g. YouTube data)
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback, // A callback to pass the user object back to Passport
  ): void {
    const user = {
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails?.[0]?.value,
      photo: profile.photos?.[0]?.value,
    };

    // Tell Passport we're done, pass the user to the request pipeline
    // null means no error occurred
    done(null, user);
  }
}
