import React from "react";

export default function CommentList({ comments }) {
  const renderedComments = comments.map((comment) => {
    // 8
    let content;

    if (comment.status === "approved") {
      content = "Approved"; // comment.content;
    }

    if (comment.status === "pending") {
      content = "Awaiting moderation";
    }

    if (comment.status === "rejected") {
      content = "Rejected";
    }

    return (
      <li key={comment.id}>
        {comment.content} <br />
        Status: {content}
      </li>
    );
  });

  return (
    <>
      <ul>{renderedComments}</ul>
    </>
  );
}
