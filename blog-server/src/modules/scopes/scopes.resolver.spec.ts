import { Test, TestingModule } from '@nestjs/testing';
import { ScopesResolver } from './scopes.resolver';

describe('ScopesResolver', () => {
  let resolver: ScopesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScopesResolver],
    }).compile();

    resolver = module.get<ScopesResolver>(ScopesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
