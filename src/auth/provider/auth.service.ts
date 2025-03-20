/* eslint-disable @typescript-eslint/no-unused-vars */
import { SignInDTO } from './../dtos/sign-in.dto';
import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { UserService } from 'src/users/providers/users.service';
import { SigninProvider } from './signin.provider';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { RefreshTokensProvider } from './refresh-tokens.provider';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    private readonly signInProvider: SigninProvider,
    private readonly refreshTokenProvider: RefreshTokensProvider,
  ) {}

  public async signIn(signInDTO: SignInDTO) {
    return await this.signInProvider.signIn(signInDTO);
  }

  public async refreshToken(refreshTokens: RefreshTokenDto) {
    return await this.refreshTokenProvider.refreshTokens(refreshTokens);
  }

  public isAuth() {
    return true;
  }
}
