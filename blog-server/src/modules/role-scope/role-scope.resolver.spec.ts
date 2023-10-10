import { Test, TestingModule } from '@nestjs/testing';
import { RoleScopeResolver } from './role-scope.resolver';

describe('RoleScopeResolver', () => {
  let resolver: RoleScopeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoleScopeResolver],
    }).compile();

    resolver = module.get<RoleScopeResolver>(RoleScopeResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
