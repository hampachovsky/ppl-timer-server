import { Exclude } from 'class-transformer';
import { Client } from 'src/clients/entities/client.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { Timer } from 'src/timers/entities/timer.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Project {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'project_id',
  })
  id: number;

  @Column()
  projectName: string;

  @Column({ default: '' })
  projectDescription: string;

  @Column({ default: '', nullable: false })
  note: string;

  @Column({ default: false })
  archived: boolean;

  @Column({ default: false })
  billable: boolean;

  @Column({ default: '' })
  color: string;

  @Column({ default: 0, nullable: true })
  hourlyRate: number;

  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;

  // * Relations

  @OneToMany(() => Timer, (timer) => timer.assignedProject, {
    onDelete: 'CASCADE',
  })
  timers: Timer[];

  @OneToMany(() => Task, (task) => task.project, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  tasks: Task[];

  @Exclude()
  @ManyToOne(() => User, (user) => user.projects, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  projectOwner: User;

  @ManyToOne(() => Client, (client) => client.projects, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  client: Client;
}
