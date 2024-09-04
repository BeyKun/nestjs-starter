import { AssignmentEntity } from 'src/assignments/assignments.entity';
import { TrashEntity } from 'src/trash/trash.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(() => AssignmentEntity, (assignment) => assignment.user)
  assignments: AssignmentEntity[];

  @OneToMany(() => TrashEntity, (trash) => trash.user)
  trash: TrashEntity[];
}
