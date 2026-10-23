require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('../config/db');
const Category = require('../models/Category');
const Place = require('../models/Place');
const Admin = require('../models/Admin');
const { categoriesData, placesData } = require('./seedData');
const { REFERENCE_LATITUDE, REFERENCE_LONGITUDE, REFERENCE_LOCATION_NAME } = require('../config/constants');
const { calculateDistanceFromReference, formatDistance } = require('../utils/geoDistance');

const seedDatabase = async () => {
  try {
    console.log('--- RockCity Explorer Database Seeder ---');
    console.log(`[Config] Reference Coordinate: Lat ${REFERENCE_LATITUDE}, Lon ${REFERENCE_LONGITUDE} (${REFERENCE_LOCATION_NAME})`);
    
    await connectDB();

    console.log('[Seeder] Clearing old records...');
    await Category.deleteMany({});
    await Place.deleteMany({});
    await Admin.deleteMany({});

    console.log('[Seeder] Creating Default Administrator...');
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@rockcity.lk';
    const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'AdminRockCity@2026';

    const admin = await Admin.create({
      name: 'RockCity Admin',
      username: 'admin',
      email: adminEmail,
      password: adminPassword,
      role: 'admin'
    });
    console.log(`[Seeder] Admin created: ${admin.email} (username: admin)`);

    console.log('[Seeder] Inserting Categories...');
    const insertedCategories = await Category.insertMany(categoriesData);
    console.log(`[Seeder] ${insertedCategories.length} Categories created: ${insertedCategories.map(c => c.name).join(', ')}`);

    console.log('[Seeder] Inserting Places & computing reference distances...');
    const insertedPlaces = await Place.insertMany(placesData);
    console.log(`[Seeder] Successfully created ${insertedPlaces.length} places!`);

    console.log('\n--- Kurunegala Places & Distance from Fixed Reference Point ---');
    insertedPlaces.forEach((p, idx) => {
      const dist = calculateDistanceFromReference(p.latitude, p.longitude);
      console.log(`  ${idx + 1}. [${p.category.padEnd(10)}] ${p.name.padEnd(46)} -> ${formatDistance(dist)} away`);
    });

    console.log('\n[Seeder] Seeding completed successfully!');
    return true;
  } catch (error) {
    console.error('[Seeder] Error during seeding:', error);
    throw error;
  }
};

// If run directly from terminal
if (require.main === module) {
  seedDatabase()
    .then(async () => {
      await disconnectDB();
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = seedDatabase;
