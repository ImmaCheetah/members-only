require("dotenv").config();
const { Client } = require("pg");

const SQL = `
CREATE TYPE role AS ENUM ('user', 'member', 'admin');

CREATE TABLE IF NOT EXISTS users (                                        
user_id INTEGER NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY UNIQUE,
first_name VARCHAR (30) NOT NULL,
last_name VARCHAR (30) NOT NULL,
email VARCHAR (30) NOT NULL UNIQUE,
password VARCHAR (255) NOT NULL,
user_role role DEFAULT 'user'
);

CREATE TABLE IF NOT EXISTS messages (                                        
message_id INTEGER NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY UNIQUE,
title VARCHAR(20) NOT NULL,
timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
text TEXT
);

CREATE TABLE users_messages (                                        
id INTEGER NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY UNIQUE,
user_id INTEGER NOT NULL,
message_id INT NOT NULL,
CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id),
CONSTRAINT fk_message FOREIGN KEY (message_id) REFERENCES messages(message_id) ON DELETE CASCADE
);

`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: process.env.LOCAL_CONNECTION_STRING,
  });
  // const client = new Client({
  //   connectionString: `${argv[2]}?sslmode=require`,
  // });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();