import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from 'src/tags/entities/tag.entity';
import { TimerInterval } from 'src/timer-intervals/entities/timer-interval.entity';
import { User } from 'src/user/entities/user.entity';
import { Timer } from './entities/timer.entity';
import { TimersController } from './timers.controller';
import { TimersService } from './timers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Timer, User, TimerInterval, Tag])],
  controllers: [TimersController],
  providers: [TimersService],
})
export class TimersModule {}
