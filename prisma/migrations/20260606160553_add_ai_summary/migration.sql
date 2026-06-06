-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "aiSummary" TEXT,
ADD COLUMN     "aiSummaryError" TEXT,
ADD COLUMN     "aiSummaryStatus" TEXT DEFAULT 'pending';
