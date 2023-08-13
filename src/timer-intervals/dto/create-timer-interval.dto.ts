import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateTimerIntervalDto {
  @IsDateString()
  start: Date | null;

  @IsDateString()
  @IsOptional()
  end: Date | null;

  @IsNumber()
  @IsOptional()
  duration: number | null;

  @IsNumber()
  @IsNotEmpty()
  timerId: number;
}
