import { useNavigate, useParams } from "react-router"
import { useEffect, useState } from "react"

const UpdateCharacter = () =>{

    const params = useParams()

    const navigate = useNavigate()

    const [roles, setRoles] = useState([])

    const [classes, setClasses] = useState([])

    const [error, setError] = useState({errorStatus: false, errorMessage: ""})

    const [formData, setFormData] = useState({
        name: '',
        class: null,
        role: null,
        ilvl: null,
        rio: null
    })

    useEffect(()=>{
        fetch("http://localhost:3000/roles", {
            method: 'GET'
        })
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            const rawRoles = data.data;
            setRoles(rawRoles)
        })
        .catch((error) => console.error(error.message))

        fetch("http://localhost:3000/classes", {
            method: 'GET'
        })
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            const rawClasses = data.data;
            setClasses(rawClasses)
        })
        .catch((error) => console.error(error.message))

        fetch(`http://localhost:3000/characters/${params.characterId}`, {
            method: 'GET'
        })
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            const rawCharacter = data.data;
            setFormData(() => ({
                name: rawCharacter.name,
                class: rawCharacter.classid,
                role: rawCharacter.roleid,
                ilvl: rawCharacter.ilvl,
                rio: rawCharacter.rio
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

    const handleClassInput = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]:value
        }))
        handleRoleUpdate(classes.find((element) => element.id == value));
    }

    const handleRoleUpdate = (c) => {
        let rolesSelect = document.getElementById('role');
        let roles = c.roles.split(',')
        for (const option of rolesSelect.children){
            if(!roles.includes(option.innerText)){
                option.setAttribute('disabled', '')
                if(rolesSelect.value == option.value){
                    rolesSelect.value = null;
                }
            }else{
                option.removeAttribute('disabled')
            }
        }
    }

    const handleDeleteCharacter = async () =>{
        await fetch(`http://localhost:3000/characters/delete/${params.characterId}`, {
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
            navigate('/characters');
            return;
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(e.nativeEvent.submitter.id == 'deleteCharacter'){
            if(confirm("Voulez-vous vraiment supprimer ce personnage ?")){
                return handleDeleteCharacter()
            }
        }
        // vérifie le format du nom du personnage
        if(formData.name.length < 3 || formData.name.length > 64 || !/[a-zA-Z1-9]{3,64}/.test(formData.name))return null;
        // vérifie que l'id de class existe
        if(!Array.from(classes, (c) => c.id).includes(Number(formData.class))) return null;
        // vérifie que l'id du role existe
        if(!Array.from(roles, (r) => r.id).includes(Number(formData.role))) return null;
        // récupère les roles compatibles avec la classe
        const roles_class = classes.find((element) => element.id == formData.class).roles.split(',');
        // récupère le role choisi pour le personnage
        const role = roles.find((element) => element.id == formData.role);
        // vérifie que le role choisi corresponde bien avec la classe.
        if(!roles_class.includes(role.label)) return null;

        fetch(`http://localhost:3000/characters/update/${params.characterId}`, {
            method: "POST",
            body: JSON.stringify({
                name: formData.name,
                classId: formData.class,
                roleId: formData.role,
                ilvl: formData.ilvl,
                rio: formData.rio
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
            navigate('/characters');
            return;
        })

    }


    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-8">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">Modification de personnage</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        *Nom du personnage (3-64 caractères, lettres et chiffres uniquement)
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        onChange={handleChangeInput}
                        required
                        pattern="[a-zA-Z1-9]{3,64}"
                        value={formData.name}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="class" className="block text-sm font-medium text-gray-700">
                        *Classe du personnage
                    </label>
                    <select id={`class`} name="class" onChange={handleClassInput} value={formData.class}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option>Choisissez la classe de votre personnage</option>
                        {classes?.length > 0 && classes.map((c, index) => c && (
                            <option key={`class-${index}`} value={c.id}>{c.label.fr}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                        *Rôle du personnage
                    </label>
                    <select id={`role`} name="role" onChange={handleChangeInput} value={formData.role}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option value="null">Choisissez le rôle de votre personnage</option>
                        {roles?.length > 0 && roles.map((role, index) => role && (
                            <option key={`role-${index}`} value={role.id}>{role.label}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="ilvl" className="block text-sm font-medium text-gray-700">
                        ilvl du personnage (0-645)
                    </label>
                    <input
                        type="number"
                        id="ilvl"
                        name="ilvl"
                        onChange={handleChangeInput}
                        value={formData.ilvl}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min={0}
                        max={645}
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="rio" className="block text-sm font-medium text-gray-700">
                        Rio du personnage (0-4500)
                    </label>
                    <input
                        type="number"
                        id="rio"
                        name="rio"
                        onChange={handleChangeInput}
                        value={formData.rio}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min={0}
                        max={4500}
                    />
                </div>
                    
                <div className="flex gap-x-3">
                    <input
                    type="submit"
                    id="deleteCharacter"
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    value={"Supprimer"}
                    />
                    <input
                    type="submit"
                    id="updateCharacter"
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    value={'Modifier'}/>
                </div>
            </form>
            { error.errorStatus && <p className="mt-4 text-center text-red-600">{error.errorMessage}</p> }
        </div>
    )
}

export default UpdateCharacter