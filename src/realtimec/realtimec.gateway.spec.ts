import { Test, TestingModule } from '@nestjs/testing';
import { RealtimecGateway } from './realtimec.gateway';

describe('RealtimecGateway', () => {
  let gateway: RealtimecGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RealtimecGateway],
    }).compile();

    gateway = module.get<RealtimecGateway>(RealtimecGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
