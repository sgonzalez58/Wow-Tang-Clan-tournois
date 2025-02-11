import { useNavigate } from "react-router"
import { useEffect, useState } from "react"

const CreateParty = () =>{

    const navigate = useNavigate()

    const [characters, setCharacters] = useState([])

    const [error, setError] = useState({errorStatus: false, errorMessage: ""})

    const [formData, setFormData] = useState({
        partyName: '',
        tankMember: null,
        healerMember: null,
        damageMember1: null,
        damageMember2: null,
        damageMember3: null
    })

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

    const handleChangeInput = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]:value
        }))
    }

    const handleDamageDealerInput = (e) =>{
        handleChangeInput(e);
        const damageSelect1 = document.getElementById('damageMember1');
        const damageSelect2 = document.getElementById('damageMember2');
        const damageSelect3 = document.getElementById('damageMember3');

        if(e.target.id == 'damageMember1'){
            for (const option of damageSelect2.children){
                if(option.value == e.target.value || option.value == formData.damageMember3){
                    option.setAttribute('disabled', '')
                }else{
                    option.removeAttribute('disabled')
                }
            }
            for (const option of damageSelect3.children){
                if(option.value == e.target.value || option.value == formData.damageMember2){
                    option.setAttribute('disabled', '')
                }else{
                    option.removeAttribute('disabled')
                }
            }
        }
        if(e.target.id == 'damageMember2'){
            for (const option of damageSelect1.children){
                if(option.value == e.target.value || option.value == formData.damageMember3){
                    option.setAttribute('disabled', '')
                }else{
                    option.removeAttribute('disabled')
                }
            }
            for (const option of damageSelect3.children){
                if(option.value == e.target.value || option.value == formData.damageMember1){
                    option.setAttribute('disabled', '')
                }else{
                    option.removeAttribute('disabled')
                }
            }
        }
        
        if(e.target.id == 'damageMember3'){
            for (const option of damageSelect1.children){
                if(option.value == e.target.value || option.value == formData.damageMember2){
                    option.setAttribute('disabled', '')
                }else{
                    option.removeAttribute('disabled')
                }
            }
            for (const option of damageSelect2.children){
                if(option.value == e.target.value || option.value == formData.damageMember1){
                    option.setAttribute('disabled', '')
                }else{
                    option.removeAttribute('disabled')
                }
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // vérifie le format du nom du personnage
        if(formData.partyName.length < 3 || formData.partyName.length > 64 || !/([a-zA-Z1-9]+\s?[a-zA-Z1-9]+){0,64}/.test(formData.partyName))return null;
        // vérifie que l'id du tank existe
        if(!Array.from(characters, (c) => c.id).includes(Number(formData.tankMember))) return null;
        // vérifie que l'id du healer existe
        if(!Array.from(characters, (c) => c.id).includes(Number(formData.healerMember))) return null;
        // vérifie que l'id du premier damage dealer existe
        if(!Array.from(characters, (c) => c.id).includes(Number(formData.damageMember1))) return null;
        // vérifie que l'id du second damage dealer existe
        if(!Array.from(characters, (c) => c.id).includes(Number(formData.damageMember2))) return null;
        // vérifie que l'id du troisième damage dealer existe
        if(!Array.from(characters, (c) => c.id).includes(Number(formData.damageMember3))) return null;

        fetch("http://localhost:3000/parties", {
            method: "POST",
            body: JSON.stringify({
                partyName: formData.partyName,
                tankMember: formData.tankMember,
                healerMember: formData.healerMember,
                damageMember1: formData.damageMember1,
                damageMember2: formData.damageMember2,
                damageMember3: formData.damageMember3
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
            navigate('/parties');
            return;
        })

    }


    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-8">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">Création d'équipe</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label htmlFor="partyName" className="block text-sm font-medium text-gray-700">
                        *Nom de l'équipe (3-64 caractères, lettres, chiffres et espaces uniquement)
                    </label>
                    <input
                        type="text"
                        id="partyName"
                        name="partyName"
                        onChange={handleChangeInput}
                        required
                        pattern="([a-zA-Z1-9]+\s?[a-zA-Z1-9]+){0,64}"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="tankMember" className="block text-sm font-medium text-gray-700">
                        *Tank de l'équipe
                    </label>
                    <select id={`tankMember`} name="tankMember" onChange={handleChangeInput}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option>Choisissez le tank de votre équipe</option>
                        {characters?.filter((character) => character.role === 'tank').length > 0 && characters?.filter((character) => character.role === 'tank').map((c, index) => c && (
                            <option key={`character-${index}`} value={c.id} disabled={c.partyid ? true : false}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="healerMember" className="block text-sm font-medium text-gray-700">
                        *Healer de l'équipe
                    </label>
                    <select id={`healerMember`} name="healerMember" onChange={handleChangeInput}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option>Choisissez le healer de votre équipe</option>
                        {characters?.filter((character) => character.role === 'healer').length > 0 && characters?.filter((character) => character.role === 'healer').map((c, index) => c && (
                            <option key={`character-${index}`} value={c.id} disabled={c.partyid ? true : false}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="damageMember1" className="block text-sm font-medium text-gray-700">
                        *Damage dealer de l'équipe
                    </label>
                    <select id={`damageMember1`} name="damageMember1" onChange={handleDamageDealerInput}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option>Choisissez le premier damage dealer de votre équipe</option>
                        {characters?.filter((character) => character.role === 'damage').length > 0 && characters?.filter((character) => character.role === 'damage').map((c, index) => c && (
                            <option key={`character-${index}`} value={c.id} disabled={c.partyid ? true : false}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="damageMember2" className="block text-sm font-medium text-gray-700">
                        *Damage dealer de l'équipe
                    </label>
                    <select id={`damageMember2`} name="damageMember2" onChange={handleDamageDealerInput}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option>Choisissez le second damage dealer de votre équipe</option>
                        {characters?.filter((character) => character.role === 'damage').length > 0 && characters?.filter((character) => character.role === 'damage').map((c, index) => c && (
                            <option key={`character-${index}`} value={c.id} disabled={c.partyid ? true : false}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="damageMember3" className="block text-sm font-medium text-gray-700">
                        *Damage dealer de l'équipe
                    </label>
                    <select id={`damageMember3`} name="damageMember3" onChange={handleDamageDealerInput}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option>Choisissez le troisième damage dealer de votre équipe</option>
                        {characters?.filter((character) => character.role === 'damage').length > 0 && characters?.filter((character) => character.role === 'damage').map((c, index) => c && (
                            <option key={`character-${index}`} value={c.id} disabled={c.partyid ? true : false}>{c.name}</option>
                        ))}
                    </select>
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

export default CreateParty