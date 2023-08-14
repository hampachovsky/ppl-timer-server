import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
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

  @Get('/byTimer/:id')
  @UseGuards(JwtAuthGuard)
  findAllByUserId(@Param('id') id: string) {
    return this.timerIntervalsService.findAllByTimerId(+id);
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
