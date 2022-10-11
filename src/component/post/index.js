import React from "react";
import Avatar from "@mui/material/Avatar";
import "../../component/post/style.css";

function Post({ userimage, username, image, caption }) {
  return (
  <div className="post-wrapper">
      <div className="post">
      <div className="post_header">
        <Avatar
          className="post_header_image"
          alt=""
          src={userimage}
        ></Avatar>
        <h5>{username}</h5>
      </div>
      <img className="post_image" alt="" src={image} />
      <span className="post_caption"><strong className="post_caption_username" >{username}</strong>{caption}</span>
    </div>
  </div>
  );
}

export default Post;
