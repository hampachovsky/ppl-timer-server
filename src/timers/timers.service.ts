import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTimerDto } from './dto/create-timer.dto';
import { UpdateTimerDto } from './dto/update-timer.dto';
import { Timer } from './entities/timer.entity';

@Injectable()
export class TimersService {
  constructor(
    @InjectRepository(Timer)
    private readonly timerRepository: Repository<Timer>,
  ) {}

  create(createTimerDto: CreateTimerDto, user) {
    return 'This action adds a new timer';
  }

  findAll() {
    return `This action returns all timers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} timer`;
  }

  update(id: number, updateTimerDto: UpdateTimerDto) {
    return `This action updates a #${id} timer`;
  }

  remove(id: number) {
    return `This action removes a #${id} timer`;
  }
}
