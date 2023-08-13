import { PartialType } from '@nestjs/mapped-types';
import { CreateTimerIntervalDto } from './create-timer-interval.dto';

export class UpdateTimerIntervalDto extends PartialType(
  CreateTimerIntervalDto,
) {}
