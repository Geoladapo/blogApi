import { SignInDTO } from './../dtos/sign-in.dto';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { UserService } from 'src/users/providers/users.service';
import { SigninProvider } from './signin.provider';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    private readonly signInProvider: SigninProvider,
  ) {}

  public async signIn(signInDTO: SignInDTO) {
    return await this.signInProvider.signIn(signInDTO);
  }

  public isAuth() {
    return true;
  }
}
