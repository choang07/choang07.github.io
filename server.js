// These are our required libraries to make the server work.
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

const dbSettings = {
  filename: './tmp/database.db',
  driver: sqlite3.Database,
};

let db;

async function databseInitialize(dbSettings){
  //create Database object
  db = await open(dbSettings);

  const dbSchema = `
    CREATE TABLE IF NOT EXISTS food (
      name text NOT NULL,
      category text,
      inspection_date date,
      inspection_results text,
      city text,
      state text,
      zip integer,
      owner text,
      type text
    )
  `;
  await db.exec(dbSchema);
}

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

//creat a new endpoint called"/sql"
app.route('/api')
  .get(async(req, res) => {
    console.log('GET request detected');
    res.send(`Lab 5 for ${process.env.NAME}`);
  })
  .post(async (req, res) => {
    console.log('POST request detected');
    console.log('Form data in res.body', req.body);

    const data = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');
    const json = await data.json();
    console.log('data from fetch', json);
    res.json(json);
  });

// step 1, 2, 3
app.route('/sql')
  .get(async(req, res) => {
    console.log('GET request detected');
    res.send(`Lab 5 for ${process.env.NAME}`);
  })
  .post(async (req, res) => {
    console.log('POST request detected');
    console.log('Form data in res.body', req.body);

    // step 10
    const json = await databaseRetriever();
    console.log('data from fetch', json);
    res.json(json);
  });

// step 4
async function foodDataFetcher() {
  const data = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');
  const json = await data.json();
  return json;
}

// step 5
async function clearData() {
  const deleteSql = `DELETE FROM food `;
  console.log("deleteSql=", deleteSql);
  await db.run(deleteSql);
}

// step 5
async function dataInput(foodJsons) {
  foodJsons.map(async foodJson => {
    const insertSql = `
      INSERT INTO food (
        name,
        category,
        inspection_date,
        inspection_results,
        city,
        state,
        zip,
        owner,
        type
      )
      values (
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?
      )
    `;
    console.log("insertSql=", insertSql);
    await db.run(insertSql, [
      foodJson.name,
      foodJson.category,
      foodJson.inspection_date,
      foodJson.inspection_results,
      foodJson.city,
      foodJson.state,
      foodJson.zip,
      foodJson.owner,
      foodJson.type
    ], 
      
      function(err){
      if (err) {
        console.log("Fail to insert food.", err);
      }
    });
  });
}

// step 7
async function databaseRetriever() {
  const sql = `
    select count(name) as y,
      category as label
    from food
    group by category
  `;
   const result = await db.all(sql);
   return result;
}

await databseInitialize(dbSettings);

// step 9
await clearData();
const foodJsons = await foodDataFetcher();
await dataInput(foodJsons);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
