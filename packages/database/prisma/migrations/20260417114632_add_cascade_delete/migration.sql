-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Collaborator" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "wishlistId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'viewer',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Collaborator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Collaborator_wishlistId_fkey" FOREIGN KEY ("wishlistId") REFERENCES "Wishlist" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Collaborator" ("createdAt", "id", "role", "userId", "wishlistId") SELECT "createdAt", "id", "role", "userId", "wishlistId" FROM "Collaborator";
DROP TABLE "Collaborator";
ALTER TABLE "new_Collaborator" RENAME TO "Collaborator";
CREATE UNIQUE INDEX "Collaborator_wishlistId_userId_key" ON "Collaborator"("wishlistId", "userId");
CREATE TABLE "new_InviteLink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "wishlistId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "InviteLink_wishlistId_fkey" FOREIGN KEY ("wishlistId") REFERENCES "Wishlist" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_InviteLink" ("createdAt", "expiresAt", "id", "token", "wishlistId") SELECT "createdAt", "expiresAt", "id", "token", "wishlistId" FROM "InviteLink";
DROP TABLE "InviteLink";
ALTER TABLE "new_InviteLink" RENAME TO "InviteLink";
CREATE UNIQUE INDEX "InviteLink_token_key" ON "InviteLink"("token");
CREATE TABLE "new_Item" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "currency" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'want',
    "link" TEXT NOT NULL,
    "image" TEXT NOT NULL DEFAULT 'Image',
    "wishlistId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Item_wishlistId_fkey" FOREIGN KEY ("wishlistId") REFERENCES "Wishlist" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Item" ("createdAt", "currency", "id", "image", "link", "name", "price", "status", "updatedAt", "wishlistId") SELECT "createdAt", "currency", "id", "image", "link", "name", "price", "status", "updatedAt", "wishlistId" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
