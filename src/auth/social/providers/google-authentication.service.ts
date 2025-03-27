/* eslint-disable @typescript-eslint/no-unused-vars */
import { GenerateTokenProvider } from './../../provider/generate-token.provider';
import {
  forwardRef,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import jwtConfig from 'src/auth/config/jwt.config';
import { GoogleTokenDto } from '../dtos/google-token.dto';
import { UserService } from 'src/users/providers/users.service';

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  private oauthClient: OAuth2Client;

  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    private readonly generateTokenProvider: GenerateTokenProvider,
  ) {}
  onModuleInit() {
    const clientId = this.jwtConfiguration.googleClientId;
    const clientSecret = this.jwtConfiguration.googleClientSecret;
    this.oauthClient = new OAuth2Client(clientId, clientSecret);
  }

  public async authenticate(googleTokenDto: GoogleTokenDto) {
    try {
      // verify the google token sent by the user
      const loginTicket = await this.oauthClient.verifyIdToken({
        idToken: googleTokenDto.token,
      });

      // Extract the payload from the google token
      const {
        email,
        sub: googleId,
        given_name: firstName,
        family_name: lastName,
      } = loginTicket.getPayload();

      // find the user using the google id
      const user = await this.userService.findOneByGoogleId(googleId);

      // if googleId exists generate token
      if (user) {
        return this.generateTokenProvider.generateTokens(user);
      }
      // if not create a new user and then generate token
      const newUser = await this.userService.createGoogleUser({
        email,
        firstName,
        lastName,
        googleId,
      });

      return this.generateTokenProvider.generateTokens(newUser);
    } catch (error) {
      // throw unauthorized exception
      throw new UnauthorizedException(error);
    }
  }
}
