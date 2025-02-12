import { Link, useParams } from "react-router"
import { useEffect, useState } from "react"

const TournamentRecords = () =>{

    const params = useParams();
    
    const [records, setRecords] = useState([]);

    const [dungeons, setDungeons] = useState([]);

    useEffect(()=>{
        fetch(`http://localhost:3000/tournaments/${params.tournamentId}/records`, {
            method: 'GET'
        })
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            const rawRecords = data.data;
            setRecords(rawRecords)
        })
        .catch((error) => console.error(error.message))

        // récupération des donjons
        fetch(`http://localhost:3000/dungeons`, {
            method: 'GET'
        })
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            const rawDungeons = data.data;
            setDungeons(rawDungeons)
        })
        .catch((error) => console.error(error.message))
    }, [])

    return (
        <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-md mt-8">
            <div className="max-w-4xl mx-auto mt-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Classement du tournois : {records.length > 0 ? records[0].name : ''}</h1>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    {dungeons?.length > 0 && dungeons?.map((d) => d && (
                        <>
                            <h2 className="text-xl font-bold text-gray-900">{d.name}</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                { records.filter((record) => record.dungeonid == d.id)?.length > 0 && records.filter((record) => record.dungeonid == d.id)?.map((r, index) => r && (
                                <div 
                                key={`record-${index}`}
                                className={`bg-white p-4 rounded-lg shadow-md`}
                                >
                                <div className="flex justify-between items-center gap-6">
                                    <div className="flex-1">
                                        <p
                                            className={`text-lg font-semibold text-gray-900`}
                                        >
                                            {r.dungeonname}
                                        </p>
                                        <p
                                            className={`text-gray-600 mt-1`}
                                        >
                                            {r.partyname}
                                        </p>
                                        <p
                                            className={`text-gray-600 mt-1`}
                                        >
                                            {r.timer}
                                        </p>
                                    </div>
                                </div>
                                </div>
                                ))}
                            </div>
                        </>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TournamentRecords