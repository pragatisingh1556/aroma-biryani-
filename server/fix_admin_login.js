/**
 * One-shot script to diagnose and fix admin login issue.
 * Run from server/ folder:  node fix_admin_login.js
 */
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const PHONE = '9999999999';
const PASSWORD = 'Admin@123';

(async () => {
  console.log('==========================================');
  console.log(' Aroma Biriyani — Admin Login Fix');
  console.log('==========================================\n');

  let conn;
  try {
    console.log(`Connecting to MySQL at ${process.env.DB_HOST}...`);
    console.log(`Database: ${process.env.DB_NAME}\n`);

    conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    console.log('✓ Connected to database\n');

    // Step 1: Check if admin user exists
    const [rows] = await conn.execute(
      'SELECT id, name, phone, role, password, is_verified FROM users WHERE phone = ?',
      [PHONE]
    );

    if (rows.length === 0) {
      console.log(`✗ No user found with phone ${PHONE}`);
      console.log('  Creating fresh admin account...\n');

      const hash = await bcrypt.hash(PASSWORD, 10);
      await conn.execute(
        `INSERT INTO users (name, phone, email, password, role, is_verified)
         VALUES (?, ?, ?, ?, 'admin', TRUE)`,
        ['Admin', PHONE, 'admin@aromabiriyani.com', hash]
      );
      console.log('✓ Admin user created\n');
    } else {
      const user = rows[0];
      console.log('✓ Found existing user:');
      console.log(`   id:          ${user.id}`);
      console.log(`   name:        ${user.name}`);
      console.log(`   phone:       ${user.phone}`);
      console.log(`   role:        ${user.role}`);
      console.log(`   verified:    ${user.is_verified}`);
      console.log(`   pass-hash:   ${user.password.substring(0, 20)}...\n`);

      // Test current password
      const matchesAdmin = await bcrypt.compare(PASSWORD, user.password);
      console.log(`Does current hash match "${PASSWORD}"?  ${matchesAdmin ? 'YES' : 'NO'}\n`);

      if (!matchesAdmin) {
        console.log('Resetting password to Admin@123...');
        const newHash = await bcrypt.hash(PASSWORD, 10);
        await conn.execute(
          'UPDATE users SET password = ?, is_verified = TRUE, role = ? WHERE phone = ?',
          [newHash, 'admin', PHONE]
        );
        console.log('✓ Password reset successfully\n');
      } else {
        // Just make sure role + verified are correct
        await conn.execute(
          'UPDATE users SET is_verified = TRUE, role = ? WHERE phone = ?',
          ['admin', PHONE]
        );
        console.log('✓ Password was already correct (role + verified status confirmed)\n');
      }
    }

    // Step 2: Final verification
    const [verify] = await conn.execute(
      'SELECT password FROM users WHERE phone = ?',
      [PHONE]
    );
    const finalCheck = await bcrypt.compare(PASSWORD, verify[0].password);

    console.log('==========================================');
    if (finalCheck) {
      console.log(' ✅  ALL DONE — Login should work now');
      console.log('==========================================\n');
      console.log('Use these credentials in the login page:');
      console.log(`   Phone:     ${PHONE}`);
      console.log(`   Password:  ${PASSWORD}\n`);
      console.log('Open: http://localhost:3000/login');
    } else {
      console.log(' ✗  Something is still wrong');
      console.log('==========================================');
    }
  } catch (err) {
    console.error('\n✗ ERROR:', err.message);
    console.error('\nCommon issues:');
    console.error('  1. MySQL server not running');
    console.error('  2. Wrong password in .env');
    console.error('  3. Database "aroma_biriyani" does not exist');
    console.error('  4. Tables not created (run schema.sql first)');
  } finally {
    if (conn) await conn.end();
  }
})();
