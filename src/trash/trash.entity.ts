import { ModulesEntity } from 'src/modules/modules.entity';
import { UserEntity } from 'src/users/users.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('trash')
export class TrashEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  moduleId: string;

  @Column({ type: 'uuid' })
  moduleDataId: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column()
  data: string;

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

  @ManyToOne(() => ModulesEntity, (module) => module.trash)
  module: ModulesEntity;
}
