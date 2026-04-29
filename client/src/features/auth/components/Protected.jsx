// if user exits then mean logged in 
// if user is null then mean not logged in
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const Protected = ({children}) => {

    const { user,loading } = useAuth()
    if(loading){
        return (<main><h1>Loading.......</h1></main>)
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

  return children;
}

export default Protected