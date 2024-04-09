import React, { useState } from "react";
import axios from "axios";
// import { LOCAL } from "./constants/network";

export default function CommentCreate({ postId }) {
  const [content, setTheConent] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    // console.log(`${LOCAL.BASE}${LOCAL.COMMENTS_PORT}/posts/${postId}/comments`);
    await axios.post(`http://posts.com/posts/${postId}/comments`, {
      content,
    });
    console.log("this was sent: ", { content });
    setTheConent("");
  };

  return (
    <>
      <div>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <label htmlFor='formInput'>Add a comment</label>
            <input
              value={content}
              onChange={(e) => setTheConent(e.target.value)}
              id='formInput'
              className='form-control'
              style={{ marginBottom: "6px" }}
            ></input>
          </div>
          <div>
            <button className='btn btn-primary'>Submit</button>
          </div>
        </form>
      </div>
    </>
  );
}
