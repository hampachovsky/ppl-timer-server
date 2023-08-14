import { IsArray } from 'class-validator';

export class UpdateTagsForTimerDto {
  @IsArray()
  tagIds: number[];
}
