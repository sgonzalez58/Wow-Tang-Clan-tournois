import { Link } from "react-router"
import { useEffect, useState } from "react"

const Tournaments = () =>{
    
    const [tournaments, setTournaments] = useState([]);

    useEffect(()=>{
        fetch("http://localhost:3000/tournaments", {
            method: 'GET'
        })
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            const rawTournaments = data.data;
            setTournaments(rawTournaments)
        })
        .catch((error) => console.error(error.message))
    }, [])


    return (
        <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-md mt-8">
            <div className="max-w-4xl mx-auto mt-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Les Tournois</h1>
                    <Link to="create"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                    Créer un tournois
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    { tournaments?.length > 0 && tournaments.map((tournament) => tournament && (
                    <div 
                    key={`party-${tournament.id}`}
                    className={`bg-white p-4 rounded-lg shadow-md`}
                    >
                    <div className="flex flex-col justify-between items-center gap-6">
                        <div className="flex-1">
                            <p
                                className={`text-lg font-semibold text-gray-900 ${tournament.canceled ? 'line-through' : ''} `}
                            >
                                {tournament.name}
                            </p>
                            <p
                                className={`text-gray-600 mt-1 ${tournament.canceled ? 'line-through' : ''} `}
                            >
                                Date de départ : {new Date(tournament.startdate.split('T')[0]).toLocaleDateString()}
                            </p>
                            <p
                                className={`text-gray-600 mt-1 ${tournament.canceled ? 'line-through' : ''} `}
                            >
                                Date de fin : {new Date(tournament.enddate.split('T')[0]).toLocaleDateString()}
                            </p>
                            <p
                                className={`text-gray-600 mt-1 ${tournament.canceled ? 'line-through' : ''} `}
                            >
                                Prix : {tournament.price} pièces d'or
                            </p>
                            <p
                                className={`text-gray-600 mt-1 ${tournament.canceled ? 'line-through' : ''} `}
                            >
                                Description : {tournament.description}
                            </p>
                        </div>
                        {new Date(tournament.enddate.split('T')[0]) > new Date && (
                        <div className="flex items-center gap-4">
                            
                                <Link
                                id={`modify_tournament_button-${tournament.id}`}
                                to={`update/${tournament.id}`}
                                className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
                            >
                                Modifier
                            </Link>
                            <Link
                                id={`participate_tournament_button-${tournament.id}`}
                                to={`${tournament.id}`}
                                className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
                            >
                                Participer
                            </Link>
                        </div>
                        )}
                    </div>
                    </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Tournaments