import { Exclude } from 'class-transformer';
import { Project } from 'src/projects/entities/project.entity';
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

  @OneToMany(() => Project, (project) => project.projectOwner, {
    onUpdate: 'CASCADE',
  })
  projects: Project[];
}
