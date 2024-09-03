import { AssignmentEntity } from 'src/assignments/assignments.entity';
import { RoleSettingEntity } from 'src/role-settings/role-settings.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('domains')
export class DomainEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'uuid', nullable: true })
  parentId: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(() => DomainEntity, (domain) => domain.parentId)
  children: DomainEntity[];

  @OneToMany(() => RoleSettingEntity, (roleSettings) => roleSettings.domain)
  roleSettings: RoleSettingEntity[];

  @OneToMany(() => AssignmentEntity, (assignment) => assignment.domain)
  assignments: AssignmentEntity[];
}
