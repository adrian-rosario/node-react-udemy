const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
// 12 add axios ...
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

// 10 helper function...
const myEventsHandler = (type, data) => {
  if (type === "PostCreated") {
    console.log("reading a PostCreated");
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  if (type === "CommentCreated") {
    console.log("reading a CommentCreated");
    const { id, content, postId, status } = data; // 3. add/extract the new status property
    const post = posts[postId];
    post.comments.push({ id, content, status }); // 4. persist the status flag as well
  }

  // 7.
  if (type === "CommentUpdated") {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    const comment = post.comments.find((eachComment) => {
      return eachComment.id === id;
    });

    // content or status may have changed, update them both
    comment.status = status;
    comment.content = content;
  }
};

// GET post
app.get("/posts", (req, res) => {
  console.log("Query service, GET posts");
  res.send(posts);
});

// POST events
app.post("/events", (req, res) => {
  console.log("Query service, POST posts");
  const { type, data } = req.body; // every one of our events has a type and data

  console.log("Query service, posts:\n", posts);

  myEventsHandler(type, data);

  res.send({});
});

app.listen(4002, async () => {
  console.log("Query service listening on: 4002");
  // 11 call the event bus to get all events whenever we're online
  const responseInformation = await axios.get(
    "http://event-bus-cluster-ip-service:4005/events"
  );
  // "http://localhost:4005/events"

  console.log("Query service, running moderation filters...");
  for (let eventData of responseInformation.data) {
    console.log("Processing: ", eventData.type);
    myEventsHandler(eventData.type, eventData.data);
  }
});
