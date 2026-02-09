import { initDB } from '../lib/db';

async function main() {
    console.log('Initializing Turso database...');
    await initDB();
    console.log('Database initialized successfully!');
}

main().catch(console.error);
