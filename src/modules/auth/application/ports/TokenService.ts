export interface TokenService {
  generateAccessToken(id: string, email: string): string;
  generateRefreshToken(id: string, email: string): string;
}
