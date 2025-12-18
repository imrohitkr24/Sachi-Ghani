require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;
console.log('Connecting to DB...');

mongoose.connect(uri)
    .then(async () => {
        console.log('Connected successfully.');

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('\nCollections found:');
        collections.forEach(c => console.log(' -', c.name));

        const User = require('./models/user');
        const Order = require('./models/order');

        const userCount = await User.countDocuments();
        const orderCount = await Order.countDocuments();

        console.log(`\nStats:`);
        console.log(` - Users: ${userCount}`);
        console.log(` - Orders: ${orderCount}`);

        if (orderCount > 0) {
            const lastOrder = await Order.findOne().sort({ createdAt: -1 });
            console.log('\nLast Order:', JSON.stringify(lastOrder, null, 2));
        }

        mongoose.disconnect();
    })
    .catch(err => {
        console.error('Connection Failed:', err);
        process.exit(1);
    });
