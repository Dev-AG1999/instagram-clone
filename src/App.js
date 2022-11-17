import React, { useEffect, useState } from "react";
import "./App.css";
import logo2 from "./assets/instagram-logo.png";
import Post from "./component/post";
import { auth, db } from "./firebase";
import Modal from "@mui/material/Modal";
import { Button, Input } from "@mui/material";
import ImageUpload from "./component/imageUpload";
// import InstagramEmbed from "react-instagram-embed";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";
import { ProfileUser } from "./component/profile-pages/profilePageUser";

function App() {
  // setting states
  const [posts, setPosts] = useState([]);
  const [open,setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openImageUpload, setOpenImageUpload] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
 

  // useeffect for authentication
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // the user has loggeed in
        console.log(authUser.displayName);
        setUser(authUser.displayName);
      } else {
        // the user has logged out
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    
    };
  }, [user, username]);

  // use effect for posts
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

  // function for sign up button
  const SignUp = (e) => {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
          user:username
        });
      })
      .catch((error) => alert(error.message));
  setOpen(false);
    console.log("user",username)
  
  };

  // function for sign in button
  const SignIn = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setOpenSignIn(false);
    
  };

  // button to open sign in modal
const modalSignIn =(e)=>{
  e.preventDefault();
  setOpenSignIn(true);

}

// button for log out
  const LogOut=(e)=>{
    e.preventDefault();
    auth.signOut()
setOpen(true);
  }

  // returning app
  return (
    <div className="App">
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div className="sign_in_modal">
          <img
            style={{ marginBottom: "15px" }}
            alt=""
            className="app_header_image"
            src={logo2}
          />

          <Input
            placeholder="Email"
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          ></Input>
          <Input
            placeholder="Password"
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          ></Input>
          <Button
            onClick={SignIn}
            type="submit"
            style={{
              backgroundColor: "#77A7FF",
              color: "white",
              marginTop: "15px",
              cursor: "pointer",
            }}
            className="Sign_Up"
          >
            Sign In
          </Button>
        </div>
      </Modal>
    
      <Modal open={openImageUpload} onClose={() => setOpenImageUpload(false)}>
        <div className="upload_modal">
          {user ? (
            <ImageUpload userId={user.id} username={user} />
          ) : (
            <h3>Sorry you need to login to upload</h3>
          )}
        </div>
      </Modal>

      {/* conditional rendering if its user */}
      {user ? (
        <div className="app_wrapper">
          <div className="app_header_wrapper">
            <div className="app_header">
              <img alt="" className="app_header_image" src={logo2} />
              <Button
                onClick={() => setOpenImageUpload(true)}
                style={{ color: "black", cursor: "pointer" }}
              >
                <AddToPhotosIcon></AddToPhotosIcon>
              </Button>

              <Button
                style={{ color: "black", cursor: "pointer" }}
                onClick={LogOut}
              >
                Log Out
              </Button>
            </div>
          </div>

          <div className="post_section">
            <div className="post_left">
              {posts.map(({ id, post }) => (
                <Post
                  key={id}
                  postId={id}
                  userimage={post.userimage}
                  username={post.username}
                  user={user}
                  image={post.image}
                  caption={post.caption}
                />
              ))}
            </div>
           <div className="right">
            <ProfileUser username={username} user={user}/>
           </div>
          
            
          </div>
        </div>
      ) : (
        <div className="authentication">
         
             <div Open={open} onClose={()=>setOpen(false)}  className="sign_up_modal">
            <img
              style={{ marginBottom: "15px" }}
              alt=""
              className="app_header_image"
              src={logo2}
            />
            <Input
              placeholder="User Name"
              value={username}
              type="text"
              onChange={(e) => setUsername(e.target.value)}
            ></Input>
            <Input
              placeholder="Email"
              value={email}
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            ></Input>
            <Input
              placeholder="Password"
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            ></Input>
            <Button
              onClick={SignUp}
              type="submit"
              style={{
                backgroundColor: "#77A7FF",
                color: "white",
                marginTop: "15px",
                cursor: "pointer",
              }}
              className="Sign_Up"
            >
              Sign Up
            </Button>
            <p>
              Already have an account?<button  style={{ color: "rgb(119, 167, 255)", marginTop: "15px",border:"none",background:"transparent",cursor:"pointer" }}
              onClick={modalSignIn}>Sign in</button> 
            </p>
          </div>
       
      
        </div>
      )}
    </div>
  );
}

export default App;
