import { Link } from "react-router"
import { useEffect, useState } from "react"

const Parties = () =>{
    
    const [parties, setParties] = useState([]);

    const [characters, setCharacters] = useState([])

    useEffect(()=>{
        fetch("http://localhost:3000/parties", {
            method: 'GET'
        })
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            const rawParties = data.data;
            setParties(rawParties)
        })
        .catch((error) => console.error(error.message))

        fetch("http://localhost:3000/characters", {
            method: 'GET'
        })
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            const rawCharacters = data.data;
            setCharacters(rawCharacters)
        })
        .catch((error) => console.error(error.message))
    }, [])


    return (
        <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-md mt-8">
            <div className="max-w-4xl mx-auto mt-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Les équipes</h1>
                    <Link to="create"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                    Ajouter une équipe
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    { parties?.length > 0 && parties.map((party) => party && (
                    <div 
                    key={`party-${party.id}`}
                    className={`bg-white p-4 rounded-lg shadow-md`}
                    >
                    <div className="flex justify-between items-center">
                        <div className="flex-1">
                        <p
                            className={`text-lg font-semibold text-gray-900 `}
                        >
                            {party.partyname}
                        </p>
                        <p
                            className={`text-gray-600 mt-1`}
                        >
                            {characters.find((character) => character.name == party.members.split(',')[0])?.name} : {characters.find((character) => character.name == party.members.split(',')[0])?.role}
                        </p>
                        <p
                            className={`text-gray-600 mt-1`}
                        >
                            {characters.find((character) => character.name == party.members.split(',')[1])?.name} : {characters.find((character) => character.name == party.members.split(',')[1])?.role}
                        </p>
                        <p
                            className={`text-gray-600 mt-1`}
                        >
                            {characters.find((character) => character.name == party.members.split(',')[2])?.name} : {characters.find((character) => character.name == party.members.split(',')[2])?.role}
                        </p>
                        <p
                            className={`text-gray-600 mt-1`}
                        >
                            {characters.find((character) => character.name == party.members.split(',')[3])?.name} : {characters.find((character) => character.name == party.members.split(',')[3])?.role}
                        </p>
                        <p
                            className={`text-gray-600 mt-1`}
                        >
                            {characters.find((character) => character.name == party.members.split(',')[4])?.name} : {characters.find((character) => character.name == party.members.split(',')[4])?.role}
                        </p>
                        </div>
                        <div className="flex items-center gap-4">
                            
                        <Link
                            id={`modify_party_button-${party.id}`}
                            to={`update/${party.id}`}
                            className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
                        >
                            Modifier
                        </Link>
                        </div>
                    </div>
                    </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Parties