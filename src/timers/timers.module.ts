import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimerInterval } from 'src/timer-intervals/entities/timer-interval.entity';
import { User } from 'src/user/entities/user.entity';
import { Timer } from './entities/timer.entity';
import { TimersController } from './timers.controller';
import { TimersService } from './timers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Timer, User, TimerInterval])],
  controllers: [TimersController],
  providers: [TimersService],
})
export class TimersModule {}
