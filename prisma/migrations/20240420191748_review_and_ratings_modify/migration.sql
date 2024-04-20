/*
  Warnings:

  - A unique constraint covering the columns `[bookId,userId]` on the table `review_and_ratings` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "review_and_ratings_bookId_userId_key" ON "review_and_ratings"("bookId", "userId");
