import React, { useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import "../../component/post/style.css";
import { useState } from "react";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { db } from "../../firebase";

function Post({ userimage,postId, username,user, image, caption }) {

  // defining states
  const[comments,setComments]=useState([]);
  const[comment,setComment]=useState("");

  // use effect listener for fetching comments
  useEffect(()=>
  {
    let unsubscribe;
    if(postId){
      unsubscribe = db.collection("post").doc(postId).collection("comments").orderBy('timestamp','desc').onSnapshot((snapshot)=>{
        setComments(snapshot.docs.map((doc)=>doc.data()));
      });
    }
    return ()=>{
      unsubscribe();
    }
  },[postId]);


// comment post button

  const postComment=(e)=>{
e.preventDefault();
db.collection("post").doc(postId).collection("comments").add({
  text:comment,
  username:user,
  timestamp: firebase.firestore.FieldValue.serverTimestamp(),
});
setComment("");
  }


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
      <div className="post_comments">
        {
          comments.map((comment)=>(
            <p className="comment">
              <strong>{comment.username}</strong> {comment.text}
            </p>
          ))
        }
      </div>

{/* if user logged in */}
{user &&(
    <form className="post_comment_section">
    <input className="post_comment_box" placeholder="add a comment..." value={comment} type="text" onChange={(e)=>setComment(e.target.value)}></input>
    <button className="post_button" disabled={!comment} type="submit" onClick={postComment}>Post</button>
  </form>
)}
     
    </div>
  </div>
  );
}


export default Post;
