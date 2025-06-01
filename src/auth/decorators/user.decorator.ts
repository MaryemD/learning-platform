import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ConfigService } from '@nestjs/config';

interface JwtPayload {
  id: number;
  username: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export const User = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    let request;

    if (context.getType() === 'http') {
      request = context.switchToHttp().getRequest();
    } else {
      const ctx = GqlExecutionContext.create(context);
      request = ctx.getContext().req;
    }

    // If request.user exists (set by passport-jwt), return it

    // Otherwise, get the token from Authorization header
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('No authorization header');
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer') {
      throw new UnauthorizedException('Invalid authorization type');
    }

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      // Get ConfigService instance
      const configService = new ConfigService();
      const secret = configService.get<string>('SECRET');
      
      if (!secret) {
        throw new Error('JWT secret is not configured');
      }

      // Verify and decode the token
      const decoded = require('jsonwebtoken').verify(token, secret) as JwtPayload;
      
      // Return user information
      return {
        id: decoded.id,
        name: decoded.username,
        email: decoded.email,
        role: decoded.role
      };
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token');
      }
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      }
      throw error;
    }
  },
); 