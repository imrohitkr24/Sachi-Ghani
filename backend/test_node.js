const fs = require('fs');
try {
    fs.writeFileSync('test_output.txt', 'Node execution successful');
    console.log('Console log working');
} catch (e) {
    // ignore
}
