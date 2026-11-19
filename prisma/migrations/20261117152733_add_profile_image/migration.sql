-- CreateTable
CREATE TABLE "ProfileImage" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'main',
    "data" BLOB NOT NULL,
    "mimeType" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);
