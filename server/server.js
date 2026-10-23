require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/db');
const Place = require('./models/Place');
const seedDatabase = require('./seed/seed');
const { REFERENCE_LATITUDE, REFERENCE_LONGITUDE, REFERENCE_LOCATION_NAME } = require('./config/constants');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Connect to Database
    await connectDB();

    // 2. Auto-seed if database is empty
    const count = await Place.countDocuments();
    if (count === 0) {
      console.log('[Server] Database is empty. Running initial Kurunegala seed...');
      await seedDatabase();
    } else {
      console.log(`[Server] Found ${count} existing tourist places in database.`);
    }

    // 3. Start Express HTTP Server
    app.listen(PORT, () => {
      console.log('\n======================================================');
      console.log(`  ROCKCITY EXPLORER - SERVER RUNNING ON PORT ${PORT}`);
      console.log(`  Reference Point: ${REFERENCE_LATITUDE}, ${REFERENCE_LONGITUDE}`);
      console.log(`  Location Name:   ${REFERENCE_LOCATION_NAME}`);
      console.log(`  API Info:        http://localhost:${PORT}/api/info`);
      console.log(`  Places API:      http://localhost:${PORT}/api/places`);
      console.log(`  Categories API:  http://localhost:${PORT}/api/categories`);
      console.log('======================================================\n');
    });
  } catch (error) {
    console.error('[Server] Critical startup error:', error.message);
    process.exit(1);
  }
};

startServer();
