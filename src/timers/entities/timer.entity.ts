import { Project } from 'src/projects/entities/project.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Timer {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column('simple-array', { nullable: false })
  timerDates: Date[];

  @Column({ nullable: false })
  timerSummary: number;

  @Column({ nullable: false, default: '' })
  timerName: string;

  @Column({ nullable: true, default: '' })
  timerDescription: string;

  @Column({ default: false })
  isRunning: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // * Relations

  @ManyToOne(() => User, (user) => user.timers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  timerOwner: User;

  @ManyToOne(() => Project, (project) => project.timers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'projectId' })
  assignedProject: Project;

  @ManyToMany(() => Tag, (tag) => tag.timers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable()
  tags: Tag[];
}
