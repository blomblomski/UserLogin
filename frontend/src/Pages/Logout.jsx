import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom'

const Logout = () => {

    useEffect(() => {
        localStorage.removeItem('token')
    }, [])

    return (
        <div><Navigate to='/login' /></div>
    )
}

export default Logout
