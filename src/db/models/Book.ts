import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { Borrow } from "./Borrow";

@Entity("books")
export class Book {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "int", unique: true })
  givenId: number;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "float", default: 0, nullable: true })
  averageRating: number;

  @Column({ type: "boolean", default: false })
  isBorrowed: boolean;

  @OneToMany(() => Borrow, (borrow) => borrow.book)
  borrows: Borrow[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
