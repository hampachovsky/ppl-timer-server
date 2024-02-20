import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTimerDto {
  @IsBoolean()
  @IsOptional()
  isRunning: boolean;

  @IsNotEmpty()
  @IsString()
  timerName: string;

  @IsString()
  @IsOptional()
  timerDescription: string;

  @IsNumber()
  @IsOptional()
  timerSummary: number;
}
