import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { User } from "./User";
import { Book } from "./Book";

@Entity("borrows")
export class Borrow {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.borrows, { onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => Book, (book) => book.borrows, { onDelete: "CASCADE" })
  book: Book;

  @Column({ type: "varchar" })
  borrowedAt: string;

  @Column({ type: "varchar", nullable: true })
  returnedAt: string | null;

  @Column({ type: "float", nullable: true })
  rating: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
