import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
//import env
import dotenv from "dotenv";

const prismaClient = new PrismaClient();

const secret: string = process.env.JWT_SECRET || "";

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;
  console.log(token);
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, secret) as { userId: string };

    const user = await prismaClient.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
