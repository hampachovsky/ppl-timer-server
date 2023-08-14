import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Timer } from 'src/timers/entities/timer.entity';
import { User } from 'src/user/entities/user.entity';
import { Tag } from './entities/tag.entity';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';

@Module({
  imports: [TypeOrmModule.forFeature([Timer, User, Tag])],
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule {}
