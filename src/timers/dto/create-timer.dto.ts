import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTimerDto {
  @IsDateString()
  @IsNotEmpty()
  timerDates: Date;

  @IsNumber()
  timerSummary: number;

  @IsBoolean()
  isRunning: boolean;

  @IsNotEmpty()
  @IsString()
  timerName: string;

  @IsString()
  @IsOptional()
  timerDescription: string;
}
