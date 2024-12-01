import { Request, Response } from "express";

import { bookService } from "../services/bookService";

export const bookController = {
  async listBooks(req: Request, res: Response): Promise<Response> {
    try {
      const books = await bookService.listBooks();
      return res.status(200).json(books);
    } catch (error: any) {
      return res.status(500).json({
        message: "Failed to fetch books. Please try again later.",
      });
    }
  },

  async getBookInfo(req: Request, res: Response): Promise<Response> {
    const { bookId } = req.params;

    try {
      if (!bookId || isNaN(Number(bookId))) {
        return res.status(400).json({
          message: "Invalid book ID. Please provide a valid numeric ID.",
        });
      }

      const book = await bookService.getBookInfo(bookId);
      return res.status(200).json(book);
    } catch (error: any) {
      if (error.code === 1102) {
        return res.status(404).json({
          message: error.message,
        });
      }
      return res.status(500).json({
        message: error.message || "Failed to fetch book details.",
      });
    }
  },

  async createBook(req: Request, res: Response): Promise<Response> {
    const { name } = req.body;

    try {
      await bookService.createBook(name);
      return res.status(201).json();
    } catch (error: any) {
      if (error.code === 1101) {
        return res.status(409).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: "Failed to create book. Please try again later.",
      });
    }
  },
};

export default bookController;
