-- AlterEnum
ALTER TYPE "UserAccessStatus" ADD VALUE 'inactive';

-- AlterTable
ALTER TABLE "UserAccess" ADD COLUMN     "offboardingChecklist" JSONB,
ADD COLUMN     "onboardingChecklist" JSONB;
