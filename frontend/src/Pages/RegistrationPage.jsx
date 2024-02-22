import Register from "../components/Register";
import Header from "../components/Header";

import React from 'react'

const RegistrationPage = () => {
    return (
        <div>
            <Header />
            <main className="mx-auto container">
                <Register />
            </main>
        </div>
    )
}

export default RegistrationPage