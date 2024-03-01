import React, { useEffect,useState } from 'react'
import { Avatar } from '@mui/material';
import './Post.css'
import firebase from 'firebase/compat/app';
import {auth, db} from './firebase';

function Post({postId,user,username,caption,imageURL}) {
  const [comments,setComments] = useState([]);
  const [comment,setComment] = useState('')

  useEffect(()=>{
    let unsubscribe ;
    if(postId){
      // console.log(postId)
      db
      .collection("posts")
      .doc(postId)
      .collection("comments")
      .orderBy('timestamp','desc')
      .onSnapshot((snapshot)=>{
        // console.log(snapshot.docs)
        setComments(snapshot.docs.map((doc)=>{
          // console.log(doc.data())
          return (
           doc.data()
          )
        }));
      })
      // console.log(comments);
    }
    // return ()=>{
    //   unsubscribe
    // }
    
  },[postId])

  const postComment = (event)=>{
      event.preventDefault();
      db.collection("posts").doc(postId).collection("comments").add({ 
        text:comment,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        username:user.displayName
      })
      setComment('');
  }



  return (
    <div className= "post">
    <div className="post__header">
        <Avatar className="post__avatar" alt="CindyBaker" src="" />
        <h3>{username}</h3>

    </div>
        <img className="post__image" src={imageURL}/>
        <h4 className="post__text"><strong>{username} :</strong> {caption}</h4>
        <div className="post__comments">
          {comments.map((comment) =>{
            
            return ( 
              <div className="post__comment">
              <strong>{comment.username}</strong>
              &nbsp;
              :
              &nbsp;
              <p>{comment.text}</p>
              </div>
              )
          })}
        </div>
        {user&&
          <form className="post__commentBox" action="">
            <input type="text" className="post__input" placeholder="Add a comment" value={comment} onChange={(e)=>setComment(e.target.value)}/>
            <button
              className="post__button"
              disabled={!comment}
              type="submit"
              onClick={postComment}
            >
              Post
            </button>
          </form>
        
        }
    </div>
  )
}

export default Post