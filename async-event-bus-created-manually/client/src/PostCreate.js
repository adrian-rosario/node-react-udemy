import React, { useState } from "react";
import axios from "axios"; // so we can make a request
// import { LOCAL } from "./constants/network";

export default function CreatePostLayout() {
  const [title, setTitle] = useState("");

  const onSubmit = async (event) => {
    /* "event" instead of dealing with callbacks/promises */
    event.preventDefault();

    //  axios.post(`${LOCAL.BASE}${LOCAL.POSTS_PORT}/posts`, {title})
    await axios.post(`http://posts.com/posts/create`, { title });

    // after we're done, clear out the input so we know something happened
    console.log("this was set: ", title);
    setTitle("");
  };

  return (
    <>
      <div>
        <div>
          <h1>Hello, welcome to this blog example</h1>
        </div>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <label htmlFor='input_title'>Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type='text'
              id='input_title'
              className='form-control'
              style={{ marginBottom: "6px" }}
            />
          </div>

          <div className='action'>
            <button className='btn btn-primary'>Button</button>
          </div>
        </form>
      </div>
    </>
  );
}
