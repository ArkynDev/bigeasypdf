import { Outlet } from "react-router-dom";
import { NavBar } from "./components/navbar/NavBar";

function App() {

  return (
    <div className="flex flex-col h-screen w-screen">
      <NavBar />
      <Outlet />
    </div>
  )
}

export default App
