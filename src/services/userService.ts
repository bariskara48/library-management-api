import dayjs from "dayjs";

import { AppDataSource } from "../db/index";
import { User } from "../db/models/User";
import { Borrow } from "../db/models/Borrow";
import CustomError from "./error";

export const userService = {
  userRepository: AppDataSource.getRepository(User),
  borrowRepository: AppDataSource.getRepository(Borrow),

  async listUsers() {
    const users = await this.userRepository.find({
      select: ["givenId", "name"],
    });

    return users.map((user) => ({
      id: user.givenId,
      name: user.name,
    }));
  },

  async getUserInfo(givenId: number) {
    const user = await this.userRepository.findOne({
      where: { givenId } as any,
      relations: ["borrows", "borrows.book"],
    });

    if (!user) {
      throw new CustomError(1102, "User not found.");
    }

    // Separate books into past and present
    const pastBooks = user.borrows
      .filter((borrow) => borrow.returnedAt !== null)
      .map((borrow) => ({
        id: borrow.book.givenId,
        name: borrow.book.name,
        borrowDate: borrow.borrowedAt,
        returnDate: borrow.returnedAt,
        score: borrow.rating,
      }))
      .sort((a, b) =>
        dayjs(a.returnDate, "DD/MM/YYYY HH:mm:ss").isBefore(
          dayjs(b.returnDate, "DD/MM/YYYY HH:mm:ss")
        )
          ? -1
          : 1
      ); // Sort by returnedAt

    const presentBooks = user.borrows
      .filter((borrow) => borrow.returnedAt === null)
      .map((borrow) => ({
        id: borrow.book.givenId,
        name: borrow.book.name,
        borrowDate: borrow.borrowedAt,
        score: borrow.rating,
      }))
      .sort((a, b) =>
        dayjs(a.borrowDate, "DD/MM/YYYY HH:mm:ss").isBefore(
          dayjs(b.borrowDate, "DD/MM/YYYY HH:mm:ss")
        )
          ? -1
          : 1
      ); // Sort by borrowDate

    return {
      id: user.givenId,
      name: user.name,
      books: {
        past: pastBooks,
        present: presentBooks,
      },
    };
  },

  async createUser(name: string) {
    const existingUser = await this.userRepository.findOne({ where: { name } });
    if (existingUser) {
      throw new CustomError(1101, "User already exists.");
    }

    const countOfUsers = (await this.userRepository.find()).length;
    const newUser = this.userRepository.create({
      name,
      givenId: countOfUsers + 1,
    });

    return await this.userRepository.save(newUser);
  },
};
