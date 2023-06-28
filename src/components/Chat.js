import React, { useEffect, useState } from 'react'
import { auth, db } from '../firebaseConfig'
import './chat.css'


import { collection, addDoc, where, query, onSnapshot, serverTimestamp, doc, deleteDoc, orderBy } from 'firebase/firestore'

export const Chat = ({ room }) => {
    const [newMessage, setNewMessage] = useState("")
    const [messages, setMessages] = useState([])

    const docRef = collection(db, "messages")

    const currentDate = new Date()

    const time = {
        year: currentDate.getFullYear(),
        month: currentDate.toLocaleString('default', { month: 'long' }),
        weekday: currentDate.toLocaleString('default', { weekday: 'long' }),
        day: currentDate.getDate(),
        hour: currentDate.getHours(),
        minute: currentDate.getMinutes(),
        second: currentDate.getSeconds(),
    }

    const timer = `${time.hour}:${time.minute}:${time.second}... ${time.weekday} ${time.day}, ${time.month}, ${time.year}`


    useEffect(() => {
        try {
            const messageRef = query(docRef, where("room", "==", room), orderBy("createdAt"))
            var unsubscribe = onSnapshot(messageRef, (snapshot) => {
                let messages = [];
                snapshot.forEach((doc) => {
                    messages.push({ ...doc.data(), id: doc.id })
                })
                setMessages(messages)
            })
        } catch (err) {
            console.error(err)
        }
        return () => unsubscribe();
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (newMessage === " ") return;

            await addDoc(docRef, {
                text: newMessage,
                createdAt: serverTimestamp(),
                user: auth.currentUser.displayName,
                room,
            })
            setNewMessage("")
        } catch (err) {
            console.error(err)
        }
    };

    const deleteMessage = async (messageId) => {
        try {
            const messageRef = doc(db, "messages", messageId)
            await deleteDoc(messageRef)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className='room-cta'>
            <div className='room-header'>
                <h2 className='room-title'>Welcome to: {room}</h2>
            </div>
            <div className='room-chat'>
                {messages.map(message =>
                    <div key={message.id}>
                        <span>
                            <b>{message.user.toUpperCase()}&nbsp;</b> <em></em>{message.text} {timer}
                        </span>
                        <button className='del-btn' onClick={() => deleteMessage(message.id)}>Delete message</button>
                    </div>
                )}
            </div>
            <form onSubmit={handleSubmit}>
                <input onChange={(e) => setNewMessage(e.target.value)} placeholder='enter chat...' value={newMessage} className='chat-box' />
                <button type='submit' className='send-btn'>Send</button>
            </form>
        </div>
    )
}

export default Chat
