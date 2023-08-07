import { Project } from 'src/projects/entities/project.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Client {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'client_id' })
  id: number;

  @Column()
  clientName: string;

  @Column()
  clientEmail: string;

  @Column()
  clientNote: string;

  @Column()
  archived: boolean;

  // * Relations
  @OneToMany(() => Project, (project) => project.client, {
    onDelete: 'CASCADE',
  })
  projects: Project[];
}
