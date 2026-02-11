import { CookieOptions } from 'express';

export const jwtConfig = {
  accessSecret: process.env.JWT_ACCESS_SECRET || 'default-access-secret-change-in-production',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret-change-in-production',
  accessExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
  refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
};

const isProduction = process.env.NODE_ENV === 'production';

export const cookieConfig = {
  access: {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict' as const,
    maxAge: 15 * 60 * 1000, // 15 minutes
    path: '/',
  } satisfies CookieOptions,

  refresh: {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/api/v1/auth/refresh',
  } satisfies CookieOptions,

  clear: {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict' as const,
    path: '/',
  } satisfies CookieOptions,
};

export const COOKIE_NAMES = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
} as const;
