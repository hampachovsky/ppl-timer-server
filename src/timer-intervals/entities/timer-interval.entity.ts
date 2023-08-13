import { Timer } from 'src/timers/entities/timer.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class TimerInterval {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({ nullable: true, default: null })
  intervalStart: Date | null;

  @Column({ nullable: true, default: null })
  intervalEnd: Date | null;

  @Column({ nullable: true, default: null })
  intervalDuration: number | null;

  @UpdateDateColumn()
  updatedAt: Date;

  // * Relations
  @ManyToOne(() => Timer, (timer) => timer.timerIntervals, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'timerId' })
  timer: Timer;
}
