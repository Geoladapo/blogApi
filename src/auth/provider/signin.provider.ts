import { SignInDTO } from '../dtos/sign-in.dto';
import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import { UserService } from '../../users/providers/users.service';
import { GenerateTokenProvider } from './generate-token.provider';

@Injectable()
export class SigninProvider {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    private readonly hashingProvider: HashingProvider,

    private readonly generateTokensProvider: GenerateTokenProvider,
  ) {}

  public async signIn(signInDTO: SignInDTO) {
    // find the user using the email
    // Throw an error if the user is not
    const user = await this.userService.findOneByEmail(signInDTO.email);

    // compare the password
    let isEqual: boolean = false;

    try {
      isEqual = await this.hashingProvider.comparePassword(
        signInDTO.password,
        user.password,
      );
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description:
          'Error connecting to the database. Could not compare passwords',
      });
    }

    // Throw an error if the password is incorrect

    if (!isEqual) {
      throw new UnauthorizedException('Incorrect Password');
    }

    return await this.generateTokensProvider.generateTokens(user);
  }
}
