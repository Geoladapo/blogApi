import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './provider/auth.service';
import { AuthController } from './auth.controller';
import { HashingProvider } from './provider/hashing.provider';
import { BcryptProvider } from './provider/bcrypt.provider';
import { SigninProvider } from './provider/signin.provider';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { GenerateTokenProvider } from './provider/generate-token.provider';
import { UsersModule } from '../users/users.module';
import { RefreshTokensProvider } from './provider/refresh-tokens.provider';
import { GoogleAuthenticationController } from './social/google-authentication.controller';
import { GoogleAuthenticationService } from './social/providers/google-authentication.service';

@Module({
  providers: [
    AuthService,
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
    SigninProvider,
    GenerateTokenProvider,
    RefreshTokensProvider,
    GoogleAuthenticationService,
  ],
  controllers: [AuthController, GoogleAuthenticationController],
  imports: [
    forwardRef(() => UsersModule),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  exports: [AuthService, HashingProvider],
})
export class AuthModule {}
