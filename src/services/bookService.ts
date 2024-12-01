import { AppDataSource } from "../db/index";
import { Book } from "../db/models/Book";
import CustomError from "./error";

export const bookService = {
  bookRepository: AppDataSource.getRepository(Book),

  async listBooks() {
    const books = await this.bookRepository.find({
      select: ["givenId", "name"],
    });

    return books.map((book) => ({
      id: book.givenId,
      name: book.name,
    }));
  },

  async getBookInfo(givenId: string) {
    const book = await this.bookRepository.findOne({
      where: { givenId } as any,
    });

    if (!book) {
      throw new CustomError(1102, "Book not found.");
    }
    return {
      id: book.givenId,
      name: book.name,
      score: book.averageRating,
    };
  },

  async createBook(name: string) {
    const existingUser = await this.bookRepository.findOne({ where: { name } });
    if (existingUser) {
      throw new CustomError(
        1101,
        "Book already exists, please provide different name."
      );
    }

    const countOfBook = (await this.bookRepository.find()).length;
    const newBook = this.bookRepository.create({
      name,
      givenId: countOfBook + 1,
    });

    return await this.bookRepository.save(newBook);
  },
};
