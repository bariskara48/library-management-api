import express, { Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";

import booksRoute from "./routes/bookRoutes";
import usersRoute from "./routes/userRoutes";
import { initializeDatabase } from "./db";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/users", usersRoute);
app.use("/books", booksRoute);

initializeDatabase().then();

app.get("/", (req: Request, res: Response) => {
  res.send("Hi! Invent Analytics Dev Team!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
