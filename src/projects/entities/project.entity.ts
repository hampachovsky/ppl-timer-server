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

  @Column({ default: 0 })
  hourlyRate: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // * Relations

  @OneToMany(() => Timer, (timer) => timer.assignedProject, {
    onDelete: 'CASCADE',
  })
  timers: Timer[];

  @OneToMany(() => Task, (task) => task.project, { onDelete: 'CASCADE' })
  tasks: Task[];

  @ManyToOne(() => User, (user) => user.projects, { onDelete: 'CASCADE' })
  projectOwner: User;

  @ManyToOne(() => Client, (client) => client.projects, { onDelete: 'CASCADE' })
  client: Client;
}
