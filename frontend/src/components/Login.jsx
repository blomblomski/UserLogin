import React from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import ErrorMessage from './ErrorMessage'

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [error, setError] = useState()
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        setError(null)

        if (!username || !password) {
            return setError('Username and password required')
        }
        axios.post('/api/token', JSON.stringify(`grant_type=&username=${username}&password=${password}&scope=&client_id=&client_secret=`)).then(response => {
            if (response.status === 200) {
                localStorage.setItem('token', response.data.access_token)
                return navigate('/')
            }
        }).catch(error => {
            if (error.response.status === 401) {
                return setError('Invalid credentials')
            }
            return setError('Something went wrong')
        })

    }

    return (
        <div>
            <h2 className='text-2xl font-bold text-center'>Login</h2>
            {error && <ErrorMessage message={error} />}
            <form className='w-1/2 mx-auto mt-8' onSubmit={handleSubmit}>
                <div className='mb-4'>
                    <label htmlFor='username' className='block text-sm font-bold mb-2'>Username</label>
                    <input onChange={e => setUsername(e.target.value)} value={username} type='text' id='username' name='username' className='w-full p-2 border border-gray-300 rounded' autoComplete="on" />
                </div>
                <div className='mb-4'>
                    <label htmlFor='password' className='block text-sm font-bold mb-2'>Password</label>
                    <input onChange={e => setPassword(e.target.value)} value={password} type='password' id='password' name='password' className='w-full p-2 border border-gray-300 rounded' autoComplete="on" />
                </div>
                <button type='submit' className='w-full p-2 bg-blue-500 text-white rounded'>Register</button>
            </form>
            <p className='text-center mt-4'>Need an account? <Link to='/register' className='text-blue-500'>Register</Link></p>
        </div>
    )
}

export default Login