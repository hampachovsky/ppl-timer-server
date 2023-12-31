import { Project } from 'src/projects/entities/project.entity';
import { TaskType } from 'src/types';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'task_id' })
  id: number;

  @Column({ default: false })
  completed: boolean;

  @Column({
    type: 'enum',
    enum: TaskType,
    default: TaskType.NORMAL,
  })
  taskType: TaskType;

  @Column()
  task: string;

  // * Relations
  @ManyToOne(() => Project, (project) => project.tasks, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  project: Project;
}
