import { MigrationInterface, QueryRunner } from "typeorm";

/** Check if a column exists on a table (public schema). */
async function columnExists(
  queryRunner: QueryRunner,
  table: string,
  column: string
): Promise<boolean> {
  const rows = await queryRunner.query(
    `SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = $1 AND column_name = $2 LIMIT 1`,
    [table, column]
  );
  return Array.isArray(rows) && rows.length > 0;
}

/**
 * Bilingual (Arabic/English) schema: add _en/_ar columns, backfill from existing (if old columns exist), drop old columns.
 * Safe when DB was created with new entities (no old single-language columns).
 */
export class BilingualI18nSchema1738860000000 implements MigrationInterface {
  name = "BilingualI18nSchema1738860000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ----- Category -----
    await queryRunner.query(`ALTER TABLE "category" ADD COLUMN IF NOT EXISTS "name_en" character varying(100)`);
    await queryRunner.query(`ALTER TABLE "category" ADD COLUMN IF NOT EXISTS "name_ar" character varying(100)`);
    await queryRunner.query(`ALTER TABLE "category" ADD COLUMN IF NOT EXISTS "description_en" text`);
    await queryRunner.query(`ALTER TABLE "category" ADD COLUMN IF NOT EXISTS "description_ar" text`);
    await queryRunner.query(`ALTER TABLE "category" ADD COLUMN IF NOT EXISTS "meta_title_en" character varying`);
    await queryRunner.query(`ALTER TABLE "category" ADD COLUMN IF NOT EXISTS "meta_title_ar" character varying`);
    await queryRunner.query(`ALTER TABLE "category" ADD COLUMN IF NOT EXISTS "meta_description_en" text`);
    await queryRunner.query(`ALTER TABLE "category" ADD COLUMN IF NOT EXISTS "meta_description_ar" text`);
    if (await columnExists(queryRunner, "category", "name")) {
      await queryRunner.query(`UPDATE "category" SET "name_en" = "name", "name_ar" = "name" WHERE "name" IS NOT NULL`);
      await queryRunner.query(`ALTER TABLE "category" DROP COLUMN IF EXISTS "name"`);
    }
    if (await columnExists(queryRunner, "category", "description")) {
      await queryRunner.query(`UPDATE "category" SET "description_en" = "description", "description_ar" = "description" WHERE "description" IS NOT NULL`);
      await queryRunner.query(`ALTER TABLE "category" DROP COLUMN IF EXISTS "description"`);
    }
    if (await columnExists(queryRunner, "category", "meta_title")) {
      await queryRunner.query(`UPDATE "category" SET "meta_title_en" = "meta_title", "meta_title_ar" = "meta_title" WHERE "meta_title" IS NOT NULL`);
      await queryRunner.query(`ALTER TABLE "category" DROP COLUMN IF EXISTS "meta_title"`);
    }
    if (await columnExists(queryRunner, "category", "meta_description")) {
      await queryRunner.query(`UPDATE "category" SET "meta_description_en" = "meta_description", "meta_description_ar" = "meta_description" WHERE "meta_description" IS NOT NULL`);
      await queryRunner.query(`ALTER TABLE "category" DROP COLUMN IF EXISTS "meta_description"`);
    }

    // ----- Product -----
    await queryRunner.query(`ALTER TABLE "product" ADD COLUMN IF NOT EXISTS "name_en" character varying(200)`);
    await queryRunner.query(`ALTER TABLE "product" ADD COLUMN IF NOT EXISTS "name_ar" character varying(200)`);
    await queryRunner.query(`ALTER TABLE "product" ADD COLUMN IF NOT EXISTS "description_en" text`);
    await queryRunner.query(`ALTER TABLE "product" ADD COLUMN IF NOT EXISTS "description_ar" text`);
    await queryRunner.query(`ALTER TABLE "product" ADD COLUMN IF NOT EXISTS "short_description_en" text`);
    await queryRunner.query(`ALTER TABLE "product" ADD COLUMN IF NOT EXISTS "short_description_ar" text`);
    await queryRunner.query(`ALTER TABLE "product" ADD COLUMN IF NOT EXISTS "meta_title_en" character varying`);
    await queryRunner.query(`ALTER TABLE "product" ADD COLUMN IF NOT EXISTS "meta_title_ar" character varying`);
    await queryRunner.query(`ALTER TABLE "product" ADD COLUMN IF NOT EXISTS "meta_description_en" text`);
    await queryRunner.query(`ALTER TABLE "product" ADD COLUMN IF NOT EXISTS "meta_description_ar" text`);
    if (await columnExists(queryRunner, "product", "name")) {
      await queryRunner.query(`UPDATE "product" SET "name_en" = "name", "name_ar" = "name" WHERE "name" IS NOT NULL`);
      await queryRunner.query(`ALTER TABLE "product" DROP COLUMN IF EXISTS "name"`);
    }
    if (await columnExists(queryRunner, "product", "description")) {
      await queryRunner.query(`UPDATE "product" SET "description_en" = "description", "description_ar" = "description" WHERE "description" IS NOT NULL`);
      await queryRunner.query(`ALTER TABLE "product" DROP COLUMN IF EXISTS "description"`);
    }
    if (await columnExists(queryRunner, "product", "short_description")) {
      await queryRunner.query(`UPDATE "product" SET "short_description_en" = "short_description", "short_description_ar" = "short_description" WHERE "short_description" IS NOT NULL`);
      await queryRunner.query(`ALTER TABLE "product" DROP COLUMN IF EXISTS "short_description"`);
    }
    await queryRunner.query(`
      UPDATE "product" SET
        "meta_title_en" = "seo_data"->>'meta_title',
        "meta_title_ar" = "seo_data"->>'meta_title',
        "meta_description_en" = "seo_data"->>'meta_description',
        "meta_description_ar" = "seo_data"->>'meta_description'
      WHERE "seo_data" IS NOT NULL
    `);

    // ----- Package -----
    await queryRunner.query(`ALTER TABLE "package" ADD COLUMN IF NOT EXISTS "name_en" character varying(200)`);
    await queryRunner.query(`ALTER TABLE "package" ADD COLUMN IF NOT EXISTS "name_ar" character varying(200)`);
    await queryRunner.query(`ALTER TABLE "package" ADD COLUMN IF NOT EXISTS "description_en" text`);
    await queryRunner.query(`ALTER TABLE "package" ADD COLUMN IF NOT EXISTS "description_ar" text`);
    if (await columnExists(queryRunner, "package", "name")) {
      await queryRunner.query(`UPDATE "package" SET "name_en" = "name", "name_ar" = "name" WHERE "name" IS NOT NULL`);
      await queryRunner.query(`ALTER TABLE "package" DROP COLUMN IF EXISTS "name"`);
    }
    if (await columnExists(queryRunner, "package", "description")) {
      await queryRunner.query(`UPDATE "package" SET "description_en" = "description", "description_ar" = "description" WHERE "description" IS NOT NULL`);
      await queryRunner.query(`ALTER TABLE "package" DROP COLUMN IF EXISTS "description"`);
    }

    // ----- Banner (table "banners") -----
    await queryRunner.query(`ALTER TABLE "banners" ADD COLUMN IF NOT EXISTS "title_en" character varying(200)`);
    await queryRunner.query(`ALTER TABLE "banners" ADD COLUMN IF NOT EXISTS "title_ar" character varying(200)`);
    await queryRunner.query(`ALTER TABLE "banners" ADD COLUMN IF NOT EXISTS "description_en" text`);
    await queryRunner.query(`ALTER TABLE "banners" ADD COLUMN IF NOT EXISTS "description_ar" text`);
    await queryRunner.query(`ALTER TABLE "banners" ADD COLUMN IF NOT EXISTS "button_text_en" character varying(50)`);
    await queryRunner.query(`ALTER TABLE "banners" ADD COLUMN IF NOT EXISTS "button_text_ar" character varying(50)`);
    if (await columnExists(queryRunner, "banners", "title")) {
      await queryRunner.query(`UPDATE "banners" SET "title_en" = "title", "title_ar" = "title" WHERE "title" IS NOT NULL`);
      await queryRunner.query(`ALTER TABLE "banners" DROP COLUMN IF EXISTS "title"`);
    }
    if (await columnExists(queryRunner, "banners", "description")) {
      await queryRunner.query(`UPDATE "banners" SET "description_en" = "description", "description_ar" = "description" WHERE "description" IS NOT NULL`);
      await queryRunner.query(`ALTER TABLE "banners" DROP COLUMN IF EXISTS "description"`);
    }
    if (await columnExists(queryRunner, "banners", "button_text")) {
      await queryRunner.query(`UPDATE "banners" SET "button_text_en" = "button_text", "button_text_ar" = "button_text" WHERE "button_text" IS NOT NULL`);
      await queryRunner.query(`ALTER TABLE "banners" DROP COLUMN IF EXISTS "button_text"`);
    }

    // ----- Offer -----
    await queryRunner.query(`ALTER TABLE "offer" ADD COLUMN IF NOT EXISTS "name_en" character varying(200)`);
    await queryRunner.query(`ALTER TABLE "offer" ADD COLUMN IF NOT EXISTS "name_ar" character varying(200)`);
    await queryRunner.query(`ALTER TABLE "offer" ADD COLUMN IF NOT EXISTS "description_en" text`);
    await queryRunner.query(`ALTER TABLE "offer" ADD COLUMN IF NOT EXISTS "description_ar" text`);
    if (await columnExists(queryRunner, "offer", "name")) {
      await queryRunner.query(`UPDATE "offer" SET "name_en" = "name", "name_ar" = "name" WHERE "name" IS NOT NULL`);
      await queryRunner.query(`ALTER TABLE "offer" DROP COLUMN IF EXISTS "name"`);
    }
    if (await columnExists(queryRunner, "offer", "description")) {
      await queryRunner.query(`UPDATE "offer" SET "description_en" = "description", "description_ar" = "description" WHERE "description" IS NOT NULL`);
      await queryRunner.query(`ALTER TABLE "offer" DROP COLUMN IF EXISTS "description"`);
    }

    // ----- OrderItem -----
    await queryRunner.query(`ALTER TABLE "order_item" ADD COLUMN IF NOT EXISTS "item_name_en" character varying(200)`);
    await queryRunner.query(`ALTER TABLE "order_item" ADD COLUMN IF NOT EXISTS "item_name_ar" character varying(200)`);
    if (await columnExists(queryRunner, "order_item", "item_name")) {
      await queryRunner.query(`UPDATE "order_item" SET "item_name_en" = "item_name", "item_name_ar" = "item_name" WHERE "item_name" IS NOT NULL`);
      await queryRunner.query(`ALTER TABLE "order_item" DROP COLUMN IF EXISTS "item_name"`);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // OrderItem
    await queryRunner.query(`ALTER TABLE "order_item" ADD COLUMN IF NOT EXISTS "item_name" character varying(200)`);
    await queryRunner.query(`UPDATE "order_item" SET "item_name" = COALESCE("item_name_en", "item_name_ar")`);
    await queryRunner.query(`ALTER TABLE "order_item" DROP COLUMN IF EXISTS "item_name_en"`);
    await queryRunner.query(`ALTER TABLE "order_item" DROP COLUMN IF EXISTS "item_name_ar"`);

    // Offer
    await queryRunner.query(`ALTER TABLE "offer" ADD COLUMN IF NOT EXISTS "name" character varying(200)`);
    await queryRunner.query(`ALTER TABLE "offer" ADD COLUMN IF NOT EXISTS "description" text`);
    await queryRunner.query(`UPDATE "offer" SET "name" = COALESCE("name_en", "name_ar"), "description" = COALESCE("description_en", "description_ar")`);
    await queryRunner.query(`ALTER TABLE "offer" DROP COLUMN IF EXISTS "name_en"`);
    await queryRunner.query(`ALTER TABLE "offer" DROP COLUMN IF EXISTS "name_ar"`);
    await queryRunner.query(`ALTER TABLE "offer" DROP COLUMN IF EXISTS "description_en"`);
    await queryRunner.query(`ALTER TABLE "offer" DROP COLUMN IF EXISTS "description_ar"`);

    // Banner
    await queryRunner.query(`ALTER TABLE "banners" ADD COLUMN IF NOT EXISTS "title" character varying(200)`);
    await queryRunner.query(`ALTER TABLE "banners" ADD COLUMN IF NOT EXISTS "description" text`);
    await queryRunner.query(`ALTER TABLE "banners" ADD COLUMN IF NOT EXISTS "button_text" character varying(50)`);
    await queryRunner.query(`UPDATE "banners" SET "title" = COALESCE("title_en", "title_ar"), "description" = COALESCE("description_en", "description_ar"), "button_text" = COALESCE("button_text_en", "button_text_ar")`);
    await queryRunner.query(`ALTER TABLE "banners" DROP COLUMN IF EXISTS "title_en"`);
    await queryRunner.query(`ALTER TABLE "banners" DROP COLUMN IF EXISTS "title_ar"`);
    await queryRunner.query(`ALTER TABLE "banners" DROP COLUMN IF EXISTS "description_en"`);
    await queryRunner.query(`ALTER TABLE "banners" DROP COLUMN IF EXISTS "description_ar"`);
    await queryRunner.query(`ALTER TABLE "banners" DROP COLUMN IF EXISTS "button_text_en"`);
    await queryRunner.query(`ALTER TABLE "banners" DROP COLUMN IF EXISTS "button_text_ar"`);

    // Package
    await queryRunner.query(`ALTER TABLE "package" ADD COLUMN IF NOT EXISTS "name" character varying(200)`);
    await queryRunner.query(`ALTER TABLE "package" ADD COLUMN IF NOT EXISTS "description" text`);
    await queryRunner.query(`UPDATE "package" SET "name" = COALESCE("name_en", "name_ar"), "description" = COALESCE("description_en", "description_ar")`);
    await queryRunner.query(`ALTER TABLE "package" DROP COLUMN IF EXISTS "name_en"`);
    await queryRunner.query(`ALTER TABLE "package" DROP COLUMN IF EXISTS "name_ar"`);
    await queryRunner.query(`ALTER TABLE "package" DROP COLUMN IF EXISTS "description_en"`);
    await queryRunner.query(`ALTER TABLE "package" DROP COLUMN IF EXISTS "description_ar"`);

    // Product
    await queryRunner.query(`ALTER TABLE "product" ADD COLUMN IF NOT EXISTS "name" character varying(200)`);
    await queryRunner.query(`ALTER TABLE "product" ADD COLUMN IF NOT EXISTS "description" text`);
    await queryRunner.query(`ALTER TABLE "product" ADD COLUMN IF NOT EXISTS "short_description" text`);
    await queryRunner.query(`UPDATE "product" SET "name" = COALESCE("name_en", "name_ar"), "description" = COALESCE("description_en", "description_ar"), "short_description" = COALESCE("short_description_en", "short_description_ar")`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN IF EXISTS "name_en"`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN IF EXISTS "name_ar"`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN IF EXISTS "description_en"`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN IF EXISTS "description_ar"`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN IF EXISTS "short_description_en"`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN IF EXISTS "short_description_ar"`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN IF EXISTS "meta_title_en"`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN IF EXISTS "meta_title_ar"`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN IF EXISTS "meta_description_en"`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN IF EXISTS "meta_description_ar"`);

    // Category
    await queryRunner.query(`ALTER TABLE "category" ADD COLUMN IF NOT EXISTS "name" character varying(100)`);
    await queryRunner.query(`ALTER TABLE "category" ADD COLUMN IF NOT EXISTS "description" text`);
    await queryRunner.query(`ALTER TABLE "category" ADD COLUMN IF NOT EXISTS "meta_title" character varying`);
    await queryRunner.query(`ALTER TABLE "category" ADD COLUMN IF NOT EXISTS "meta_description" text`);
    await queryRunner.query(`UPDATE "category" SET "name" = COALESCE("name_en", "name_ar"), "description" = COALESCE("description_en", "description_ar"), "meta_title" = COALESCE("meta_title_en", "meta_title_ar"), "meta_description" = COALESCE("meta_description_en", "meta_description_ar")`);
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN IF EXISTS "name_en"`);
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN IF EXISTS "name_ar"`);
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN IF EXISTS "description_en"`);
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN IF EXISTS "description_ar"`);
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN IF EXISTS "meta_title_en"`);
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN IF EXISTS "meta_title_ar"`);
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN IF EXISTS "meta_description_en"`);
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN IF EXISTS "meta_description_ar"`);
  }
}
