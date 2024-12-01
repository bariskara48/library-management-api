import { Request, Response } from "express";

import { userService } from "../services/userService";
import { borrowService } from "../services/borrowService";

export const userController = {
  async listUsers(req: Request, res: Response): Promise<Response> {
    try {
      const users = await userService.listUsers();
      return res.status(200).json(users);
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Internal Server Error.",
      });
    }
  },

  async getUserInfo(req: Request, res: Response): Promise<Response> {
    const { userId } = req.params as { userId: unknown };

    try {
      if (!userId || isNaN(Number(userId))) {
        return res.status(400).json({
          message: "Invalid user ID. Please provide a valid numeric ID.",
        });
      }

      const user = await userService.getUserInfo(userId as number);
      return res.status(200).json(user);
    } catch (error: any) {
      if (error.code === 1102) {
        return res.status(404).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: error.message || "Internal Server Error.",
      });
    }
  },

  async createUser(req: Request, res: Response): Promise<Response> {
    const { name } = req.body;

    try {
      if (!name || typeof name !== "string") {
        return res.status(400).json({
          message: "Invalid user name. Please provide a valid name.",
        });
      }

      await userService.createUser(name);
      return res.status(201).json();
    } catch (error: any) {
      if (error.code === 1101) {
        return res.status(409).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: "Failed to create user. Please try again later.",
      });
    }
  },

  // Borrow a book
  async borrowBook(req: Request, res: Response): Promise<any> {
    const { userId, bookId } = req.params as {
      userId: unknown;
      bookId: unknown;
    };

    if (!userId || isNaN(Number(userId))) {
      return res.status(400).json({
        message: "Invalid user ID. Please provide a valid numeric ID.",
      });
    }

    if (!bookId || isNaN(Number(bookId))) {
      return res.status(400).json({
        message: "Invalid book ID. Please provide a valid numeric ID.",
      });
    }

    try {
      await borrowService.borrowBook(userId as number, bookId as number);
      return res.status(204).json();
    } catch (error: any) {
      if (error.code === 1101) {
        return res.status(409).json({
          message: error.message,
        });
      } else if (error.code === 1102) {
        return res.status(404).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: error.message || "Internal Server Error.",
      });
    }
  },

  // Return a book and give a rating
  async returnBook(req: Request, res: Response): Promise<any> {
    const { userId, bookId } = req.params as {
      userId: unknown;
      bookId: unknown;
    };
    const { score } = req.body;

    try {
      await borrowService.returnBook(
        userId as number,
        bookId as number,
        score as number
      );
      return res.status(204).json();
    } catch (error: any) {
      if (error.code === 1101) {
        return res.status(409).json({
          message: error.message,
        });
      } else if (error.code === 1102) {
        return res.status(404).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: error.message || "Internal Server Error.",
      });
    }
  },
};

export default userController;
