import { useNavigate, useParams } from "react-router"
import { useEffect, useState } from "react"

const UpdateTournament = () =>{

    const params = useParams()

    const navigate = useNavigate()

    const [error, setError] = useState({errorStatus: false, errorMessage: ""})

    const [formData, setFormData] = useState({
        name: '',
        startDate: null,
        endDate: null,
        price: null,
        description: null
    })

    useEffect(()=>{
        
        fetch(`http://localhost:3000/tournaments/${params.tournamentId}`, {
            method: 'GET'
        })
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            const rawTournament = data.data;
            setFormData(() => ({
                name: rawTournament.name,
                startDate: rawTournament.startdate.split('T')[0],
                endDate: rawTournament.enddate.split('T')[0],
                price: rawTournament.price,
                description: rawTournament.description
            }))
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

    const handleDeleteTournament = async () =>{
        await fetch(`http://localhost:3000/tournaments/delete/${params.tournamentId}`, {
            method: "GET"
        })
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            if(data.err){
                setError({errorStatus: true, errorMessage: data.err})
                return;
            }
            navigate('/tournaments');
            return;
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(e.nativeEvent.submitter.id == 'deleteTournament'){
            if(confirm("Voulez-vous vraiment annuler ce tournois ?")){
                return handleDeleteTournament()
            }
        }

        // vérifie le format du nom du personnage
        if(formData.name.length < 3 || formData.name.length > 64 || !/[ a-zA-Z1-9]{0,64}/.test(formData.name.trim()))return null;
        // vérifie que la date de départ est renseignée
        if(formData.startDate == null) return null;
        // vérifie que la date de fin est renseignée
        if(formData.endDate == null) return null;
        // vérifie que le prix existe
        if(isNaN(formData.price)) return null;
        // vérifie la description existe
        if(formData.description.trim().length == 0) return null;

        fetch(`http://localhost:3000/tournaments/update/${params.tournamentId}`, {
            method: "POST",
            body: JSON.stringify({
                name: formData.name,
                startDate: formData.startDate,
                endDate: formData.endDate,
                price: formData.price,
                description: formData.description,
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
            navigate('/tournaments');
            return;
        })

    }


    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-8">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">Modification de tournois</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        *Nom du tournois (3-64 caractères, lettres, chiffres et espaces uniquement)
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        onChange={handleChangeInput}
                        required
                        value={formData.name}
                        pattern="[ a-zA-Z1-9]{0,64}"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                        *Date de départ
                    </label>
                    <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        onChange={handleChangeInput}
                        required
                        value={formData.startDate}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                        *Date de fin
                    </label>
                    <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        onChange={handleChangeInput}
                        required
                        value={formData.endDate}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                        *Montant du droit de participation
                    </label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        onChange={handleChangeInput}
                        required
                        value={formData.price}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        *Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        onChange={handleChangeInput}
                        required
                        value={formData.description}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="flex gap-x-3">
                    <input
                    type="submit"
                    id="deleteTournament"
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    value={"Supprimer"}
                    />
                    <input
                    type="submit"
                    id="updateTournament"
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    value={'Modifier'}/>
                </div>
            </form>
            { error.errorStatus && <p className="mt-4 text-center text-red-600">{error.errorMessage}</p> }
        </div>
    )
}

export default UpdateTournament