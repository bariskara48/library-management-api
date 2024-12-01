import { Router } from "express";

import bookController from "../controllers/bookController";
import { createBookValidation } from "../validators/createBook";

const router = Router();

// List books
router.get("/", bookController.listBooks as any);
// Get book information by id
router.get("/:bookId", bookController.getBookInfo as any);
// Create a new book
router.post("/", createBookValidation as any, bookController.createBook as any);

export default router;
