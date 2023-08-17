import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from 'src/tags/entities/tag.entity';
import { Timer } from 'src/timers/entities/timer.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Timer)
    private readonly timerRepository: Repository<Timer>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}
  async create(createTagDto: CreateTagDto, user: User) {
    const { id } = user;

    const isExist = await this.tagRepository.findBy({
      user: { id },
      tagName: createTagDto.tagName,
    });
    if (isExist.length) {
      throw new HttpException(
        'A given tag name already exists',
        HttpStatus.CONFLICT,
      );
    }
    const newTag = this.tagRepository.create({
      tagName: createTagDto.tagName,
      user,
    });
    const createdTag = await this.tagRepository.save(newTag);
    return createdTag;
  }

  async findAll() {
    return this.tagRepository.find();
  }

  async findOne(id: number, user: User) {
    return await this.isTagExist(id, user.id);
  }

  async findAllByUserId(user: User) {
    const tags = await this.tagRepository
      .createQueryBuilder('tag')
      .leftJoinAndSelect('tag.user', 'user')
      .where('user.id = :userId', { userId: user.id })
      .getMany();

    if (tags.length <= 0)
      throw new HttpException('Tags not found', HttpStatus.NOT_FOUND);
    return tags;
  }

  async findAllByTimerId(id: number, user: User) {
    const tags = await this.tagRepository
      .createQueryBuilder('tag')
      .leftJoinAndSelect('tag.timers', 'timers')
      .where('timers.id = :timerId', { timerId: id })
      .getMany();

    if (tags.length <= 0)
      throw new HttpException('Tags not found', HttpStatus.NOT_FOUND);
    return tags;
  }

  async update(id: number, updateTagDto: UpdateTagDto, user: User) {
    await this.isTagExist(id, user.id);
    return await this.tagRepository.update(id, updateTagDto);
  }

  async remove(id: number, user: User) {
    await this.isTagExist(id, user.id);
    return this.tagRepository.delete(id);
  }

  async isTagExist(id: number, userId: number) {
    const tag = await this.tagRepository.findOne({
      where: { id, user: { id: userId } },
      relations: { timers: true, user: true },
    });

    if (!tag) throw new HttpException('Tag not found', HttpStatus.NOT_FOUND);
    return tag;
  }
}
