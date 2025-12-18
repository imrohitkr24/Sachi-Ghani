
require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');

const uri = process.env.MONGO_URI;
const outputFile = 'db_test_output.txt';

console.log('Testing connection...');
fs.writeFileSync(outputFile, `Testing connection to: ${uri ? 'URI_PRESENT' : 'URI_MISSING'}\n`);

mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
        const msg = 'MongoDB Connected Successfully!';
        console.log(msg);
        fs.appendFileSync(outputFile, msg + '\n');
        process.exit(0);
    })
    .catch(err => {
        const msg = `Connection Failed: ${err.message}`;
        console.error(msg);
        fs.appendFileSync(outputFile, msg + '\n');
        process.exit(1);
    });
