import { Link, Outlet, useNavigate } from "react-router"


const Layout = () => {

    return (
        <>
            <header className="bg-white shadow">
                <nav className="container mx-auto px-4 py-3">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <Link to="/" className="text-xl font-bold text-gray-800">Wow-Tang Clan Tournois</Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link to="/parties" className="text-gray-600 hover:text-gray-900">
                                Les équipes
                            </Link>
                            <Link to="/characters" className="text-gray-600 hover:text-gray-900 ">
                                Les personnages
                            </Link>
                        </div>      
                    </div>
                </nav>
            </header>
            
            <Outlet />
        </>
    )
}

export default Layout