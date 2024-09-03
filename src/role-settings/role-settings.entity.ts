import { DomainEntity } from 'src/domain/domain.entity';
import { ModulesEntity } from 'src/modules/modules.entity';
import { RoleEntity } from 'src/roles/roles.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum RoleSettingAction {
  READ,
  CREATE,
  UPDATE,
  DELETE,
}

@Entity('role_settings')
export class RoleSettingEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  domainId: string;

  @Column({ type: 'uuid' })
  moduleId: string;

  @Column({ type: 'uuid' })
  roleId: string;

  @Column({
    type: 'enum',
    enum: RoleSettingAction,
    default: RoleSettingAction.READ,
  })
  action: RoleSettingAction;

  @Column()
  isAllowed: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => DomainEntity, (domain) => domain.roleSettings)
  domain: DomainEntity;

  @ManyToOne(() => RoleEntity, (role) => role.roleSettings)
  role: RoleEntity;

  @ManyToOne(() => ModulesEntity, (mdl) => mdl.roleSettings)
  module: ModulesEntity;
}
