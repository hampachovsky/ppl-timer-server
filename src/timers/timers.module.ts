import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Timer } from './entities/timer.entity';
import { TimersController } from './timers.controller';
import { TimersService } from './timers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Timer])],
  controllers: [TimersController],
  providers: [TimersService],
})
export class TimersModule {}
