import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '@config/config.service';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      imports: [SharedModule],
      useFactory: (configService: ConfigService): Promise<JwtModuleOptions> | JwtModuleOptions => {
        const { key, expirationTime } = configService.jwtConfig;

        return {
          secret: key,
          signOptions: {
            expiresIn: expirationTime,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [AuthResolver, AuthService],
})
export class AuthModule {}
