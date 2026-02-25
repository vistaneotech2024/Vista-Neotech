/**
 * Create Admin User Script
 * Creates the first admin user for the CMS
 */

import { prisma } from '../lib/db/prisma';
import * as readline from 'readline';
import * as bcrypt from 'bcryptjs';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function main() {
  console.log('=== Vista Neotech CMS - Admin User Creation ===\n');

  try {
    // Get user input
    const email = await question('Email: ');
    const password = await question('Password: ');
    const displayName = await question('Display Name (optional): ') || email.split('@')[0];
    const firstName = await question('First Name (optional): ') || '';
    const lastName = await question('Last Name (optional): ') || '';

    // Validate email
    if (!email || !email.includes('@')) {
      console.error('❌ Invalid email address');
      process.exit(1);
    }

    // Validate password
    if (!password || password.length < 8) {
      console.error('❌ Password must be at least 8 characters');
      process.exit(1);
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      console.error(`❌ User with email ${email} already exists`);
      process.exit(1);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username: email.split('@')[0],
        passwordHash,
        displayName,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        role: 'super_admin',
        status: 'active',
      },
    });

    console.log('\n✅ Admin user created successfully!');
    console.log(`\nUser Details:`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Display Name: ${user.displayName}`);
    console.log(`  Role: ${user.role}`);
    console.log(`  Status: ${user.status}`);
    console.log(`\nYou can now login to the admin panel.`);
  } catch (error) {
    console.error('❌ Error creating user:', error);
    process.exit(1);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { main as createAdminUser };
