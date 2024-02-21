import { useState, useEffect } from "react";
import axios from "axios";

function App() {

  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("/api/welcome").then((response) => {
      setMessage(response.data.message);
    });
  }, []);


  return (
    <div>
      <main className="mx-auto container">
        <h1 className="text-3xl font-bold underline">{message}</h1>
      </main>
    </div>
  );
}

export default App;
