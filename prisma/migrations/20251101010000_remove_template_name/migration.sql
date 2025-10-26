-- Drop indexes referencing slug/name
DROP INDEX IF EXISTS "AiAvatarTemplate_slug_key";

ALTER TABLE "AiAvatarTemplate"
  DROP COLUMN IF EXISTS "name",
  DROP COLUMN IF EXISTS "slug";
