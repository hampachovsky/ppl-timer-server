import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from 'src/clients/entities/client.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { Timer } from 'src/timers/entities/timer.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Timer)
    private readonly timerRepository: Repository<Timer>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}
  async create(createProjectDto: CreateProjectDto, user: User) {
    const { id } = user;

    const [isExist, clientToAssign] = await Promise.all([
      this.projectRepository.findBy({
        projectOwner: { id },
        projectName: createProjectDto.projectName,
      }),
      this.clientRepository
        .createQueryBuilder('client')
        .leftJoin('client.user', 'user')
        .where('user.id =:userId', { userId: id })
        .andWhere('client.id =:clientId', {
          clientId: createProjectDto.clientId,
        })
        .getOne(),
    ]);
    if (isExist.length) {
      throw new HttpException(
        'A given project name already exists',
        HttpStatus.CONFLICT,
      );
    }

    const newProject = this.projectRepository.create({
      projectName: createProjectDto.projectName,
      color: createProjectDto.color,
      client: clientToAssign,
      projectOwner: user,
    });
    return await this.projectRepository.save(newProject);
  }

  async findAll() {
    return this.projectRepository.find();
  }

  async findAllByUserId(
    user: User,
    query: { type: string; qs: string; client: string; billable: string },
  ) {
    const queryBuilder = this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.projectOwner', 'user')
      .leftJoinAndSelect('project.client', 'client')
      .leftJoin('project.timers', 'timers')
      .addSelect('timers.timerSummary')
      .where('user.id = :userId', { userId: user.id });

    if (query.qs) {
      queryBuilder.andWhere('project.projectName like :qs', {
        qs: `%${query.qs}%`,
      });
    }

    if (query.type === 'active') {
      queryBuilder.andWhere('project.archived = :archived', {
        archived: false,
      });
    } else if (query.type === 'archived') {
      queryBuilder.andWhere('project.archived = :archived', { archived: true });
    }

    if (query.client === 'none') {
      queryBuilder.andWhere('client is NULL');
    } else if (query.client !== 'all') {
      queryBuilder.andWhere('client.id = :clientId', {
        clientId: +query.client,
      });
    }

    if (query.billable === 'billable') {
      queryBuilder.andWhere('project.billable = :billable', { billable: true });
    } else if (query.billable === 'nonBillable') {
      queryBuilder.andWhere('project.billable = :billable', {
        billable: false,
      });
    }

    const projects = await queryBuilder.getMany();
    if (projects.length <= 0)
      throw new HttpException('Projects not found', HttpStatus.NOT_FOUND);

    return projects;
  }

  async findOne(id: number, user: User) {
    return await this.isProjectExist(id, user.id);
  }

  async update(id: number, updateProjectDto: UpdateProjectDto, user: User) {
    await this.isProjectExist(id, user.id);
    const clientToUpdateProject = await this.clientRepository
      .createQueryBuilder('client')
      .leftJoin('client.user', 'user')
      .where('user.id =:userId', { userId: user.id })
      .andWhere('client.id =:clientId', {
        clientId: updateProjectDto.clientId,
      })
      .getOne();

    return await this.projectRepository.update(id, {
      projectName: updateProjectDto.projectName,
      projectDescription: updateProjectDto.projectDescription,
      note: updateProjectDto.note,
      color: updateProjectDto.color,
      billable: updateProjectDto.billable,
      archived: updateProjectDto.archived,
      hourlyRate: updateProjectDto.hourlyRate,
      client: clientToUpdateProject,
    });
  }

  async remove(id: number, user: User) {
    await this.isProjectExist(id, user.id);
    return this.projectRepository.delete(id);
  }

  async isProjectExist(id: number, userId: number) {
    const project = await this.projectRepository.findOne({
      where: { id, projectOwner: { id: userId } },
      relations: {
        projectOwner: true,
        tasks: true,
        client: true,
        timers: true,
      },
    });

    if (!project)
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    return project;
  }
}
