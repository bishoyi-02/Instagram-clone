import { Button } from '@mui/material'
import React, {useState} from 'react'
import  {storage, db} from './firebase';
import firebase from 'firebase/compat/app';
import './ImageUpload.css'
// import {  serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

function ImageUpload(props) {
   
    const [caption,setCaption] = useState("");
    const [image,setImage] = useState(null);
    const [progress,setProgress] = useState(0);
    const handleChange=(e)=>{
        if(e.target.files[0]){
            setImage(e.target.files[0])
            // console.log(image.name)
        }
    }
    const handleUpload=()=>{
        // const uploadTask = storage.ref(`images/${image.name}`).put(image)
        const storage = getStorage();
        const storageRef = ref(storage, `images/${image.name}`);

        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
            'state_changed',
            (snapshot)=>{
                // progress function
                const progress =Math.round((snapshot.bytesTransferred / snapshot.totalBytes)*100)
                
                setProgress(progress)
                switch (snapshot.state) {
                    case 'paused':
                      console.log('Upload is paused');
                      break;
                    case 'running':
                      console.log('Upload is running');
                      break;
                  }
            },
            (error)=>{
                //error function
                alert(error.message);
                console.log(error);
            },
            ()=>{
                //complete function
                // storage
                // .ref("images")
                // .child(image.name)
                // .getDownloadURL()
                getDownloadURL(uploadTask.snapshot.ref)
                .then(url=>{
                    console.log(url)
                    // const docRef = doc(url)
                    db.collection("posts").add({
                        
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption:caption,
                        imageURL:url,
                        username:props.username
                    })
                    setProgress(0)
                    setCaption("")
                    setImage(null)

                })

            }
        )
    }
  return (
    <div className="uploadContainer">
    <div className="imageupload">
        <progress className="imageupload__progress" value={progress} max="100"/>
        <input type="text" placeholder="Enter a caption" value={caption} onChange={event=>setCaption(event.target.value)} />
        <input type="file"  onChange={handleChange}  />
        <Button onClick={handleUpload}>
            Upload
        </Button>
    </div>
    </div>
  )
}

export default ImageUpload