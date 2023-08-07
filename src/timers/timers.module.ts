import { Module } from '@nestjs/common';
import { TimersService } from './timers.service';
import { TimersController } from './timers.controller';

@Module({
  controllers: [TimersController],
  providers: [TimersService]
})
export class TimersModule {}
