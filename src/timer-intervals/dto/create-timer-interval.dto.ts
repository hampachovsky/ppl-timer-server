import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateTimerIntervalDto {
  @IsDateString()
  intervalStart: Date | null;

  @IsDateString()
  @IsOptional()
  intervalEnd: Date | null;

  @IsNumber()
  @IsOptional()
  intervalDuration: number | null;

  @IsNumber()
  @IsNotEmpty()
  timerId: number;
}
