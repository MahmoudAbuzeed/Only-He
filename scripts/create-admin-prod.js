#!/usr/bin/env node

// Create Admin User in Production Database
// =======================================
// This script creates an admin user directly in the production PostgreSQL database

const { Client } = require("pg");
const bcrypt = require("bcrypt");

// Production database configuration
const DB_CONFIG = {
  host: "only-he-api-postgres-public.cg9a8qkaw0ft.us-east-1.rds.amazonaws.com",
  port: 5432,
  database: "only_he_db",
  user: "postgres",
  password: "Cej95cWvZNGg5x14",
  ssl: {
    rejectUnauthorized: false, // Required for RDS connections
  },
};

async function createAdminUser() {
  const client = new Client(DB_CONFIG);

  try {
    console.log("🔌 Connecting to production database...");
    await client.connect();
    console.log("✅ Connected to production database successfully!");

    // 1. Create admin role if it doesn't exist
    console.log("\n🛡️  Creating/updating admin role...");

    const adminPermissions = {
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
    };

    // Check if admin role exists
    const roleResult = await client.query(
      "SELECT * FROM role WHERE name = $1",
      ["admin"]
    );

    let adminRoleId;
    if (roleResult.rows.length === 0) {
      console.log("📝 Creating new admin role...");
      const createRoleResult = await client.query(
        `
        INSERT INTO role (name, details, type, permissions, is_active, created_at, updated_at) 
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) 
        RETURNING id
      `,
        [
          "admin",
          "System Administrator with full access",
          "admin",
          JSON.stringify(adminPermissions),
          true,
        ]
      );
      adminRoleId = createRoleResult.rows[0].id;
      console.log("✅ Admin role created successfully");
    } else {
      adminRoleId = roleResult.rows[0].id;
      console.log("✅ Admin role already exists, updating permissions...");
      await client.query(
        `
        UPDATE role 
        SET type = $1, permissions = $2, is_active = $3, updated_at = NOW()
        WHERE id = $4
      `,
        ["admin", JSON.stringify(adminPermissions), true, adminRoleId]
      );
      console.log("✅ Admin role permissions updated");
    }

    // 2. Check if admin user already exists
    console.log("\n👤 Checking for existing admin user...");
    const userResult = await client.query(
      'SELECT * FROM "user" WHERE email = $1',
      ["admin@only-he.com"]
    );

    if (userResult.rows.length > 0) {
      const existingUser = userResult.rows[0];
      console.log("⚠️  Admin user already exists!");
      console.log("=".repeat(50));
      console.log("📧 Email: admin@only-he.com");
      console.log("🔑 Password: Admin123!");
      console.log("👤 User ID:", existingUser.id);
      console.log("📱 Phone:", existingUser.phone);
      console.log("=".repeat(50));
      console.log("\n💡 You can login with these credentials!");
      console.log(
        "🌐 API URL: https://z5cpphjngn.us-east-1.awsapprunner.com/api/v1"
      );
      console.log(
        "📚 Swagger: https://z5cpphjngn.us-east-1.awsapprunner.com/api/docs"
      );
      return;
    }

    // 3. Create admin user
    console.log("👤 Creating admin user...");
    const hashedPassword = await bcrypt.hash("Admin123!", 10);

    const createUserResult = await client.query(
      `
      INSERT INTO "user" (
        first_name, last_name, user_name, email, phone, password, 
        is_active, created_at, updated_at
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) 
      RETURNING id
    `,
      [
        "System",
        "Administrator",
        "admin",
        "admin@only-he.com",
        "+1-800-ADMIN-1",
        hashedPassword,
        true,
      ]
    );

    const adminUserId = createUserResult.rows[0].id;
    console.log("✅ Admin user created successfully");

    // 4. Assign admin role to user
    console.log("🔗 Assigning admin role to user...");
    await client.query(
      `
      INSERT INTO user_roles (user_id, role_id) 
      VALUES ($1, $2) 
      ON CONFLICT DO NOTHING
    `,
      [adminUserId, adminRoleId]
    );

    console.log("✅ Admin role assigned successfully");

    // 5. Display success message
    console.log("\n🎉 Admin user created successfully!");
    console.log("=".repeat(60));
    console.log("📧 Email: admin@only-he.com");
    console.log("📱 Phone: +1-800-ADMIN-1");
    console.log("🔑 Password: Admin123!");
    console.log("👤 User ID:", adminUserId);
    console.log("🛡️  Role: Admin (Full Access)");
    console.log("=".repeat(60));
    console.log("\n💡 Login Information:");
    console.log(
      "🌐 API URL: https://z5cpphjngn.us-east-1.awsapprunner.com/api/v1"
    );
    console.log(
      "📚 Swagger: https://z5cpphjngn.us-east-1.awsapprunner.com/api/docs"
    );
    console.log("🔐 Login Endpoint: POST /api/v1/auth/login");
    console.log("\n📋 Test Login:");
    console.log(
      'curl -X POST "https://z5cpphjngn.us-east-1.awsapprunner.com/api/v1/auth/login" \\'
    );
    console.log('  -H "Content-Type: application/json" \\');
    console.log(
      '  -d \'{"email":"admin@only-he.com","password":"Admin123!"}\''
    );
  } catch (error) {
    console.error("❌ Error creating admin user:", error);

    if (error.code === "23505") {
      console.log("\n⚠️  User with this email already exists!");
      console.log("📧 Email: admin@only-he.com");
      console.log("🔑 Password: Admin123!");
    } else if (error.code === "ECONNREFUSED") {
      console.log("\n❌ Cannot connect to database. Please check:");
      console.log("   • Database host and port");
      console.log("   • Network connectivity");
      console.log("   • Security group settings");
    } else {
      console.log("\n❌ Database error details:", {
        code: error.code,
        message: error.message,
      });
    }
  } finally {
    await client.end();
    console.log("\n🔌 Database connection closed");
  }
}

// Run the script
console.log("🚀 Only-He Admin User Creation Script");
console.log("====================================");
createAdminUser().catch(console.error);
