import { PasswordHasher } from '../application/ports/PasswordHasher.js';
import bcrypt from 'bcrypt';

export const PasswordHasherBcrypt: PasswordHasher = {
  async compare(enteredPassword, storedPassword) {
    return await bcrypt.compare(enteredPassword, storedPassword);
  }
};
