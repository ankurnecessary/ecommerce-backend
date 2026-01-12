import { prisma } from '../shared/database/prisma.js';
import type { User } from './types.js';

export async function getUser(username: string): Promise<User | null> {
  return await prisma.user.findFirst({
    where: {
      email: username
    }
  });
}

export async function saveRefreshToken(
  token: string,
  userId: string
): Promise<void> {
  // [x]: You need to change unknown type here
  // [ ]: Error handling of this function
  await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      refreshToken: token
    }
  });
}
