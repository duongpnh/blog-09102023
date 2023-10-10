import { Test, TestingModule } from '@nestjs/testing';
import { RoleScopeService } from './role-scope.service';

describe('RoleScopeService', () => {
  let service: RoleScopeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoleScopeService],
    }).compile();

    service = module.get<RoleScopeService>(RoleScopeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
