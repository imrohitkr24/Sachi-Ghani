const fs = require('fs');
fs.writeFileSync('step_start.txt', 'Starting');
try {
    const mongoose = require('mongoose');
    fs.writeFileSync('step_require.txt', 'Mongoose required');

    // Use the exact string we put in .env
    const uri = 'mongodb://localhost:27017/sachi';

    mongoose.connect(uri)
        .then(() => {
            fs.writeFileSync('step_connect.txt', 'Connected successfully');
            console.log("Connected");
            process.exit(0);
        })
        .catch(err => {
            fs.writeFileSync('step_error.txt', 'Connection Error: ' + err.message);
            console.error(err);
            process.exit(1);
        });
} catch (e) {
    fs.writeFileSync('step_crash.txt', 'Crash: ' + e.message);
}
