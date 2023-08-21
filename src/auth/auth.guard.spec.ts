import { AuthGuard } from './guards/roles.guard';

describe('AuthGuard', () => {
  it('should be defined', () => {
    expect(new AuthGuard()).toBeDefined();
  });
});
