import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TaskType } from 'src/types';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  task: string;

  @IsEnum(TaskType)
  @IsOptional()
  taskType: TaskType;

  @IsNumber()
  projectId: number;
}
