import { NextFunction, Request, Response } from "express";
import { check, validationResult } from "express-validator";

export const returnBookValidation = [
  check("score")
    .not()
    .isEmpty()
    .withMessage("Score cannot be empty!")
    .bail()
    .isFloat({ min: 0 })
    .withMessage("Score must be a positive number!")
    .bail(),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.headers["content-type"] !== "application/json") {
      return res
        .status(400)
        .json({ error: "Content-Type must be application/json." });
    }

    const { userId, bookId } = req.params;

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

    const invalidKeys = Object.keys(req.body).filter((key) => key !== "score");
    if (invalidKeys.length > 0) {
      return res.status(400).json({
        message: `Invalid fields: ${invalidKeys.join(", ")}`,
      });
    }

    const { score } = req.body;

    if (typeof score !== "number") {
      return res.status(400).json({
        message: "Score must be a number.",
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    next();
  },
];
