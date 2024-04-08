const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const config = require("./constants/hosts");
const app = express();

app.use(bodyParser.json());

const events = [];

app.post("/events", (req, res) => {
  const theEvent = req.body;

  events.push(theEvent);

  axios
    .post("http://posts-cluster-ip-service:4000/events", theEvent)
    .catch((err) => {
      // axios.post("http://localhost:4000/events", theEvent).catch((err) => {
      console.log("Bus error, calling Posts service\n>>", err.message);
    });
  axios
    .post("http://comments-cluster-ip-service:4001/events", theEvent)
    .catch((err) => {
      console.log("Bus error, calling Comments service\n>>", err.message);
    });
  axios
    .post("http://query-cluster-ip-service:4002/events", theEvent)
    .catch((err) => {
      console.log("Bus error, calling Query service\n>>", err.message);
    });
  axios
    .post("http://moderation-cluster-ip-service:4003/events", theEvent)
    .catch((err) => {
      console.log("Bus error, calling Moderation service\n>>", err.message);
    });

  res.send({ status: "ok" });
});

app.get("/events", (req, res) => {
  res.send(events);
});

app.listen(config.BUS_PORT, () => {
  console.log("Live Event Bus service listening on Bus Port:", config.BUS_PORT);
});
