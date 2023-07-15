import React from 'react'
import Navbar from '../components/navbar/Navbar'

export function LayoutLogin({children}) {
  return (
    <div style={{display: 'flex', alignItems: 'center' ,justifyContent: 'center', height: '100vh'}}>
        {children}
    </div>
  )
}


export function Layout({children}) {
    return (
        <>
        <Navbar/>
        {children}
        </>
    )
  }
  