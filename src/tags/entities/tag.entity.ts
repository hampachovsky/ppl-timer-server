import { Timer } from 'src/timers/entities/timer.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column()
  tagName: string;

  @Column()
  archived: boolean;

  @ManyToMany(() => Timer, (timer) => timer.tags, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  timers: Timer[];
}
