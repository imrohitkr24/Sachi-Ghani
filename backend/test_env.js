require('dotenv').config();
const fs = require('fs');
fs.writeFileSync('env_test.txt', 'URI: ' + process.env.MONGO_URI);
