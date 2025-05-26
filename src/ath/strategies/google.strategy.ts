import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Profile } from "passport";
import { Strategy } from "passport-google-oauth20";
import { VerifiedCallback } from "passport-jwt";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get("GOOGLE_CLIENT_ID"),
      clientSecret: configService.get("GOOGLE_CLIENT_SECRET"),
      callbackURL: `${configService.get("SERVER_URL")}/api/oauth/google/callback`,
      scope: ["profile", "email"],
    });
  }

  validate(
    _accessToken,
    _refreshToken,
    profile: Profile,
    done: VerifiedCallback,
  ) {
    const { id, displayName, emails, photos } = profile;
    const user = {
      id,
      email: emails[0].value,
      name: displayName,
      avatar: photos[0].value,
    };
    return done(null, user);
  }
}
