import {
  IsHexColor,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  projectName: string;

  @IsHexColor()
  @IsNotEmpty()
  color: string;

  @IsNumber()
  @IsOptional()
  clientId: number;
}
