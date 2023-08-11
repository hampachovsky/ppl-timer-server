import {
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTimerDto {
  @IsObject()
  @IsNotEmpty()
  timerInterval: {
    start: Date;
    end: Date;
    duration: number;
  };

  @IsBoolean()
  @IsOptional()
  isRunning: boolean;

  @IsNotEmpty()
  @IsString()
  timerName: string;

  @IsString()
  @IsOptional()
  timerDescription: string;
}
