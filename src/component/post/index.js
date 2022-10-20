import React, { useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import "../../component/post/style.css";
import { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { db } from "../../firebase";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Modal } from "@mui/material";

function Post({ userimage, postId, username, user, image, caption }) {
  // defining states
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [open, setOpen] = useState(false);
  const [postOption, setPostOption] = useState(false);

  // use effect listener for fetching comments
  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("post")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);

  // comment post button

  const postComment = (e) => {
    e.preventDefault();
    db.collection("post").doc(postId).collection("comments").add({
      id: Math.random(),
      text: comment,
      username: user,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };

  const postDelete = () => {
    if (user === username) {
      db.collection("post")
        .doc(postId)
        .delete()
        .then(() => {
          console.log("Document successfully deleted!");
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
        });
    }
  };

  // const handleDelete = async (id) => {
  //   const taskDocRef = doc(db, 'comments', id)
  //   try{
  //     await deleteDoc(taskDocRef)
  //   } catch (err) {
  //     alert(err)
  //   }
  // }
  const commentDelete = (id) => {
    // db.collection("post").doc(postId).collection("comments").doc().delete().then(() => {
    //   console.log("Document successfully deleted!");
    // }).catch((error) => {
    //   console.error("Error removing document: ", error);
    // });

    const newArray = comments.filter((comment) => {
      return comment.id !== id;
    });
    setComments(newArray);
    setOpen(false);
  };

  return (
    <div className="post-wrapper">
      <div className="post">
        <div
          className="post_header"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <Modal open={postOption} onClose={() => setPostOption(false)}>
            {user === username ? (
              <div
                className="post_options"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%,-50%)",
                  display: "flex",
                  background: "white",
                  width: "120px",
                  padding: "10px",
                  borderRadius: "8px",
                }}
              >
                
                <button
                  style={{ background: "none", border: "none" }}
                  onClick={() => postDelete()}>
                  Delete
                </button>
                
              </div>
            ) : (
              <div className="post_options" style={{ display: "none" }}></div>
            )}
          </Modal>
          <div
            className="user_details"
            style={{ display: "flex", alignItems: "center" }}
          >

            <Avatar
              className="post_header_image"
              alt=""
              src={userimage}
            ></Avatar>
            <h5>{username}</h5>
          </div>

          <button className="post_option" onClick={() => setPostOption(true)}>
            <MoreVertIcon></MoreVertIcon>
          </button>
        </div>
        <img className="post_image" alt="" src={image} />
        <span className="post_caption">
          <strong className="post_caption_username">{username}</strong>
          {caption}
        </span>
        <div className="post_comments">
          {comments.map((comment) => (
            <div className="comment_appearance">
              <p key={comment.id} className="comment" style={{ flex: "1" }}>
                <strong>{comment.username}</strong> {comment.text}
              </p>
              <div
                className="comment_right"
                style={{ position: "relative", flex: "0" }}
              >
                <button className="option_button" onClick={() => setOpen(true)}>
                  <MoreVertIcon></MoreVertIcon>
                </button>
                <Modal open={open} onClose={() => setOpen(false)}>
                  <div
                    className="comment_options"
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%,-50%)",
                      display: "flex",
                      background: "white",
                      width: "120px",
                      padding: "10px",
                      borderRadius: "8px",
                    }}
                  >
                    <button
                      style={{ background: "none", border: "none" }}
                      onClick={() => commentDelete(comment.id)}>
                      Delete
                    </button>
                  </div>
                </Modal>
              </div>
            </div>
          ))}
        </div>

        {/* if user logged in */}
        {user && (
          <form className="post_comment_section">
            <input
              className="post_comment_box"
              placeholder="add a comment..."
              value={comment}
              type="text"
              onChange={(e) => setComment(e.target.value)}
            ></input>
            <button
              className="post_button"
              disabled={!comment}
              type="submit"
              onClick={postComment}
            >
              Post
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Post;
