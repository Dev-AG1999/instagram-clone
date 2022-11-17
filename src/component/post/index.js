import React, { useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import "../../component/post/style.css";
import { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { db } from "../../firebase";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Modal } from "@mui/material";
import postimage from "../../assets/post-image.png";
import "../../component/mediaquery.css";
import { ProfilePostItems } from "../profile-post-items";



function Post({ userimage, postId, username, user, image, caption }) {
  // defining states
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [open, setOpen] = useState(false);
  const [postOption, setPostOption] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [posts, setPosts] = useState([]);
  const [currentUserId,setCurrentUserId]=useState(false);
  


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



  useEffect(() => {

    db.collection("post")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);




  // back button
  const BackBtn = (e) => {
    e.preventDefault();
    setOpenProfile(false);
  };

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


  const commentDelete = (id) => {
    const newArray = comments.filter((comment) => {
      return comment.id !== id;
    });
    setComments(newArray);
    setOpen(false);
  };

  return (
    <div className="post-wrapper">
      {username ===user ? (
        <Modal open={openProfile} onClose={() => setOpenProfile(false)}>
          <div className="Profile_wrapper">
            <div className="Profile_header">
              <h3>{user}</h3>
              <button
                style={{
                  background: "transparent",
                  border: "none",
                  textAlign: "center",
                  fontSize: "20px",
                  cursor: "pointer",
                }}
                onClick={BackBtn}
              >
                <strong>↩</strong>
              </button>
            </div>
            <div className="Profile_details">
              <Avatar
                style={{ height: "100px", width: "100px" }}
                src={postimage}
              ></Avatar>
              <div className="Profile_data">
                <div className="PostsNo">
                  <h2>10</h2>
                  <p>Posts</p>
                </div>
                <div className="Followers">
                  <h2>498</h2>
                  <p>Followers</p>
                </div>
                <div className="Following">
                  <h2>498</h2>
                  <p>Following</p>
                </div>
              </div>
            </div>
            <div className="UserBio">
              <h3>{user}</h3>
              <p>my name is {user}</p>
            </div>
            <div className="Profile_editbtn">
              <button>Edit profile</button>
            </div>
            <div className="All_posts">
              <div className="Profile_post_wrapper">
                {posts.map(({ id, post }) => (
                  <ProfilePostItems
                    key={post.id}
                    src={post.image}
                    postId={id}
                    user={username}
                  />
                ))}
              </div>
            </div>
          </div>
        </Modal>
        
      ) : (
        <Modal open={openProfile} onClose={() => setOpenProfile(false)}>
          <div className="Profile_wrapper">
            <div className="Profile_header">
              <h3>{username}</h3>
              <button
                style={{
                  background: "transparent",
                  border: "none",
                  textAlign: "center",
                  fontSize: "20px",
                  cursor: "pointer",
                }}
                onClick={BackBtn}
              >
                <strong>↩</strong>
              </button>
            </div>
            <div className="Profile_details">
              <Avatar
                style={{ height: "100px", width: "100px" }}
                src={postimage}
              ></Avatar>
              <div className="Profile_data">
                <div className="PostsNo">
                  <h2>10</h2>
                  <p>Posts</p>
                </div>
                <div className="Followers">
                  <h2>498</h2>
                  <p>Followers</p>
                </div>
                <div className="Following">
                  <h2>498</h2>
                  <p>Following</p>
                </div>
              </div>
            </div>
            <div className="UserBio">
              <h3>{username}</h3>
              <p>my name is {username}</p>
            </div>
            <div className="Profile_editbtn">
              <button>Follow</button>
            </div>
            <div className="All_posts">
              <div className="Profile_post_wrapper">
                {posts.map(({ id, post }) => (
                  <ProfilePostItems key={post.id} src={post.image} postId={id} />
                ))}
              </div>
            </div>
          </div>
        </Modal>
        
      )}
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
                  onClick={() => postDelete()}
                >
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
            <button
              style={{ background: "transparent", border: "none" }}
              onClick={()=>setOpenProfile(true)}
            >
              <h5 style={{ cursor: "pointer" }}>{username}</h5>
            </button>
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
                      onClick={() => commentDelete(comment.id)}
                    >
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
