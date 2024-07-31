import * as bcrypt from 'bcryptjs';
export async function comparePassword(
  password: string,
  hashedPassword: string,
) {
  if (await bcrypt.compare(password, hashedPassword)) {
    return true;
  }
  return false;
}
