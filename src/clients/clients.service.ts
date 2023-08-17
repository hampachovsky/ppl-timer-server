import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}
  async create(createClientDto: CreateClientDto, user: User) {
    const { id } = user;

    const isExist = await this.clientRepository.findBy({
      user: { id },
      clientEmail: createClientDto.clientEmail,
    });
    if (isExist.length) {
      throw new HttpException(
        'A given client email already exists',
        HttpStatus.CONFLICT,
      );
    }
    const newClient = this.clientRepository.create({
      clientEmail: createClientDto.clientEmail,
      clientName: createClientDto.clientName,
      clientNote: createClientDto.clientNote,
      archived: createClientDto.archived,
      user,
    });
    return await this.clientRepository.save(newClient);
  }

  async findAllByUserId(user: User) {
    const clients = await this.clientRepository
      .createQueryBuilder('client')
      .leftJoinAndSelect('client.user', 'user')
      .where('user.id = :userId', { userId: user.id })
      .getMany();

    if (clients.length <= 0)
      throw new HttpException('Clients not found', HttpStatus.NOT_FOUND);
    return clients;
  }

  async findAll() {
    return this.clientRepository.find();
  }

  async findOne(id: number, user: User) {
    const client = await this.clientRepository
      .createQueryBuilder('client')
      .leftJoinAndSelect('client.user', 'user')
      .leftJoinAndSelect('client.projects', 'projects')
      .where('user.id =:userId', { userId: user.id })
      .andWhere('client.id =:clientId', { clientId: id })
      .getOne();
    if (!client)
      throw new HttpException('Client not found', HttpStatus.NOT_FOUND);
    return client;
  }

  async update(id: number, updateClientDto: UpdateClientDto, user: User) {
    await this.isClientExist(id, user.id);
    return await this.clientRepository.update(id, updateClientDto);
  }

  async remove(id: number, user: User) {
    await this.isClientExist(id, user.id);
    return this.clientRepository.delete(id);
  }

  async isClientExist(id: number, userId: number) {
    const client = await this.clientRepository.findOne({
      where: { id, user: { id: userId } },
      relations: { user: true, projects: true },
    });

    if (!client)
      throw new HttpException('Client not found', HttpStatus.NOT_FOUND);
    return client;
  }
}
