import { Link, useNavigate, useParams } from "react-router"
import { useEffect, useState } from "react"

const ParticipateTournament = () =>{

    const params = useParams()

    const navigate = useNavigate()

    const [dungeons, setDungeons] = useState([])

    const [parties, setParties] = useState([])

    const [partiesTournament, setPartiesTournament] = useState([])

    const [tournament, setTournament] = useState(null)

    const [error, setError] = useState({errorStatus: false, errorMessage: ""})

    const [formData, setFormData] = useState({
        party: 0,
        dungeon: 0,
        timer: '00:00:00'
    })

    useEffect(()=>{
        // récupération des équipes
        fetch(`http://localhost:3000/parties`, {
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

        // récupération des informations du tournois
        fetch(`http://localhost:3000/tournaments/${params.tournamentId}`, {
            method: 'GET'
        })
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            const rawTournament = data.data;
            setTournament(rawTournament);
        })
        .catch((error) => console.error(error.message))

        // récupération des équipes déjà inscrites au tournois
        fetch(`http://localhost:3000/tournaments/${params.tournamentId}/parties`, {
            method: 'GET'
        })
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            const rawPartiesTournament = data.data;
            setPartiesTournament(rawPartiesTournament);
        })
        .catch((error) => console.error(error.message))


    }, [])

    const handleChangeInput = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]:value
        }))
    }

    const handlePartyRegister = async (e) =>{
        const {value} = e.target
        fetch(`http://localhost:3000/tournaments/register/${params.tournamentId}`, {
            method: "POST",
            body: JSON.stringify({
                party: value
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            if(data.err){
                setError({errorStatus: true, errorMessage: data.err})
                return;
            }
            const res = data.party;
            setPartiesTournament(prev => [
                ...prev,
                parties.find((p) => p.id == res.id)
            ])
        })
        .catch((error) => console.error(error.message))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // vérifie la party existe
        if(parties.find((party) => party.id == formData.party) === undefined)return null;
        // vérifie le donjon existe
        if(dungeons.find((dungeon) => dungeon.id == formData.dungeon) === undefined)return null;
        // vérifie que le temps est renseignée
        if(formData.timer == null) return null;

        fetch(`http://localhost:3000/tournaments/${params.tournamentId}/records/add`, {
            method: "POST",
            body: JSON.stringify({
                party: formData.party,
                dungeon: formData.dungeon,
                timer: formData.timer
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            if(data.err){
                setError({errorStatus: true, errorMessage: data.err})
                return;
            }
            setFormData({party: 0, dungeon: 0, timer: '00:00:00'})
            return;
        })
    }

    console.log(formData)


    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-8">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">Participer au tournois</h1>
            { tournament && (
                <div class="flex flex-col items-start">
                    <p
                        className={`text-lg font-semibold text-gray-900`}
                    >
                        {tournament.name}
                    </p>
                    <p
                        className={`text-gray-600 mt-1`}
                    >
                        Date de départ : {new Date(tournament.startdate.split('T')[0]).toLocaleDateString()}
                    </p>
                    <p
                        className={`text-gray-600 mt-1 `}
                    >
                        Date de fin : {new Date(tournament.enddate.split('T')[0]).toLocaleDateString()}
                    </p>
                    <p
                        className={`text-gray-600 mt-1`}
                    >
                        Prix : {tournament.price} pièces d'or
                    </p>
                    <p
                        className={`text-gray-600 mt-1`}
                    >
                        Description : {tournament.description}
                    </p>
                    <Link
                        id={`records_tournament_button-${tournament.id}`}
                        to={`records`}
                        className="px-3 py-1.5 mt-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex"
                    >
                        Voir le classement
                    </Link>
                </div>
            )}

            <h2 className="text-xl font-bold text-gray-800 mt-8 mb-2">Ajouter une équipe</h2>

            <div className="space-y-2">
                <label htmlFor="registerParty" className="block text-sm font-medium text-gray-700">
                    Enregistrer une équipe au tournois
                </label>
                <select id={`registerParty`} name="registerParty" onChange={handlePartyRegister}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option>Choisissez une équipe à enregistrer</option>
                    {parties?.filter((party) => !(Array.from(partiesTournament, ((pt) => pt.id)).includes(party.id))).length > 0 && parties?.filter((party) => !(Array.from(partiesTournament, ((pt) => pt.id)).includes(party.id))).map((p, index) => p && (
                        <option key={`party-${index}`} value={p.id} >{p.partyname}</option>
                    ))}
                </select>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mt-8 mb-2">Ajouter un temps</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label htmlFor="party" className="block text-sm font-medium text-gray-700">
                        *Choisir l'équipe
                    </label>
                    <select id={`party`} name="party" onChange={handleChangeInput} value={formData.party}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option value='0'>Choisissez une équipe</option>
                        {partiesTournament.length > 0 && partiesTournament.map((p, index) => p && (
                            <option key={`party-${index}`} value={p.id} >{p.partyname}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="dungeon" className="block text-sm font-medium text-gray-700">
                        *Choisir le donjon
                    </label>
                    <select id={`dungeon`} name="dungeon" onChange={handleChangeInput} value={formData.dungeon}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option value='0'>Choisissez un donjon</option>
                        {dungeons.length > 0 && dungeons.map((d, index) => d && (
                            <option key={`party-${index}`} value={d.id} >{d.name}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="timer" className="block text-sm font-medium text-gray-700">
                        *Temps de réalisation
                    </label>
                    <input
                        type="time"
                        id="timer"
                        name="timer"
                        step="1"
                        onChange={handleChangeInput}
                        required
                        value={formData.timer}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <input
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                value={"Ajouter"}
                />
            </form>
            { error.errorStatus && <p className="mt-4 text-center text-red-600">{error.errorMessage}</p> }
        </div>
    )
}

export default ParticipateTournament