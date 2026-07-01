import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class HashingService {
  constructor() {}
  async compere(pass: string, hashpassword: string) {
    const correctPassword = await bcrypt.compare(pass, hashpassword);
    if (!correctPassword) {
      throw new NotFoundException('Wrong email or password');
    }
  }
  hash(password: string) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }
}
