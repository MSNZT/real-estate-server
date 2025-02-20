import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Profile } from "passport";
// import { Strategy } from "passport-google-oauth20";
import { VerifiedCallback } from "passport-jwt";
import { Strategy } from "passport-yandex";

@Injectable()
export class YandexStrategy extends PassportStrategy(Strategy, "yandex") {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get("YANDEX_CLIENT_ID"),
      clientSecret: configService.get("YANDEX_CLIENT_SECRET"),
      callbackURL:
        configService.get("SERVER_URL") + "/api/auth/yandex/callback",
      scope: ["login:email", "login:info", "login:avatar"],
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
