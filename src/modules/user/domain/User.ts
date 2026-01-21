import { REGEX } from '../../../config/constants.js';

export interface UserProps {
  id: string;
  email: string;
  password: string;
}

export class User {
  private constructor(private readonly props: UserProps) {}

  static create(props: UserProps): User {
    if (!REGEX.EMAIL.test(props.email)) {
      throw new Error('Invalid email address');
    }

    return new User({
      ...props
    });
  }
}
