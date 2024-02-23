import { IsArray, IsDateString, IsNumber, IsOptional } from 'class-validator';

export class UpdateTagsForTimerDto {
  @IsArray()
  tagIds: number[];
}

export class AssignProjectToTimerDto {
  @IsNumber()
  @IsOptional()
  projectId: number;
}

export class StopTimerDto {
  @IsNumber()
  intervalId: number;

  @IsDateString()
  intervalEnd: Date;

  @IsNumber()
  intervalDuration: number;
}

export class StartTimerDto {
  @IsDateString()
  intervalStart: Date;
}
