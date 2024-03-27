const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

app.post(
  "/events", // :grimacing: use constants where possible
  async (req, res) => {
    // anytime we see an event of CommentCreated
    // we do some moderation on it
    // emit CommentModerated event

    // 5. addnig content filter for 'orange'
    const { type, data } = req.body;
    if (type === "CommentCreated") {
      console.log("Moderation service, processing new comment");

      const status = data.content.includes("orange") ? "rejected" : "approved";

      await axios.post("http://localhost:4005/events", {
        type: "CommentModerated",
        data: {
          id: data.id,
          postId: data.postId,
          status,
          content: data.content,
        },
      });
    }

    res.send({});
  }
);

app.listen(4003, () => {
  console.log("Moderation service listening on 4003");
});
