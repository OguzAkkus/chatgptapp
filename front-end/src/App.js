import "./App.css";
import HttpCall from "./components/HttpCall";
import WebSocketCall from "./components/WebSocketCall";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";

function App() {
  const [socketInstance, setSocketInstance] = useState("");
  const [loading, setLoading] = useState(true);
  const [buttonStatus, setButtonStatus] = useState(false);

  const handleClick = () => {
    if (buttonStatus === false) {
      setButtonStatus(true);
    } else {
      setButtonStatus(false);
    }
  };

  useEffect(() => {
    if (buttonStatus === true) {
      let socket;
      socket = io("0.0.0.0:5001/", {
        transports: ["websocket"],
        cors: {
          origin: "http://0.0.0.0:3000/",
        },
      });

      setSocketInstance(socket);

      socket.on("connect", (data) => {
        console.log(data);
      });

      setLoading(false);

      socket.on("disconnect", (data) => {
        console.log(data);
      });

      return function cleanup() {
        socket.disconnect();
      };
    }
  }, [buttonStatus]);

  return (
        <div>
            <div className="line">
              <HttpCall />
              <h1>Functions</h1>
              {!buttonStatus ? (
                <button onClick={handleClick}>Turn Chat On</button>
              ) : (
                <>
                  <button onClick={handleClick}>Turn Chat Off</button>
                </>
              )}
            </div>

            <div className={`form-container ${buttonStatus ? "" : "hidden"}`}>
                {!loading && <WebSocketCall
                    socket={socketInstance}
                />}
            </div>

      </div>


  );
}

export default App;