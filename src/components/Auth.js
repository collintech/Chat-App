import React from 'react'
import { auth, provider } from '../firebaseConfig'
import { signInWithPopup } from 'firebase/auth'

import Cookies from 'universal-cookie'
const cookies = new Cookies();

const Auth = (props) => {

    const { setIsAuth } = props
    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider)
            cookies.set("auth-token", result.user.refreshToken)
            setIsAuth(true)
        } catch (err) {
            console.error(err)
        }
    };
    return (
        <div className='auth'>
            <h1>Sign in with Google</h1>
            <button onClick={signInWithGoogle}>Google Account</button>
        </div>


    )
}

export default Auth