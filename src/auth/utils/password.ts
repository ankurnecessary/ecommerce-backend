import bcrypt from 'bcrypt';

export async function isPasswordValid(
  enteredPassword: string,
  storedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, storedPassword);
}

export async function getHashedPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}
