import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  private readonly saltRounds = parseInt(
    process.env.BCRYPT_SALT_ROUNDS || '12',
  );

  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  async compare(rawPass: string, hashedPass: string): Promise<boolean> {
    return await bcrypt.compare(rawPass, hashedPass);
  }
}
