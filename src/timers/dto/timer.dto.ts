import { IsArray, IsNumber, IsOptional } from 'class-validator';

export class UpdateTagsForTimerDto {
  @IsArray()
  tagIds: number[];
}

export class AssignProjectToTimerDto {
  @IsNumber()
  @IsOptional()
  projectId: number;
}
