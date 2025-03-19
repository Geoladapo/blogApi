/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { UserService } from 'src/users/providers/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  public login(email: string, password: string, id: number) {
    //check user exists in database
    const user = this.userService.findOneById(id);
    // login
    //token
    return 'SAMPLE_TOKEN';
  }

  public isAuth() {
    return true;
  }
}
