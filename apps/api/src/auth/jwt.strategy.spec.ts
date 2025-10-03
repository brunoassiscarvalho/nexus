import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return a user object with userId and username from payload', async () => {
      const payload = { sub: 'test-user-id', username: 'testuser' };
      const expectedUser = { userId: 'test-user-id', username: 'testuser' };

      const result = await strategy.validate(payload);

      expect(result).toEqual(expectedUser);
    });
  });
});