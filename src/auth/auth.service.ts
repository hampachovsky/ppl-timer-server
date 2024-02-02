import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthHelper } from './auth.helper';
import { AuthDto } from './dto/auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(AuthHelper) private readonly authHelper: AuthHelper,
  ) {}

  async register(dto: AuthDto) {
    const candidate = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (candidate) {
      throw new HttpException(
        'A given email already exists',
        HttpStatus.CONFLICT,
      );
    }
    const user = await this.userRepository.save({
      email: dto.email,
      password: this.authHelper.encodePassword(dto.password),
      username: dto.username,
    });
    const userToReturn = await this.userRepository.findOne({
      where: { email: user.email },
    });
    const token = this.authHelper.generateToken(user);

    return { user: userToReturn, token };
  }

  async login(dto: LoginAuthDto) {
    const user: User = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      throw new HttpException('No user found', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid: boolean = this.authHelper.isPasswordValid(
      dto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('Wrong password', HttpStatus.NOT_FOUND);
    }

    return { user, token: this.authHelper.generateToken(user) };
  }
}
