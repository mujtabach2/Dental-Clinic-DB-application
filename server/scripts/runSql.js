const fs = require('fs');
const db = require('../db');

const file = process.argv[2];
if (!file) {
  console.error('Usage: node runSql.js <sql_file>');
  process.exit(1);
}

const sql = fs.readFileSync(file, 'utf8');
db.exec(sql);
console.log('Executed:', file);
