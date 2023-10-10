import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { RegisterResponseDto } from './dto/register-response.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from '@decorators/public.decorator';

@Resolver()
export class AuthResolver {
  constructor(private _authService: AuthService) {}

  @Mutation(() => RegisterResponseDto)
  register(@Args('payload') payload: RegisterDto): Promise<RegisterResponseDto> {
    return this._authService.register(payload);
  }

  @Public()
  @Mutation(() => RegisterResponseDto)
  login(@Args('payload') payload: LoginDto): Promise<RegisterResponseDto> {
    return this._authService.login(payload);
  }
}
