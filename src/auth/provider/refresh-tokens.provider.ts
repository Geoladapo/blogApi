import { UserService } from './../../users/providers/users.service';
import { GenerateTokenProvider } from './generate-token.provider';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from './../dtos/refresh-token.dto';
import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import jwtConfig from '../config/jwt.config';

@Injectable()
export class RefreshTokensProvider {
  constructor(
    private readonly jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    private readonly generateTokenProvider: GenerateTokenProvider,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}
  public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      // verify the refresh token using the jwt service
      const { sub } = await this.jwtService.verifyAsync<{ sub: number }>(
        refreshTokenDto.refreshToken,
        {
          secret: this.jwtConfiguration.secret,
          audience: this.jwtConfiguration.audience,
          issuer: this.jwtConfiguration.issuer,
        },
      );
      // fetch user from the database
      const user = await this.userService.findOneById(sub);
      // generate new tokens
      const tokens = await this.generateTokenProvider.generateTokens(user);
      return tokens;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
