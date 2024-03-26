import React from "react";
import PostCreate from './PostCreate';
import PostList from "./PostList";

const App = () => (
  <>
  <div className="container">
    <div>
      <h1>
        Create a new blog posting!
      </h1>
      <PostCreate />
      <hr />
      <PostList />
    </div>     
  </div>
  </>
)

export default App;
