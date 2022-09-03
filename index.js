const express = require("express");
const mysql = require("mysql2");
var fs = require("fs");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((_request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, PUT, OPTIONS");
  next();
});

const conn = mysql.createPool({
  connectionLimit: 5,
  host: "sql329.main-hosting.eu",
  user: process.env.SQLUSER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

app.get("/", (request, response) => {
  return response.status(200).send("Server is running");
});

// Get All Thoughts
app.get("/thoughts", (req, res) => {
  conn.getConnection(function (err, connection) {
    if (err) {
      console.log("error:" + err.message);
      res.send(err.message);
      connection.release();
    }
    conn.query("SELECT * FROM wallofthoughts", function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
    connection.release();
  });
});

// Add Thought
app.post("/thought", (req, res) => {
  if (!req.body || !req.body.content || req.body.content === "") {
    res.sendStatus(400).send("Invalid Data Format");
    throw new Error("Invalid data format!");
  } else {
    conn.getConnection(function (err, connection) {
      if (err) {
        console.log("error:" + err.message);
        res.send(err.message);
        connection.release();
      }
      conn.query(`INSERT INTO wallofthoughts(content) VALUES ('${req.body.content}')`, function (err, result, fields) {
        if (err) throw err;
        res.sendStatus(200);
      });
      connection.release();
    });
  }
});

// Get All Users
app.get("/users", (req, res) => {
  conn.query("SELECT * FROM users", function (err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
});

// Add User
app.post("/user", (req, res) => {
  if (!req.body || !req.body.name || req.body.name === "" || !req.body.email || req.body.email === "") {
    throw err;
  }
  conn.query(
    `INSERT INTO users(id, name, email, created_at) VALUES ('','${req.body.name}','${req.body.email}', CURRENT_TIMESTAMP)`,
    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    }
  );
});

app.listen(process.env.PORT || 3000)
