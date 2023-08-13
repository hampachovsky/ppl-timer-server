import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Timer } from 'src/timers/entities/timer.entity';
import { Repository } from 'typeorm';
import { CreateTimerIntervalDto } from './dto/create-timer-interval.dto';
import { UpdateTimerIntervalDto } from './dto/update-timer-interval.dto';
import { TimerInterval } from './entities/timer-interval.entity';

@Injectable()
export class TimerIntervalsService {
  constructor(
    @InjectRepository(Timer)
    private readonly timerRepository: Repository<Timer>,
    @InjectRepository(TimerInterval)
    private readonly timerIntervalRepository: Repository<TimerInterval>,
  ) {}

  async create(createTimerIntervalDto: CreateTimerIntervalDto) {
    const timer = await this.timerRepository.findOne({
      where: {
        id: createTimerIntervalDto.timerId,
      },
    });
    if (!timer)
      throw new HttpException('Timer not found', HttpStatus.NOT_FOUND);
    const newInterval = this.timerIntervalRepository.create({
      intervalStart: createTimerIntervalDto.start,
      timer,
    });
    const createdInterval = await this.timerIntervalRepository.save(
      newInterval,
    );
    return createdInterval;
  }

  async findAll() {
    return `This action returns all timerIntervals`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} timerInterval`;
  }

  async update(id: number, updateTimerIntervalDto: UpdateTimerIntervalDto) {
    return `This action updates a #${id} timerInterval`;
  }

  async remove(id: number) {
    return `This action removes a #${id} timerInterval`;
  }
}
