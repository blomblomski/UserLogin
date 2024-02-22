import React from 'react'
import Header from '../components/Header'
import Login from '../components/Login'

const LoginPage = () => {
    return (
        <div>
            <Header />
            <main className='mx-auto container'>
                <Login />
            </main>
        </div>
    )
}

export default LoginPage