import { Injectable } from '@nestjs/common';
import { CreateTimerDto } from './dto/create-timer.dto';
import { UpdateTimerDto } from './dto/update-timer.dto';

@Injectable()
export class TimersService {
  create(createTimerDto: CreateTimerDto) {
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
