const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const config = require("./constants/hosts");
const app = express();
// const cors = require('cors');

app.use(bodyParser.json());
// app.use(cors());

app.post("/events", (req, res) => {
  const theEvent = req.body;

  // console.log('path: ', `${config.BASE}${config.POSTS_PORT}/events`);
  // console.log('path: ', `${config.BASE}${config.COMMENTS_PORT}/events`);
  // console.log('path: ', `${config.BASE}${config.QUERY_PORT}/events`);

  // playing w/ constants
  // axios.post(`${config.BASE}${config.POSTS_PORT}/events`, theEvent);
  // axios.post(`${config.BASE}${config.COMMENTS_PORT}/events`, theEvent);
  // axios.post(`${config.BASE}${config.QUERY_PORT}/events`, theEvent);

  axios.post("http://localhost:4000/events", theEvent).catch((err) => {
    console.log(err.message);
  });
  axios.post("http://localhost:4001/events", theEvent).catch((err) => {
    console.log(err.message);
  });
  axios.post("http://localhost:4002/events", theEvent).catch((err) => {
    console.log(err.message);
  });

  // console.log('response: ', res);

  res.send({ status: "okidoki" });
});

app.listen(config.BUS_PORT, () => {
  console.log("Listening on Bus Port: ", config.BUS_PORT);
  // console.log("config.BASE", config.BASE);
  // console.log("config.POSTS_PORT", config.POSTS_PORT);
});
