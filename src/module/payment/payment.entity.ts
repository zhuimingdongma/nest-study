import { BankStatus } from 'src/common/enum/public.enum';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity({ name: 'user_payment' })
export class UserPaymentEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column({ type: 'varchar', nullable: true, comment: '银行卡号' })
  bank_number: string;

  @Column({ type: 'varchar', nullable: true, comment: '银行卡名' })
  bank_of: string;

  @Column({ type: 'varchar', nullable: true, comment: '银行卡户主名' })
  bank_name: string;

  @Column({
    type: 'varchar',
    default: BankStatus.NORMAL,
    comment: '用户对应收款银行卡状态',
  })
  status: BankStatus;

  @CreateDateColumn()
  createdTime: Date;

  @UpdateDateColumn()
  updatedTime: Date;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @BeforeInsert()
  setNextId() {
    this.id += Math.floor(Math.random() * 10);
  }
}
