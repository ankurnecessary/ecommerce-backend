-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('dashboardUser', 'user');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'user';
