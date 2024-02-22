import React, { useState } from 'react'
import { NavLink } from "react-router-dom";

const Header = () => {
    const [token, setToken] = useState(localStorage.getItem('token'));

    return (
        <nav className="w-full h-20 flex justify-between items-center px-8">
            <h1 className='text-3xl font-bold text-[#f34646]'>Recipes</h1>

            <ul className="flex">
                <li className="mr-4"><NavLink
                    to="/"
                    className={({ isActive, isPending }) =>
                        isPending ? "pending" : isActive ? "border-b-2 border-black" : ""
                    }
                >
                    Home
                </NavLink></li>

                {!token && <li className="mr-4"><NavLink
                    to="/login"
                    className={({ isActive, isPending }) =>
                        isPending ? "pending" : isActive ? "border-b-2 border-black" : ""
                    }
                >
                    Login
                </NavLink></li>
                }
                {!token && <li className="mr-4"><NavLink
                    to="/register"
                    className="bg-green-600 p-2 rounded text-white">
                    Register
                </NavLink></li>
                }
                {token && <li className="mr-4"><NavLink
                    to="/logout"
                    className={({ isActive, isPending }) =>
                        isPending ? "pending" : isActive ? "border-b-2 border-black" : ""
                    }
                >
                    Logout
                </NavLink></li>
                }

            </ul>
        </nav >
    )
}

export default Header