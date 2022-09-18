const { Client } = require("pg");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const client = new Client({
  database: "todo",
  user: "postgres",
  host: "localhost",
  password: "postgres",
  port: 5432,
});
client.connect();

/*
DROP TABLE IF EXISTS todos;
CREATE TABLE todos (
	id SERIAL PRIMARY KEY,
	entry VARCHAR ( 255 ) NOT NULL
);
*/

app.get("/", async function (req, res) {
  const sql = await client.query("SELECT * FROM todos");
  res.json(sql.rows);
});

app.get("/:id", async function (req, res) {
  const sql = await client.query(
    "SELECT * FROM todos WHERE id=" + req.params.id
  );
  res.json(sql.rows);
});

app.post("/", async function (req, res) {
  const sql = await client.query(
    `INSERT INTO todos (entry) VALUES ('${req.body.entry}');`
  );
  res.json(sql.rows);
});

app.patch("/:id", async function (req, res) {
  const sql = await client.query(
    `UPDATE todos SET entry='${req.body.entry}' WHERE id=${req.params.id};`
  );
  res.json(sql.rows);
});

app.delete("/:id", async function (req, res) {
  const sql = await client.query("DELETE FROM todos WHERE id=" + req.params.id);
  res.json(sql.rows);
});

app.listen(3001, "0.0.0.0", async function () {
  await client.query("TRUNCATE todos RESTART IDENTITY;");
  console.log("Started on port 3001");
});
