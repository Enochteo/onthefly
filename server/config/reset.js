import { pool } from "./database.js";
import "./dotenv.js";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import fs from "fs";

const currentPath = fileURLToPath(import.meta.url);

const tripsFile = fs.readFileSync(
  path.join(dirname(currentPath), "../config/data/data.json")
);

const tripsData = JSON.parse(tripsFile);

const createTripsTable = async () => {
  const createTripsTableQuery = `

      CREATE TABLE IF NOT EXISTS trips (
          id serial PRIMARY KEY,
          title varchar(100) NOT NULL,
          description varchar(500) NOT NULL,
          img_url text NOT NULL,
          num_days integer NOT NULL,
          start_date date NOT NULL,
          end_date date NOT NULL,
          total_cost money NOT NULL
      );
  `;
  try {
    const res = await pool.query(createTripsTableQuery);
    console.log("🎉 trips table created successfully");
  } catch (err) {
    console.error("⚠️ error creating trips table", err);
  }
};

const seedTripsTable = async () => {
  await createTripsTable();

  const insertText =
    "INSERT INTO trips (title, description, img_url, num_days, start_date, end_date, total_cost) VALUES ($1, $2, $3, $4, $5, $6, $7)";

  for (const trip of tripsData) {
    const values = [
      trip.title,
      trip.description,
      trip.img_url,
      trip.num_days,
      trip.start_date,
      trip.end_date,
      trip.total_cost,
    ];

    try {
      await pool.query(insertText, values);
      console.log(`✅ ${trip.title} added successfully`);
    } catch (err) {
      console.error("⚠️ error inserting trip", err);
    }
  }
};

const createDestinationsTable = async () => {
  const createDestinationsTableQuery = `

      CREATE TABLE IF NOT EXISTS destinations (
          id serial PRIMARY KEY,
          destination varchar(100) NOT NULL,
          description varchar(500) NOT NULL,
          city varchar(100) NOT NULL,
          country varchar(100) NOT NULL,
          img_url text NOT NULL,
          flag_img_url text NOT NULL
      );
  `;
  try {
    const res = await pool.query(createDestinationsTableQuery);
    console.log("✅ Destinations table successfully created");
  } catch (error) {
    console.log("❌Error creating destinations table", error);
  }
};

const createActivitiesTable = async () => {
  const createActivitiesTableQuery = `
      DROP TABLE IF EXISTS activities;

      CREATE TABLE IF NOT EXISTS activities (
          id serial PRIMARY KEY,
          trip_id integer NOT NULL,
          activity varchar(100) NOT NULL,
          num_votes integer DEFAULT 0,
          FOREIGN KEY (trip_id) REFERENCES trips(id)
      );
  `;
  try {
    const res = await pool.query(createActivitiesTableQuery);
    console.log("✅ Activities table successfully created");
  } catch (error) {
    console.log("❌Error creating activities table", error);
  }
};

const createTripsDestinationsTable = async () => {
  const createTripsDestinationsTableQuery = `
      DROP TABLE IF EXISTS trips_destinations;

      CREATE TABLE IF NOT EXISTS trips_destinations (
          id serial PRIMARY KEY,
          trip_id integer NOT NULL,
          destination_id integer NOT NULL,
          FOREIGN KEY (trip_id) REFERENCES trips(id),
          FOREIGN KEY (destination_id) REFERENCES destinations(id)
      );
  `;
  try {
    const res = await pool.query(createTripsDestinationsTableQuery);
    console.log("✅ Trips_Destinations table successfully created");
  } catch (error) {
    console.log("❌Error creating trips_destinations table", error);
  }
};

const createUsersTable = async () => {
  const createUserTableQuery = `
  CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    githubid INT NOT NULL,
    username VARCHAR(100) NOT NULL,
    avatarurl VARCHAR(500) NOT NULL,
    accesstoken VARCHAR(500) NOT NULL
  );
  `
  try {
    const res = await pool.query(createUserTableQuery);
    console.log("✅ Users Table successfully created")
  } catch (error) {
    console.log("❌ Failed to create Users Table")
  }
}

const createTripUsers = async () => {
  const createTripUsersQuery = `
  CREATE TABLE IF NOT EXISTS trips_users(
  trip_id INT NOT NULL,
  user_id INT NOT NULL,
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON UPDATE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE
    );
  `
  try {
    const res = await pool.query(createTripUsersQuery);
    console.log("✅ trips_users successfully created")
  } catch (error) {
    console.log("❌ Error creating user_trips", error)
  }
}
const run = async () => {
  try {
    await seedTripsTable();
    await createDestinationsTable();
    await createActivitiesTable();
    await createTripsDestinationsTable();
    await createUsersTable();
    await createTripUsers();
    await pool.end();
  } catch (err) {
    console.error("Fatal error during reset:", err);
    try {
      await pool.end();
    } catch (e) {
      // ignore
    }
  }
};

run();
