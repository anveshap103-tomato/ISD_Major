-- AlterTable
ALTER TABLE "creator_profiles" ADD COLUMN     "category" TEXT,
ADD COLUMN     "experience_years" INTEGER;

-- CreateIndex
CREATE INDEX "creator_profiles_category_idx" ON "creator_profiles"("category");
