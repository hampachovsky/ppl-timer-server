import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}
  async create(createTaskDto: CreateTaskDto, user: User) {
    const { id } = user;

    const projectToAssign = await this.projectRepository
      .createQueryBuilder('project')
      .leftJoin('project.projectOwner', 'user')
      .where('user.id =:userId', { userId: id })
      .andWhere('project.id =:projectId', {
        projectId: createTaskDto.projectId,
      })
      .getOne();
    if (!projectToAssign) {
      throw new HttpException(
        'A given project not found',
        HttpStatus.NOT_FOUND,
      );
    }

    const newTask = this.taskRepository.create({
      task: createTaskDto.task,
      taskType: createTaskDto.taskType,
      project: projectToAssign,
    });
    return await this.taskRepository.save(newTask);
  }

  async getByProject(projectId: number) {
    const tasks = await this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.project', 'project')
      .where('project.id = :projectId', { projectId })
      .getMany();

    if (tasks.length <= 0)
      throw new HttpException('Tasks not found', HttpStatus.NOT_FOUND);
    return tasks;
  }

  async findAll() {
    return this.projectRepository.find();
  }

  async findOne(id: number, user: User) {
    return await this.isTaskExist(id, user.id);
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, user: User) {
    await this.isTaskExist(id, user.id);
    return await this.taskRepository.update(id, {
      completed: updateTaskDto.completed,
      task: updateTaskDto.task,
      taskType: updateTaskDto.taskType,
    });
  }

  async remove(id: number, user: User) {
    await this.isTaskExist(id, user.id);
    return this.taskRepository.delete(id);
  }

  async isTaskExist(id: number, userId: number) {
    const task = await this.taskRepository.findOne({
      where: { id, project: { projectOwner: { id: userId } } },
      relations: {
        project: true,
      },
    });

    if (!task) throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    return task;
  }
}
