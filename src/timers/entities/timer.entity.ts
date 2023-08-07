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

  @Column({ nullable: false })
  timerDate: Date;

  @Column({ nullable: false })
  timer: number;

  @Column({ nullable: false, default: '' })
  timerName: string;

  @Column({ nullable: true, default: '' })
  timerDescription: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // * Relations

  @ManyToOne(() => User, (user) => user.timers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  timerOwner: User;

  @ManyToOne(() => Project, (project) => project.timers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'projectId' })
  assignedProject: Project;

  @ManyToMany(() => Tag, (tag) => tag.timers, { onDelete: 'CASCADE' })
  @JoinTable()
  tags: Tag[];
}
