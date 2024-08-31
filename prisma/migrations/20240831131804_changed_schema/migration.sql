/*
  Warnings:

  - The primary key for the `Testimonial` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Workspace` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Testimonial" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "ratings" REAL NOT NULL,
    "review" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" DATETIME NOT NULL,
    "workspaceId" TEXT NOT NULL,
    CONSTRAINT "Testimonial_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Testimonial" ("createdAt", "email", "id", "name", "ratings", "review", "updatedat", "workspaceId") SELECT "createdAt", "email", "id", "name", "ratings", "review", "updatedat", "workspaceId" FROM "Testimonial";
DROP TABLE "Testimonial";
ALTER TABLE "new_Testimonial" RENAME TO "Testimonial";
CREATE INDEX "Testimonial_id_idx" ON "Testimonial"("id");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "bio" TEXT,
    "firstName" TEXT NOT NULL,
    "usage" TEXT NOT NULL DEFAULT 'personal',
    "campanyName" TEXT,
    "numberOfEmployees" INTEGER,
    "lastName" TEXT,
    "subscriptionPlan" TEXT NOT NULL DEFAULT 'free',
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" DATETIME NOT NULL,
    "password" TEXT NOT NULL
);
INSERT INTO "new_User" ("bio", "createdAt", "email", "firstName", "id", "lastName", "password", "role", "subscriptionPlan", "updatedat") SELECT "bio", "createdAt", "email", "firstName", "id", "lastName", "password", "role", "subscriptionPlan", "updatedat" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE TABLE "new_Workspace" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "details" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" DATETIME NOT NULL,
    "ownerId" TEXT NOT NULL,
    CONSTRAINT "Workspace_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Workspace" ("createdAt", "details", "id", "ownerId", "title", "updatedat") SELECT "createdAt", "details", "id", "ownerId", "title", "updatedat" FROM "Workspace";
DROP TABLE "Workspace";
ALTER TABLE "new_Workspace" RENAME TO "Workspace";
CREATE INDEX "Workspace_id_idx" ON "Workspace"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
