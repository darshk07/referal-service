/*
  Warnings:

  - You are about to drop the column `rewardStatus` on the `Reward` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reward" DROP COLUMN "rewardStatus",
ALTER COLUMN "rewardIssueDate" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT NOT NULL DEFAULT '';
