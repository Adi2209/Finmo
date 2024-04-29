import { AuthenticationGuard } from '../authentication.guard';
import { UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

describe('AuthenticationGuard', () => {
  let authenticationGuard: AuthenticationGuard;
  let jwtService: JwtService;

  beforeEach(() => {
    jwtService = new JwtService({
      secret: 'testSecret',
    });
    authenticationGuard = new AuthenticationGuard(jwtService);
  });

  it('should throw UnauthorizedException if no token is provided', async () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({ headers: { authorization: undefined } }),
      }),
    } as ExecutionContext;

    await expect(
      authenticationGuard.canActivate(mockContext),
    ).rejects.toThrowError(UnauthorizedException);
  });

  it('should throw UnauthorizedException if invalid token is provided', async () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { authorization: 'Bearer invalidToken' },
        }),
      }),
    } as ExecutionContext;
    jest.spyOn(jwtService, 'verifyAsync').mockRejectedValueOnce(new Error());

    await expect(
      authenticationGuard.canActivate(mockContext),
    ).rejects.toThrowError(UnauthorizedException);
  });

  it('should set user property in request if valid token is provided', async () => {
    const payload = { username: 'testuser' };
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({ headers: { authorization: 'Bearer validToken' } }),
      }),
    } as ExecutionContext;
    jest.spyOn(JwtService.prototype, 'verifyAsync').mockResolvedValueOnce(payload);

   const response =  await authenticationGuard.canActivate(mockContext);

    expect(response).toEqual(true);
  });
});
