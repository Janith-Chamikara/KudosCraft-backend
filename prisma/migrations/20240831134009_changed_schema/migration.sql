/*
  Warnings:

  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "bio" TEXT,
    "name" TEXT,
    "usage" TEXT NOT NULL DEFAULT 'personal',
    "campanyName" TEXT,
    "numberOfEmployees" INTEGER,
    "job" TEXT,
    "subscriptionPlan" TEXT NOT NULL DEFAULT 'free',
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" DATETIME NOT NULL,
    "password" TEXT NOT NULL
);
INSERT INTO "new_User" ("bio", "campanyName", "createdAt", "email", "id", "job", "numberOfEmployees", "password", "role", "subscriptionPlan", "updatedat", "usage") SELECT "bio", "campanyName", "createdAt", "email", "id", "job", "numberOfEmployees", "password", "role", "subscriptionPlan", "updatedat", "usage" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_email_idx" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
