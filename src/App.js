import React, { useState, useRef } from 'react'
import Chat from './components/Chat';
import './App.css';
import Auth from './components/Auth';


import Cookies from 'universal-cookie'
import { signOut } from 'firebase/auth';
import { auth } from './firebaseConfig';
const cookies = new Cookies();

function App() {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"))
  const [room, setRoom] = useState(null)

  const chatRef = useRef(null)

  const signOutofGoogle = async () => {
    try {
      await signOut(auth)
      cookies.remove("auth-token")
      setIsAuth(false)
      setRoom("")
    } catch (err) {
      console.error(err)
    }
  }

  if (!isAuth) {
    return (
      <div className='app'>
        <h1>Let's build a chat app 🚀</h1>
        <Auth setIsAuth={setIsAuth} />
      </div>
    );
  };

  return (
    <div className='intro'>
      <div>
        {room ?
          <div><Chat room={room} /></div> :
          <div>
            <input ref={chatRef} placeholder='enter room' />
            <button onClick={() => setRoom(chatRef.current.value)}>Enter Room</button>
          </div>
        }
      </div>

      <div>
        <button className='sign-out' onClick={signOutofGoogle}>Sign out</button>
      </div>
    </div>
  )
}

export default App;
