import { NextFunction, Request, Response } from "express";
import { check, validationResult } from "express-validator";

export const createBookValidation = [
  check("name")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("Book name cannot be empty!")
    .bail()
    .matches(/^(?=.*[a-zA-Z])[a-zA-Z0-9]+$/)
    .withMessage(
      "Book name must contain at least one letter and only letters and numbers!"
    )
    .bail(),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.headers["content-type"] !== "application/json") {
      return res
        .status(400)
        .json({ error: "Content-Type must be application/json." });
    }

    const invalidKeys = Object.keys(req.body).filter((key) => key !== "name");
    if (invalidKeys.length > 0) {
      return res.status(400).json({
        message: `Invalid fields: ${invalidKeys.join(", ")}`,
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    next();
  },
];
