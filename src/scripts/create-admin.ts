import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import { UserRepo } from "../user/repositories/user.repository";
import { RoleRepo } from "../role/repositories/role.repository";
import { RoleType } from "../role/entities/role.entity";
import { DataSource } from "typeorm";
import * as bcrypt from "bcrypt";

async function createAdmin() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userRepository = app.get(UserRepo);
  const roleRepository = app.get(RoleRepo);

  try {
    console.log("🚀 Creating admin user...");

    // 1. Create or find admin role
    let adminRole = await roleRepository.findByName("admin");

    if (!adminRole) {
      console.log("📝 Creating admin role...");
      // Create role directly in database with proper type and permissions
      const dataSource = app.get(DataSource);
      const result = await dataSource.query(
        `
        INSERT INTO role (name, details, type, permissions, is_active) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING *
      `,
        [
          "admin",
          "System Administrator with full access",
          "admin",
          JSON.stringify({
            users: {
              create: true,
              read: true,
              update: true,
              delete: true,
              assign_roles: true,
            },
            products: {
              create: true,
              read: true,
              update: true,
              delete: true,
              manage_stock: true,
            },
            categories: {
              create: true,
              read: true,
              update: true,
              delete: true,
            },
            orders: {
              read: true,
              update: true,
              cancel: true,
              refund: true,
              track: true,
            },
            packages: { create: true, read: true, update: true, delete: true },
            offers: { create: true, read: true, update: true, delete: true },
            analytics: {
              view_dashboard: true,
              view_reports: true,
              export_data: true,
            },
          }),
          true,
        ]
      );
      adminRole = result[0];
      console.log("✅ Admin role created successfully");
    } else {
      console.log("✅ Admin role already exists");
      // Update existing role to ensure it has proper type and permissions
      const dataSource = app.get(DataSource);
      await dataSource.query(
        `
        UPDATE role 
        SET type = $1, permissions = $2, is_active = $3 
        WHERE id = $4
      `,
        [
          "admin",
          JSON.stringify({
            users: {
              create: true,
              read: true,
              update: true,
              delete: true,
              assign_roles: true,
            },
            products: {
              create: true,
              read: true,
              update: true,
              delete: true,
              manage_stock: true,
            },
            categories: {
              create: true,
              read: true,
              update: true,
              delete: true,
            },
            orders: {
              read: true,
              update: true,
              cancel: true,
              refund: true,
              track: true,
            },
            packages: { create: true, read: true, update: true, delete: true },
            offers: { create: true, read: true, update: true, delete: true },
            analytics: {
              view_dashboard: true,
              view_reports: true,
              export_data: true,
            },
          }),
          true,
          adminRole.id,
        ]
      );
      console.log("✅ Admin role updated with proper permissions");
    }

    // 2. Check if admin user already exists
    const existingAdmin = await userRepository.getByEmail("admin@only-he.com");

    if (existingAdmin) {
      console.log(
        "⚠️  Admin user already exists with email: admin@only-he.com"
      );
      console.log("📧 Email: admin@only-he.com");
      console.log("🔑 Password: Admin123!");
      console.log("👤 User ID:", existingAdmin.id);
      await app.close();
      return;
    }

    // 3. Create admin user
    console.log("👤 Creating admin user...");
    const hashedPassword = await bcrypt.hash("Admin123!", 10);

    const adminUser = await userRepository.create({
      first_name: "System",
      last_name: "Administrator",
      user_name: "admin",
      email: "admin@only-he.com",
      phone: "+1234567890",
      password: hashedPassword,
    });

    console.log("✅ Admin user created successfully");

    // 4. Assign admin role to user
    console.log("🔗 Assigning admin role to user...");
    // Direct database query to insert into the junction table
    const dataSource = app.get(DataSource);
    await dataSource.query(
      "INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [adminUser.id, adminRole.id]
    );

    console.log("✅ Admin role assigned successfully");

    // 5. Display credentials
    console.log("\n🎉 Admin user created successfully!");
    console.log("=".repeat(50));
    console.log("📧 Email: admin@only-he.com");
    console.log("📱 Phone: +1234567890");
    console.log("🔑 Password: Admin123!");
    console.log("👤 User ID:", adminUser.id);
    console.log("🛡️  Role: Admin (Full Access)");
    console.log("=".repeat(50));
    console.log(
      "\n💡 You can now login to the admin dashboard with these credentials!"
    );
    console.log("🌐 Dashboard URL: http://localhost:5173/login");
    console.log("🔗 API URL: http://localhost:7002/api/v1");
  } catch (error) {
    console.error("❌ Error creating admin user:", error);

    if (error.code === "23505") {
      // Unique constraint violation
      console.log("\n⚠️  User with this email or phone already exists!");
      console.log("📧 Try using: admin@only-he.com");
      console.log("🔑 Password: Admin123!");
    }
  } finally {
    await app.close();
  }
}

// Run the script
createAdmin().catch(console.error);
