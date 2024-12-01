import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { Borrow } from "./Borrow";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "int", unique: true })
  givenId: number;

  @Column({ type: "varchar", length: 100 })
  name: string;

  @OneToMany(() => Borrow, (borrow) => borrow.user)
  borrows: Borrow[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
