import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { createConnection } from "mysql2";

import { Book } from "./models/Book";
import { Borrow } from "./models/Borrow";
import { User } from "./models/User";

dotenv.config();

export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as "mysql",
  driver: createConnection,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Book, Borrow, User],
  synchronize: true,
  logging: false,
});

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Database initialized successfully");
  } catch (error) {
    console.error(
      "Database cannot initialized, please check error message: ",
      error
    );
    process.exit(1);
  }
};
