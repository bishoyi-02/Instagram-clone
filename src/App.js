import React,{useState,useEffect} from 'react'
import './App.css';
import Post from './Post';
import {auth, db} from './firebase';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { Input } from '@mui/material';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';


function App() {
  const [posts,setPosts]=useState([]);
  const [open, setOpen] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [user,setUser] = useState(null)
  const [openSignIn,setOpenSignIn]= useState(false)
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  function handleSignUp(event){
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email,password)
    .then((authUser)=>{
      return authUser.user.updateProfile({
        displayName:username
      })
    })
    .catch((error)=>alert(error.message))
    setOpen(false)
  }


  useEffect(()=>{
    const unsubscribe=auth.onAuthStateChanged((authUser)=>{
      if(authUser){
        // console.log(authUser);
        setUser(authUser);
      }else{
        setUser(null)
      }
    })
    return () => {
      unsubscribe();
    }
  },[user,username])


  useEffect(()=>{
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot =>{
      // console.log(snapshot.docs)
      setPosts(snapshot.docs.map(doc => {
        return {
          post:doc.data(),
          id:doc.id
        }
      }))
    })

  },[])

  const signIn = (e)=>{
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((e)=>alert(e.message))
      setOpenSignIn(false)

  }

  return (
    <div className="app">
    
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
          <form className="app__signup"action="">
            <center>
              <img className="app__headerImage"
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1280px-Instagram_logo.svg.png" 
                    alt="instagram" 
              />
            </center>  
              <Input type="text" placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)} />
              <Input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
              <Input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
              <Button type="submit" onClick={handleSignUp}> Sign Up</Button>
          </form>
          </Box>
        </Modal>

        <Modal
          open={openSignIn}
          onClose={()=>setOpenSignIn(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
          <form className="app__signup"action="">
            <center>
              <img className="app__headerImage"
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1280px-Instagram_logo.svg.png" 
                    alt="instagram" 
              />
            </center>  
              
              <Input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
              <Input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
              <Button type="submit" onClick={signIn}> Sign In</Button>
          </form>
          </Box>
        </Modal>
         
          
          
        
        <div className="app__header">
          <img className="app__headerImage"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1280px-Instagram_logo.svg.png" 
                alt="" 

          />
          {
          user?(<Button onClick={()=>auth.signOut()}>Logout</Button>)
          :(
            <div>
            <Button onClick={()=>setOpen(true)}>Sign Up</Button>
            <Button onClick={()=>setOpenSignIn(true)}>Sign In</Button>
            </div>
          )
        }
        </div>
        <div className="app__posts">
        {posts.map(post => {
          
          return <Post key={post.id} user={user} postId={post.id} username={post.post.username} caption={post.post.caption} imageURL={post.post.imageURL}/>
        })}
        </div>

        
        {user?.displayName &&
        <ImageUpload username={user.displayName}/>
        }
        

        
       
    </div>
  );
}

export default App;
