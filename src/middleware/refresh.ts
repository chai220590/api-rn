import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { SysResponse } from 'src/common/sys-response';

@Injectable()
export class RefreshMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}
  use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization.split(' ')[1];

      if (!token) {
        throw 'error.invalid_token';
      }

      const tokenDecode = this.jwtService.verify(token, {
        secret: process.env.ACCESS_TOKEN_KEY_RF,
      });

      if (!tokenDecode) {
        throw 'error.invalid_token';
      }
      req.authInfo = tokenDecode as any;
      next();
    } catch (error) {
      return res.status(error.name === 'TokenExpiredError' ? 403 : 401).json({
        success: false,
        error: typeof error == 'string' ? error : 'error.unauthorized',
      } as SysResponse);
    }
  }
}
