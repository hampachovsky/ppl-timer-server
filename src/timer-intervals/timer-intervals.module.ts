import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Timer } from 'src/timers/entities/timer.entity';
import { TimerInterval } from './entities/timer-interval.entity';
import { TimerIntervalsController } from './timer-intervals.controller';
import { TimerIntervalsService } from './timer-intervals.service';

@Module({
  imports: [TypeOrmModule.forFeature([Timer, TimerInterval])],
  controllers: [TimerIntervalsController],
  providers: [TimerIntervalsService],
  exports: [TimerIntervalsService],
})
export class TimerIntervalsModule {}
