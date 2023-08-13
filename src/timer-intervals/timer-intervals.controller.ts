import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateTimerIntervalDto } from './dto/create-timer-interval.dto';
import { UpdateTimerIntervalDto } from './dto/update-timer-interval.dto';
import { TimerIntervalsService } from './timer-intervals.service';

@Controller('intervals')
export class TimerIntervalsController {
  constructor(private readonly timerIntervalsService: TimerIntervalsService) {}

  @Post()
  create(@Body() createTimerIntervalDto: CreateTimerIntervalDto) {
    return this.timerIntervalsService.create(createTimerIntervalDto);
  }

  @Get()
  findAll() {
    return this.timerIntervalsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.timerIntervalsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTimerIntervalDto: UpdateTimerIntervalDto,
  ) {
    return this.timerIntervalsService.update(+id, updateTimerIntervalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.timerIntervalsService.remove(+id);
  }
}
