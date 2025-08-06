import React from "react";
import "./App.css";
import IpodClassic from "./iPodClassic";

// PUBLIC_INTERFACE
function App() {
  // Remove theme switch for iPod demo (design is fixed-light for iPod)
  return (
    <div className="App" style={{ minHeight: "100vh", background: "#f0f1f6" }}>
      <IpodClassic />
    </div>
  );
}

export default App;
