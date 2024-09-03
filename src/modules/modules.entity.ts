import { RoleSettingEntity } from 'src/role-settings/role-settings.entity';
import { TrashEntity } from 'src/trash/trash.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('modules')
export class ModulesEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  constant: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(() => RoleSettingEntity, (roleSetting) => roleSetting.module)
  roleSettings: RoleSettingEntity[];

  @OneToMany(() => TrashEntity, (trash) => trash.module)
  trash: TrashEntity[];
}
