import { DomainEntity } from 'src/domain/domain.entity';
import { RoleEntity } from 'src/roles/roles.entity';
import { UserEntity } from 'src/users/users.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('assignments')
export class AssignmentEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  domainId: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  roleId: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.assignments)
  user: UserEntity;

  @ManyToOne(() => DomainEntity, (domain) => domain.assignments)
  domain: DomainEntity;

  @ManyToOne(() => RoleEntity, (role) => role.assignments)
  role: RoleEntity;
}
