import { Link } from "react-router"
import { useEffect, useState } from "react"

const Characters = () =>{
    
    const [characters, setCharacters] = useState([]);

    useEffect(()=>{
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
                    <h1 className="text-2xl font-bold text-gray-900">Les personnages</h1>
                    <Link to="create"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                    Ajouter un personnage
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    { characters?.length > 0 && characters.map((character) => character && (
                    <div 
                    key={`character-${character.id}`}
                    className={`bg-white p-4 rounded-lg shadow-md`}
                    >
                    <div className="flex justify-between items-center">
                        <div className="flex-1">
                        <p
                            className={`text-lg font-semibold text-gray-900 `}
                        >
                            {character.name}
                        </p>
                        <p
                            className={`text-gray-600 mt-1`}
                        >
                            {character.class.fr}
                        </p>
                        <p
                            className={`text-gray-600 mt-1`}
                        >
                            {character.role}
                        </p>
                        {character.ilvl && (<p
                            className={`text-gray-600 mt-1`}
                        >
                            ilvl:{character.ilvl}
                        </p>)}
                        {character.rio && (<p
                            className={`text-gray-600 mt-1`}
                        >
                            rio:{character.rio}
                        </p>)}
                        </div>
                        <div className="flex items-center gap-4">
                            
                        <Link
                            id={`modify_character_button-${character.id}`}
                            to={`update/${character.id}`}
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

export default Characters