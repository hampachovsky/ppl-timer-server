import { Exclude } from 'class-transformer';
import { Client } from 'src/clients/entities/client.entity';
import { Project } from 'src/projects/entities/project.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { Timer } from 'src/timers/entities/timer.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column()
  email: string;

  @Column()
  username: string;

  @Exclude()
  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // * Relations

  @OneToMany(() => Timer, (timer) => timer.timerOwner, { onUpdate: 'CASCADE' })
  timers: Timer[];

  @OneToMany(() => Tag, (tag) => tag.user, { onUpdate: 'CASCADE' })
  tags: Tag[];

  @OneToMany(() => Project, (project) => project.projectOwner, {
    onUpdate: 'CASCADE',
  })
  projects: Project[];

  @OneToMany(() => Client, (client) => client.user, {
    onUpdate: 'CASCADE',
  })
  clients: Client[];
}
