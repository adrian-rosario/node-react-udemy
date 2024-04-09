import React, { useState, useEffect } from "react";
import axios from "axios"; // so we can make a request
import CommentCreate from "./CommentCreate";
// import { LOCAL } from "./constants/network";
import CommentList from "./CommentList";

export default function PostList() {
  const [getPosts, setPosts] = useState({});

  /**
   * Pre query / event bus integration
   * 
    const fetchPosts = async () => {
      const res = await axios.get(`${LOCAL.BASE}${LOCAL.POSTS_PORT}/posts`);
      setPosts(res.data);
    }
   * 
   */

  const fetchPosts = async () => {
    // (`${LOCAL.BASE}${LOCAL.QUERY_PORT}/posts`)
    const res = await axios.get(`http://posts.com/posts`);
    console.log("PostList data:\n", res.data);

    /**
     * example data returned:
     * {
        "id": "fbbd11ab",
        "title": "my new post"
        }
     */

    setPosts(res.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []); // empty array, only run one time

  console.log("get posts: " + toString(getPosts));

  const renderedPosts = Object.values(getPosts).map((post) => {
    return (
      <div
        className='card'
        style={{ width: "30%", marginBottom: "20px" }}
        key={post.id}
      >
        <div className='card-body'>
          <h3>{post.title}</h3>

          <CommentList comments={post.comments} />
          {/* 
            pre event bus / query integration
            this also still makes an extra call evern though the query service handles it after the change
            <CommentList postId={post.id} />          
           */}

          <CommentCreate postId={post.id} />
        </div>
      </div>
    );
  });

  return (
    <>
      <div>
        <h2>Posts List</h2>
        <div className='d-flex flex-row flex-wrap justify-content-between'>
          {renderedPosts}
        </div>
      </div>
    </>
  );
}
