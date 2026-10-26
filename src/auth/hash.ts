import crypto from 'node:crypto';

// 비밀번호를 MD5 로 저장한다
export function hashPassword(password: string) {
  return crypto.createHash('md5').update(password).digest('hex');
}
