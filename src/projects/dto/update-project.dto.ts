import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateProjectDto } from './create-project.dto';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @IsString()
  @IsOptional()
  projectDescription: string;

  @IsString()
  @IsOptional()
  note: string;

  @IsBoolean()
  @IsOptional()
  archived: boolean;

  @IsBoolean()
  @IsOptional()
  billable: boolean;

  @IsNumber()
  @IsOptional()
  hourlyRate: number;
}
