import React from 'react'
import {Route, Navigate, Outlet} from 'react-router-dom'
import {useAuth} from '../contexts/AuthContext'

export default function PrivateRoute({component: component, ...rest}) {
    const { currentUser } = useAuth()
  return (
        currentUser ? <Outlet/> : <Navigate to='/auth/login'/>
  )
}
