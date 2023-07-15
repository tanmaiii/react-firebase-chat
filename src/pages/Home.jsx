import React from 'react'
import Sidebar from '../components/sidebar/Sidebar'
import Chat from '../components/chat/Chat'

export default function Home() {
  return (
    <div className='container grid'>
      <div className='flex'> 
        <Sidebar/>
        <Chat/>
      </div>
    </div>  
  )
}
