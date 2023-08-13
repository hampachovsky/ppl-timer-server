import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
}
