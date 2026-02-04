export interface TokenPayload {
  id: string;
  email: string;
}

export interface TokenService {
  generateAccessToken(id: string, email: string): string;
  generateRefreshToken(id: string, email: string): string;
  verifyRefreshToken(refreshToken: string): TokenPayload | null;
}
