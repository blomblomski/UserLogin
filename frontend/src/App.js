
import Header from "./components/Header";
import { useState } from "react";
import { Link } from "react-router-dom";

function App() {

  const [token, setToken] = useState(localStorage.getItem('token'));
  return (
    <div>
      <Header />
      <main className="mx-auto container">        
        {!token &&
          <p className="text-center">Not logged in. <Link className="p-2 bg-blue-700 text-white rounded" to="/login">Login</Link> <span>or</span> <Link className="p-2 rounded bg-green-700 text-white" to="/register">Register</Link></p>
        }
      </main>
    </div>
  );
}

export default App;
