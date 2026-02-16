import { Request } from 'express';
export const getRefreshToken = (req: Request): string | undefined => {
  // 1) Cookie (browser flow)
  const cookieToken = req.cookies?.refreshToken;
  if (cookieToken) return cookieToken;

  // 2) Dedicated header (Swagger/Postman flow)
  const xRefresh =
    req.header('X-Refresh-Token') || req.header('x-refresh-token');
  if (xRefresh) return xRefresh.trim();

  return undefined;
};
