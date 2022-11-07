import React, { useEffect,useState } from "react";
import Avatar from "@mui/material/Avatar";
import postimage from "../../assets/post-image.png";
import { ProfilePostItems } from "../profile-post-items";
import "firebase/compat/firestore";
import { db } from "../../firebase";
import "../profile-pages/style.css";



export const ProfileUser=({user,username})=>{
    const [openProfile, setOpenProfile] = useState(false);
    const [posts, setPosts] = useState([]);

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

    const BackBtn = (e) => {
        e.preventDefault();
        setOpenProfile(false);
      };


    return(
    <div  className="profile_wrapper">
    <div className="profile_header">
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
    <div className="profile_details">
      <Avatar
        style={{ height: "100px", width: "100px" }}
        src={postimage}
      ></Avatar>
      <div className="profile_data">
        <div className="postsNo">
          <h2>10</h2>
          <p>Posts</p>
        </div>
        <div className="followers">
          <h2>498</h2>
          <p>Followers</p>
        </div>
        <div className="following">
          <h2>498</h2>
          <p>Following</p>
        </div>
      </div>
    </div>
    <div className="userBio">
      <h3>{user}</h3>
      <p>my name is {user}</p>
    </div>
    <div className="profile_editbtn">
      <button>Edit profile</button>
    </div>
    <div className="all_posts">
      <div className="profile_post_wrapper">
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
  </div>)
}