import { Router } from "express";

import { userController } from "../controllers/userController";
import { createUserValidation } from "../validators/createUser";
import { returnBookValidation } from "../validators/returnBook";

const userRouter = Router();

// List all users
userRouter.get("/", userController.listUsers as any);
// Get user
userRouter.get("/:userId", userController.getUserInfo as any);
// Create user
userRouter.post(
  "/",
  createUserValidation as any,
  userController.createUser as any
);
// Borrow a book
userRouter.post("/:userId/borrow/:bookId", userController.borrowBook);
// Return a book
userRouter.post(
  "/:userId/return/:bookId",
  returnBookValidation as any,
  userController.returnBook
);

export default userRouter;
