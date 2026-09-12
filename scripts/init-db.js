const { Client } = require('pg');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Auto-load .env.local or .env if present
const envFiles = ['.env.local', '.env'];
for (const envFile of envFiles) {
  const envPath = path.join(__dirname, '..', envFile);
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const match = trimmed.match(/^([\w_]+)\s*=\s*["']?(.*?)["']?$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2];
      }
    }
  }
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('ERRO: A variável de ambiente DATABASE_URL não foi definida.');
  process.exit(1);
}

async function initDB() {
  console.log('Connecting to CockroachDB...');
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('Connected successfully.');

    const sqlPath = path.join(__dirname, '..', 'src', 'lib', 'schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Applying schema migrations...');
    await client.query(sql);
    console.log('Schema migrations applied.');

    // Seed default admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@stoka.mz';
    const adminPassword = process.env.ADMIN_PASSWORD || 'adminstoka2025';
    const adminName = process.env.ADMIN_NAME || 'Administrador STOKA';

    const checkRes = await client.query('SELECT id FROM users WHERE email = $1', [adminEmail]);
    if (checkRes.rows.length === 0) {
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      await client.query(
        `INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4)`,
        [adminName, adminEmail, passwordHash, 'admin']
      );
      console.log(`Default admin created: ${adminEmail} (senha: ${adminPassword})`);
    } else {
      console.log(`Admin user ${adminEmail} already exists.`);
    }

    console.log('Database initialization complete!');
  } catch (err) {
    console.error('Database initialization failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

initDB();
