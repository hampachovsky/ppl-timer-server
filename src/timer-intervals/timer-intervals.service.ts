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
      intervalStart: createTimerIntervalDto.intervalStart,
      timer,
    });
    const createdInterval = await this.timerIntervalRepository.save(
      newInterval,
    );
    return createdInterval;
  }

  async findAll() {
    return this.timerIntervalRepository.find({ relations: { timer: true } });
  }

  async findOne(id: number) {
    return await this.isIntervalExist(id);
  }

  async findAllByTimerId(id: number) {
    const interval = await this.timerIntervalRepository.findOne({
      where: { timer: { id } },
      relations: { timer: true },
    });
    if (!interval)
      throw new HttpException('Interval not found', HttpStatus.NOT_FOUND);
    return interval;
  }

  async update(id: number, updateTimerIntervalDto: UpdateTimerIntervalDto) {
    await this.isIntervalExist(id);
    return await this.timerIntervalRepository.update(
      id,
      updateTimerIntervalDto,
    );
  }

  async remove(id: number) {
    const interval = await this.isIntervalExist(id);
    const timer = interval.timer;
    timer.timerSummary -= interval.intervalDuration;
    await this.timerRepository.save(timer);
    return this.timerIntervalRepository.delete(id);
  }

  async isIntervalExist(id: number) {
    const interval = await this.timerIntervalRepository.findOne({
      where: { id },
      relations: { timer: true },
    });

    if (!interval)
      throw new HttpException('Interval not found', HttpStatus.NOT_FOUND);
    return interval;
  }
}
