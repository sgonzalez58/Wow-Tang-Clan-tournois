import { useNavigate } from "react-router"
import { useEffect, useState } from "react"

const CreateTournament = () =>{

    const navigate = useNavigate()


    const [error, setError] = useState({errorStatus: false, errorMessage: ""})

    const [formData, setFormData] = useState({
        name: '',
        startDate: null,
        endDate: null,
        price: null,
        description: null
    })

    const handleChangeInput = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]:value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

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

        fetch("http://localhost:3000/tournaments", {
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
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">Création de tournois</h1>

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

export default CreateTournament