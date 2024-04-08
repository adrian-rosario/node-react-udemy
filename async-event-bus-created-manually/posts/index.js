import express from "express"; // node web framework
import { randomBytes } from "crypto"; // for randomBytes
import bodyParser from "body-parser"; // to parse object in request body
import cors from "cors";
import axios from "axios";

const app = express();
app.use(bodyParser.json()); // so the body shows up correctly in our reqeuest handler
app.use(cors());

const posts = {};

// route handler 1
app.get("/posts", (req, res) => {
  res.send(posts);
});

// route handler 2
app.post("/posts", async (req, res) => {
  const id = randomBytes(4).toString("hex"); // four bytes of random data, hexadecimal
  console.log("posts POST call, the id for post: " + id);
  const { title } = req.body;
  posts[id] = {
    id,
    title,
  };

  await axios.post("http://event-bus-cluster-ip-service:4005/events", {
    //  await axios.post("http://localhost:4005/events", {
    type: "PostCreated",
    data: {
      id,
      title,
    },
  });

  res.status(201).send(posts[id]);
});

// received from event bus
app.post("/events", (req, res) => {
  // type
  // data
  console.log("received: ", req.body.type);
  res.send({});
});

// server port
app.listen(4000, () => {
  console.log("Posts service listening on 4000\nBuild: Using Docker Config");
});
