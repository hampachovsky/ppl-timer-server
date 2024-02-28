import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'src/projects/entities/project.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { TimerInterval } from 'src/timer-intervals/entities/timer-interval.entity';
import { TimerIntervalsService } from 'src/timer-intervals/timer-intervals.service';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateTimerDto } from './dto/create-timer.dto';
import {
  AssignProjectToTimerDto,
  StartTimerDto,
  StopTimerDto,
  UpdateTagsForTimerDto,
} from './dto/timer.dto';
import { UpdateTimerDto } from './dto/update-timer.dto';
import { Timer } from './entities/timer.entity';

@Injectable()
export class TimersService {
  constructor(
    @InjectRepository(Timer)
    private readonly timerRepository: Repository<Timer>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(TimerInterval)
    private readonly timerIntervalRepository: Repository<TimerInterval>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private timerIntervalsService: TimerIntervalsService,
  ) {}

  async create(createTimerDto: CreateTimerDto, user: User) {
    const { id } = user;

    const isExist = await this.timerRepository.findBy({
      timerOwner: { id },
      timerName: createTimerDto.timerName,
    });
    if (isExist.length) {
      throw new HttpException(
        'A given timer name already exists',
        HttpStatus.CONFLICT,
      );
    }
    const newTimer = this.timerRepository.create({
      timerName: createTimerDto.timerName,
      isRunning: createTimerDto.isRunning,
      timerDescription: createTimerDto.timerDescription,
      timerOwner: user,
    });

    const savedTimer = await this.timerRepository.save(newTimer);
    await this.startTimer(savedTimer.id, { intervalStart: new Date() }, user);
    return savedTimer;
  }

  async findAll() {
    return this.timerRepository.find();
  }

  async findAllByUserId(user: User) {
    const timers = await this.timerRepository
      .createQueryBuilder('timer')
      .leftJoinAndSelect('timer.timerOwner', 'user')
      .leftJoinAndSelect('timer.timerIntervals', 'timerIntervals')
      .where('user.id = :userId', { userId: user.id })
      .getMany();

    if (timers.length <= 0)
      throw new HttpException('Timers not found', HttpStatus.NOT_FOUND);
    return timers;
  }

  async findOne(id: number, user: User) {
    return await this.isTimerExist(id, user.id);
  }

  async update(id: number, updateTimerDto: UpdateTimerDto, user: User) {
    await this.isTimerExist(id, user.id);
    return await this.timerRepository.update(id, updateTimerDto);
  }

  async assignProjectToTimer(
    id: number,
    assignProjectToTimerDto: AssignProjectToTimerDto,
    user: User,
  ) {
    const timer = await this.isTimerExist(id, user.id);
    const projectToAssignTimer = await this.projectRepository
      .createQueryBuilder('project')
      .leftJoin('project.projectOwner', 'user')
      .where('project.id =:projectId', {
        projectId: assignProjectToTimerDto.projectId,
      })
      .andWhere('user.id =:userId', { userId: user.id })
      .getOne();
    timer.assignedProject = projectToAssignTimer;
    return await this.timerRepository.save(timer);
  }

  async stopTimer(id: number, stopTimerDto: StopTimerDto, user: User) {
    const timer = await this.isTimerExist(id, user.id);
    const intervalToStop = await this.timerIntervalRepository
      .createQueryBuilder('interval')
      .leftJoin('interval.timer', 'timer')
      .where('timer.id =:id', {
        id,
      })
      .andWhere('interval.id =:intervalId', {
        intervalId: stopTimerDto.intervalId,
      })
      .getOne();
    intervalToStop.intervalEnd = stopTimerDto.intervalEnd;
    intervalToStop.intervalDuration = stopTimerDto.intervalDuration;
    await this.timerIntervalRepository.save(intervalToStop);
    timer.timerSummary = +timer.timerSummary + +stopTimerDto.intervalDuration;
    timer.isRunning = false;
    return await this.timerRepository.save(timer);
  }

  async startTimer(id: number, startTimerDto: StartTimerDto, user: User) {
    const timer = await this.isTimerExist(id, user.id, false);

    await this.timerIntervalsService.create({
      timerId: id,
      intervalStart: startTimerDto.intervalStart,
      intervalEnd: null,
      intervalDuration: null,
    });

    timer.isRunning = true;

    return await this.timerRepository.save(timer);
  }

  async updateTagsForTimer(
    id: number,
    updateTagsForTimerDto: UpdateTagsForTimerDto,
    user: User,
  ) {
    const timer = await this.isTimerExist(id, user.id);
    const tagsToUpdateTimer = await this.tagRepository
      .createQueryBuilder('tag')
      .leftJoin('tag.user', 'user')
      .where('tag.id IN (:...tagIds)', {
        tagIds: updateTagsForTimerDto.tagIds,
      })
      .andWhere('user.id =:userId', { userId: user.id })
      .getMany();
    /*     const tagsToUpdateTimer = await this.tagRepository.find({
      where: { id: In(updateTagsForTimer.tagIds), user: { id: user.id } },
    }); */
    timer.tags = tagsToUpdateTimer;
    return await this.timerRepository.save(timer);
  }

  async remove(id: number, user: User) {
    await this.isTimerExist(id, user.id);
    return this.timerRepository.delete(id);
  }

  async isTimerExist(id: number, userId: number, needRelations = true) {
    const timer = await this.timerRepository.findOne({
      where: { id, timerOwner: { id: userId } },
      relations: {
        timerOwner: needRelations,
        timerIntervals: needRelations,
        tags: needRelations,
      },
    });

    if (!timer)
      throw new HttpException('Timer not found', HttpStatus.NOT_FOUND);
    return timer;
  }
}
