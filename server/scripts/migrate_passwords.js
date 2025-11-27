const Database = require("better-sqlite3");
const bcrypt = require("bcrypt");
const path = require("path");

// Database path
const dbPath = process.env.VERCEL || process.env.VERCEL_ENV
  ? path.join("/tmp", "dental.db")
  : path.join(__dirname, "../db/a9.db");

const db = new Database(dbPath);
db.pragma("foreign_keys = ON");

async function migratePasswords() {
  console.log("Starting password migration...");
  
  try {
    // Check if password column exists
    const tableInfo = db.prepare("PRAGMA table_info(Employee)").all();
    const hasPasswordColumn = tableInfo.some(col => col.name === 'password');
    
    if (!hasPasswordColumn) {
      console.log("Adding password column to Employee table...");
      db.prepare("ALTER TABLE Employee ADD COLUMN password TEXT NOT NULL DEFAULT ''").run();
    }
    
    // Get all employees
    const employees = db.prepare("SELECT empID, password FROM Employee").all();
    console.log(`Found ${employees.length} employees to migrate`);
    
    let migrated = 0;
    let skipped = 0;
    
    for (const emp of employees) {
      // Check if password is already hashed
      const isHashed = emp.password && (
        emp.password.startsWith('$2a$') || 
        emp.password.startsWith('$2b$') || 
        emp.password.startsWith('$2y$')
      );
      
      if (isHashed) {
        console.log(`Employee ${emp.empID}: Password already hashed, skipping...`);
        skipped++;
        continue;
      }
      
      // Use empID as default password if password is empty
      const plainPassword = emp.password || emp.empID.toString();
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(plainPassword, 10);
      
      // Update the database
      db.prepare("UPDATE Employee SET password = ? WHERE empID = ?").run(hashedPassword, emp.empID);
      console.log(`Employee ${emp.empID}: Password migrated (default password is their empID)`);
      migrated++;
    }
    
    console.log(`\nMigration complete!`);
    console.log(`- Migrated: ${migrated} employees`);
    console.log(`- Skipped (already hashed): ${skipped} employees`);
    console.log(`\n⚠️  IMPORTANT: All employees should change their default password!`);
    console.log(`   Default password for each employee is their empID.`);
    
  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  } finally {
    db.close();
  }
}

migratePasswords();

