import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Guest order flow: cart and order schema changes for no-login checkout.
 * - Cart: nullable user_id, add guest_cart_id (UUID, unique).
 * - Order: nullable user_id, add guest_phone, phone_validated_at, confirmed_at.
 */
export class GuestOrderSchema1738848000000 implements MigrationInterface {
  name = "GuestOrderSchema1738848000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Cart: make user_id nullable, add guest_cart_id
    await queryRunner.query(`
      ALTER TABLE "cart"
      ALTER COLUMN "user_id" DROP NOT NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "cart"
      ADD COLUMN IF NOT EXISTS "guest_cart_id" character varying(36) UNIQUE
    `);

    // Order: make user_id nullable, add guest_phone, phone_validated_at, confirmed_at
    await queryRunner.query(`
      ALTER TABLE "order"
      ALTER COLUMN "user_id" DROP NOT NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "order"
      ADD COLUMN IF NOT EXISTS "guest_phone" character varying(50)
    `);
    await queryRunner.query(`
      ALTER TABLE "order"
      ADD COLUMN IF NOT EXISTS "phone_validated_at" TIMESTAMP
    `);
    await queryRunner.query(`
      ALTER TABLE "order"
      ADD COLUMN IF NOT EXISTS "confirmed_at" TIMESTAMP
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Order: remove new columns, make user_id NOT NULL again (may fail if guest orders exist)
    await queryRunner.query(`
      ALTER TABLE "order"
      DROP COLUMN IF EXISTS "confirmed_at"
    `);
    await queryRunner.query(`
      ALTER TABLE "order"
      DROP COLUMN IF EXISTS "phone_validated_at"
    `);
    await queryRunner.query(`
      ALTER TABLE "order"
      DROP COLUMN IF EXISTS "guest_phone"
    `);
    await queryRunner.query(`
      ALTER TABLE "order"
      ALTER COLUMN "user_id" SET NOT NULL
    `);

    // Cart: remove guest_cart_id, make user_id NOT NULL again (may fail if guest carts exist)
    await queryRunner.query(`
      ALTER TABLE "cart"
      DROP COLUMN IF EXISTS "guest_cart_id"
    `);
    await queryRunner.query(`
      ALTER TABLE "cart"
      ALTER COLUMN "user_id" SET NOT NULL
    `);
  }
}
