import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateTimerDto } from './dto/create-timer.dto';
import { UpdateTimerDto } from './dto/update-timer.dto';
import { Timer } from './entities/timer.entity';

@Injectable()
export class TimersService {
  constructor(
    @InjectRepository(Timer)
    private readonly timerRepository: Repository<Timer>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createTimerDto: CreateTimerDto, user: User) {
    const { id } = user;

    const isExist = await this.timerRepository.findBy({
      timerOwner: { id },
      timerName: createTimerDto.timerName,
    });
    if (isExist.length) {
      throw new HttpException(
        'A given timer name already exists',
        HttpStatus.CONFLICT,
      );
    }
    const newTimer = await this.timerRepository.create({
      timerName: createTimerDto.timerName,
      isRunning: createTimerDto.isRunning,
      timerDescription: createTimerDto.timerDescription,
      timerOwner: user,
    });
    const createdTimer = await this.timerRepository.save(newTimer);
    return createdTimer;
  }

  async findAll() {
    return this.timerRepository.find();
  }

  async findAllByUserId(user: User) {
    const timers = await this.timerRepository
      .createQueryBuilder('timer')
      .leftJoinAndSelect('timer.timerOwner', 'user')
      .where('user.id = :userId', { userId: user.id })
      .getMany();

    if (timers.length <= 0)
      throw new HttpException('Timers not found', HttpStatus.NOT_FOUND);
    return timers;
  }

  async findOne(id: number) {
    const timer = await this.timerRepository.findOne({
      where: { id },
      relations: { timerOwner: true, timerIntervals: true },
    });
    if (!timer)
      throw new HttpException('Timer not found', HttpStatus.NOT_FOUND);
    return timer;
  }

  async update(id: number, updateTimerDto: UpdateTimerDto) {
    const timer = await this.timerRepository.findOne({ where: { id } });

    if (!timer)
      throw new HttpException('Timer not found', HttpStatus.NOT_FOUND);
    return await this.timerRepository.update(id, updateTimerDto);
  }

  async remove(id: number) {
    const timer = await this.timerRepository.findOne({ where: { id } });

    if (!timer)
      throw new HttpException('Timer not found', HttpStatus.NOT_FOUND);
    return this.timerRepository.delete(id);
  }
}
