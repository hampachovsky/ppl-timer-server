import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from 'src/tags/entities/tag.entity';
import { User } from 'src/user/entities/user.entity';
import { In, Repository } from 'typeorm';
import { CreateTimerDto } from './dto/create-timer.dto';
import { UpdateTagsForTimerDto } from './dto/timer.dto';
import { UpdateTimerDto } from './dto/update-timer.dto';
import { Timer } from './entities/timer.entity';

@Injectable()
export class TimersService {
  constructor(
    @InjectRepository(Timer)
    private readonly timerRepository: Repository<Timer>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
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
    const newTimer = await this.timerRepository.create({
      timerName: createTimerDto.timerName,
      isRunning: createTimerDto.isRunning,
      timerDescription: createTimerDto.timerDescription,
      timerOwner: user,
    });
    return await this.timerRepository.save(newTimer);
  }

  async findAll() {
    return this.timerRepository.find();
  }

  async findAllByUserId(user: User) {
    const timers = await this.timerRepository
      .createQueryBuilder('timer')
      .leftJoinAndSelect('timer.timerOwner', 'user')
      .where('user.id = :userId', { userId: user.id })
      .getMany();

    if (timers.length <= 0)
      throw new HttpException('Timers not found', HttpStatus.NOT_FOUND);
    return timers;
  }

  async findOne(id: number) {
    return await this.isTimerExist(id);
  }

  async update(id: number, updateTimerDto: UpdateTimerDto) {
    await this.isTimerExist(id);
    return await this.timerRepository.update(id, updateTimerDto);
  }

  async updateTagsForTimer(
    id: number,
    updateTagsForTimer: UpdateTagsForTimerDto,
  ) {
    const timer = await this.isTimerExist(id);
    const tagsToUpdateTimer = await this.tagRepository.find({
      where: { id: In(updateTagsForTimer.tagIds) },
    });
    timer.tags = tagsToUpdateTimer;
    return await this.timerRepository.save(timer);
  }

  async remove(id: number) {
    await this.isTimerExist(id);
    return this.timerRepository.delete(id);
  }

  async isTimerExist(id: number) {
    const timer = await this.timerRepository.findOne({
      where: { id },
      relations: { timerOwner: true, timerIntervals: true, tags: true },
    });

    if (!timer)
      throw new HttpException('Timer not found', HttpStatus.NOT_FOUND);
    return timer;
  }
}
