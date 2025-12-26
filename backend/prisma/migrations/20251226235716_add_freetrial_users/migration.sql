-- CreateTable
CREATE TABLE "FreetrialUsers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "occupation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FreetrialUsers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FreetrialUsers_email_key" ON "FreetrialUsers"("email");

-- CreateIndex
CREATE INDEX "FreetrialUsers_email_idx" ON "FreetrialUsers"("email");

