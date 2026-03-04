import { Outlet } from "react-router-dom"

const Layout = () => {
    return (
        <main className="App min-h-screen bg-[#0f172a]">
            <Outlet />
        </main>
    )
}

export default Layout
