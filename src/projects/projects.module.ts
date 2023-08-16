import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'src/clients/entities/client.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { Timer } from 'src/timers/entities/timer.entity';
import { User } from 'src/user/entities/user.entity';
import { Project } from './entities/project.entity';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

@Module({
  imports: [TypeOrmModule.forFeature([Timer, User, Client, Task, Project])],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
