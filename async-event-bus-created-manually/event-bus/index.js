const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const config = require("./constants/hosts");
const app = express();

app.use(bodyParser.json());

// 9
const events = [];

app.post("/events", (req, res) => {
  const theEvent = req.body;

  // 9
  events.push(theEvent);

  axios.post("http://localhost:4000/events", theEvent).catch((err) => {
    console.log("Event Bus error, calling Posts service\n>>", err.message);
  });
  axios.post("http://localhost:4001/events", theEvent).catch((err) => {
    console.log("Event Bus error, calling Comments service\n>>", err.message);
  });
  axios.post("http://localhost:4002/events", theEvent).catch((err) => {
    console.log("Event Bus error, calling Query service\n>>", err.message);
  });
  // 6. adding moderation service
  axios.post("http://localhost:4003/events", theEvent).catch((err) => {
    console.log("Event Bus error, calling Moderation service\n>>", err.message);
  });

  res.send({ status: "ok" });
});

// 9
app.get("/events", (req, res) => {
  res.send(events);
});

app.listen(config.BUS_PORT, () => {
  console.log("Event Bus service listening on Bus Port: ", config.BUS_PORT);
});
