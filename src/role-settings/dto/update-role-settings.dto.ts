import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleSettingsDto } from './create-role-settings.dto';
export class UpdateRoleSettingsDto extends PartialType(CreateRoleSettingsDto) {}
