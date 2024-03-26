import React /*, { useState, useEffect }*/ from "react";
// import axios from "axios";
// import { LOCAL } from "./constants/network";

export default function CommentList({ comments }) {
  /**
   * pre query / event bus integration
   * CommentList({ postId }) {
   *   const [theComments, setTheComments] = useState([]); // initialize as an empty array
   *   const fetchData = async () => {
      const res = await axios.get(`${LOCAL.BASE}${LOCAL.COMMENTS_PORT}/posts/${postId}/comments`);
      console.log('set a comment to: ', res.data);
      setTheComments(res.data);
    };

    useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // call one time
    const renderedComments = theComments.map((comment) => {
  */

  const renderedComments = comments.map((comment) => {
    // const theCommentText = comment.content; // .content
    return <li key={comment.id}>{comment.content}</li>;
  });

  return (
    <>
      <ul>{renderedComments}</ul>
    </>
  );
}
