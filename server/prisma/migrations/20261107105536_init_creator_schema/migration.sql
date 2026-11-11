-- CreateTable
CREATE TABLE "creator_profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "professional_title" TEXT NOT NULL,
    "organization" TEXT,
    "location" TEXT,
    "introduction" TEXT,
    "biography" TEXT,
    "profile_image" TEXT,
    "social_links" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "creator_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creator_skills" (
    "id" UUID NOT NULL,
    "creator_profile_id" UUID NOT NULL,
    "skill_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "creator_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creator_achievements" (
    "id" UUID NOT NULL,
    "creator_profile_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "issuing_organization" TEXT,
    "achievement_type" TEXT NOT NULL DEFAULT 'AWARD',
    "year" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "creator_achievements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "creator_profiles_user_id_key" ON "creator_profiles"("user_id");

-- CreateIndex
CREATE INDEX "creator_profiles_professional_title_idx" ON "creator_profiles"("professional_title");

-- CreateIndex
CREATE INDEX "creator_profiles_location_idx" ON "creator_profiles"("location");

-- CreateIndex
CREATE INDEX "creator_skills_creator_profile_id_idx" ON "creator_skills"("creator_profile_id");

-- CreateIndex
CREATE INDEX "creator_skills_skill_name_idx" ON "creator_skills"("skill_name");

-- CreateIndex
CREATE UNIQUE INDEX "creator_skills_creator_profile_id_skill_name_key" ON "creator_skills"("creator_profile_id", "skill_name");

-- CreateIndex
CREATE INDEX "creator_achievements_creator_profile_id_idx" ON "creator_achievements"("creator_profile_id");

-- CreateIndex
CREATE INDEX "creator_achievements_achievement_type_idx" ON "creator_achievements"("achievement_type");

-- AddForeignKey
ALTER TABLE "creator_skills" ADD CONSTRAINT "creator_skills_creator_profile_id_fkey" FOREIGN KEY ("creator_profile_id") REFERENCES "creator_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "creator_achievements" ADD CONSTRAINT "creator_achievements_creator_profile_id_fkey" FOREIGN KEY ("creator_profile_id") REFERENCES "creator_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
