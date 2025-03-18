-- CreateTable
CREATE TABLE "Comments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "author" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "post_slug" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX idx_comments_post_slug ON comments (post_slug);
