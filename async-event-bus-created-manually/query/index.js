const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");


const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};
/*
Posts example data 
{
  'oijs': {
    id: 'oijs',
    title: 'post title',
    comments: [
      {id: 'oijos', content: 'comment...'}
    ]
  }
}
*/

// const comments = {};

// GET post
app.get("/posts", (req, res) => {
  console.log('query, GET posts');
  res.send(posts);
});

// POST events
app.post("/events", (req, res) => {
  console.log('query, POST posts');
  const {type, data} = req.body; // every one of our events has a type and data

  if (type === "PostCreated"){
    console.log('reading a PostCreated');
    const {id, title} = data;
    posts[id] = {id, title, comments: []};
  }
 
  
  if (type === "CommentCreated"){
    console.log('reading a CommentCreated');
    const {id, content, postId} = data;
    const post = posts[postId];
    post.comments.push({id, content});
  }  

  console.log('posts:\n', posts);

  res.send({});
});

app.listen(4002, () => {
  console.log("listening on: 4002");
});