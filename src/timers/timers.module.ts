import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/projects/entities/project.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { TimerInterval } from 'src/timer-intervals/entities/timer-interval.entity';
import { TimerIntervalsModule } from 'src/timer-intervals/timer-intervals.module';
import { User } from 'src/user/entities/user.entity';
import { Timer } from './entities/timer.entity';
import { TimersController } from './timers.controller';
import { TimersService } from './timers.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Timer, User, TimerInterval, Tag, Project]),
    TimerIntervalsModule,
  ],
  controllers: [TimersController],
  providers: [TimersService],
})
export class TimersModule {}
