import { Button } from "@mui/material";
import React from "react";
import { useState } from "react";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { storage, db } from "../../firebase";

const ImageUpload = ({username} ) => {
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const handleUpload = () => {
    //img getting uploaded
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // progress function
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        );

        //setting progress on 100%
        setProgress(progress);
        console.log('Runing')

        //function to send uploaded image from storage

        console.log('user', username)
        
        if(progress==100)
        {
          storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then(url => {
            db.collection("post").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption:caption,
              image: url,
              username:username,
            });
            setProgress(0);
            setCaption("");
            setImage(null);
          });
        }
       

      }

    
    );

  };

  return (
    <div>
        <progress value={progress} max="100"/>
      <input
        type="text"
        placeholder="Enter a caption"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <input type="file" onChange={handleChange}/>
      <Button className="imageupload_button" onClick={handleUpload}>
        Upload
      </Button>
    </div>
  );

};

export default ImageUpload;
