import { Outlet } from "react-router-dom"
import NotificationBar from "../components/NotificationBar"

const Layout = () => {
    return (
        <main className="App min-h-screen bg-[#0f172a]">
            <NotificationBar />
            <Outlet />
        </main>
    )
}

export default Layout
