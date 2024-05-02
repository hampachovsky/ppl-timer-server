import { Exclude } from 'class-transformer';
import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Client {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'client_id' })
  id: number;

  @Column({ nullable: false })
  clientName: string;

  @Column({ nullable: false })
  clientEmail: string;

  @Column({ default: '' })
  clientNote: string;

  @Column({ default: false })
  archived: boolean;

  // * Relations
  @Exclude()
  @ManyToOne(() => User, (user) => user.clients, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Project, (project) => project.client, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'projectId' })
  projects: Project[];
}
