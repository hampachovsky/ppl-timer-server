import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class CreateTagDto {
  @IsBoolean()
  @IsOptional()
  archived: boolean;

  @IsString()
  @IsNotEmpty()
  tagName: string;
}
