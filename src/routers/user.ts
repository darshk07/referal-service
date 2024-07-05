import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { generateRandomCode } from "../utils/generateRandomCode";
import dotenv from "dotenv";
import md5 from "md5";

const router = Router();

const prismaClient = new PrismaClient();

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await prismaClient.user.findFirst({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      if (existingUser.password !== md5(password)) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const token = jwt.sign(
        {
          userId: existingUser.id,
        },
        process.env.JWT_SECRET || ""
      );

      res.json({ token });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { email, name, password } = req.body;

    //check if already created

    const existingUser = await prismaClient.user.findFirst({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Step 1: Create the new user (User B)
    const newUser = await prismaClient.user.create({
      data: {
        email,
        name,
        referrerCode: generateRandomCode(), // Implement this function to generate unique codes,
        password: md5(password),
      },
    });

    // Step 2: Check if there's a pending referral for this email
    const referral = await prismaClient.referral.findFirst({
      where: { referredEmail: email },
    });

    if (referral) {
      // Step 3: Update the referral status to 'completed'
      await prismaClient.referral.update({
        where: { id: referral.id },
        data: { referralStatus: "completed" },
      });

      // Step 4: Create a reward for the referrer (User A)
      await prismaClient.reward.create({
        data: {
          userId: referral.referrerId,
          rewardAmount: 10.0, // Set your reward amount
        },
      });
    }

    console.log("User signed up and referral processed:", newUser);
    res.json(newUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
