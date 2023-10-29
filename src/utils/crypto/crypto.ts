import * as bcrypt from 'bcrypt';

async function EncryptPassword(password: string) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hash(password, salt);
  return hash;
}
async function ComparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
export { EncryptPassword, ComparePassword };
