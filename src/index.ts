import express, { Request, Response } from "express";

const app = express();

import userRouter from "./routers/user";
import refferalRouter from "./routers/referrer";
import dotenv from "dotenv";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRouter);
app.use("/referal", refferalRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
