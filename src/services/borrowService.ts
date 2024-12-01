import dayjs from "dayjs";
import { IsNull } from "typeorm";

import { User } from "../db/models/User";
import { Book } from "../db/models/Book";
import { Borrow } from "../db/models/Borrow";
import CustomError from "./error";
import { AppDataSource } from "../db";

export const borrowService = {
  userRepository: AppDataSource.getRepository(User),
  bookRepository: AppDataSource.getRepository(Book),
  borrowRepository: AppDataSource.getRepository(Borrow),

  async borrowBook(userId: number, bookId: number) {
    const user = await this.userRepository.findOne({
      where: { givenId: userId } as any,
    });
    if (!user) {
      throw new CustomError(1102, "User not found.");
    }

    const book = await this.bookRepository.findOne({
      where: { givenId: bookId } as any,
    });
    if (!book) {
      throw new CustomError(1102, "Book not found.");
    }

    if (book.isBorrowed) {
      throw new CustomError(1101, "This book is already borrowed.");
    }

    book.isBorrowed = true;
    await this.bookRepository.save(book);

    const borrow = this.borrowRepository.create({
      user: user,
      book: book,
      borrowedAt: dayjs().format("DD/MM/YYYY HH:mm:ss"),
      returnedAt: null,
      rating: null,
    });
    await this.borrowRepository.save(borrow);

    return borrow;
  },

  async returnBook(userId: number, bookId: number, rating: number | null) {
    const borrow = await this.borrowRepository.findOne({
      where: {
        user: { givenId: userId },
        book: { givenId: bookId },
        returnedAt: IsNull(),
      },
    } as any);

    if (!borrow) {
      throw new CustomError(
        1102,
        "No active borrow found for this user and book."
      );
    }

    borrow.returnedAt = dayjs().format("DD/MM/YYYY HH:mm:ss");
    borrow.rating = rating || null;
    await this.borrowRepository.save(borrow);

    const borrows = await this.borrowRepository.find({
      where: { book: { givenId: bookId } } as any,
    });
    const totalRating = borrows.reduce(
      (sum, borrow) => sum + (borrow.rating || 0),
      0
    );
    const averageRating = totalRating / borrows.length;

    const book = await this.bookRepository.findOne({
      where: { givenId: bookId } as any,
    });
    book!.averageRating = averageRating;
    // Book can be barrowed by another users
    book!.isBorrowed = false;
    await this.bookRepository.save(book!);

    return { borrow, newAverageRating: averageRating };
  },
};
