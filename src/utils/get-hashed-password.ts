import * as bcrypt from 'bcryptjs';
export async function getHasedPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt();
  if (!/^\$2[abxy]?\$\d+\$/.test(password)) {
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }
  return password;
}
