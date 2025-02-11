import { Link } from "react-router"

const Home = () =>{

    return (
        <div className="max-w-4xl mx-auto text-center">
            <div className="py-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Bienvenue sur le Wow-Tang Clan Tournois</h1>
                <p className="text-xl text-gray-600 mb-8">
                    Venez participez à nos tournois WoW !
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="text-2xl mb-4">📝</div>
                    <p className="text-lg font-semibold text-gray-900 mb-2">Créez une équipe</p>
                    <p className="text-gray-600">
                        Créez facilement vos équipes!
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="text-2xl mb-4">✅</div>
                        <p className="text-lg font-semibold text-gray-900 mb-2">
                        Ajouter votre personnage
                    </p>
                    <p className="text-gray-600">
                        Pour participer au tournois, vous devez créer et renseigner quelques informations sur votre personnage!
                    </p>
                </div>
            </div>
            <div className="bg-blue-50 p-8 rounded-lg shadow-md mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Prêt à commencer ?</h2>
                <div className="space-x-4">
                    <Link to="/parties" className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700">
                        Voir les équipes
                    </Link>
                    <Link to="/characters" className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700">
                        Voir les personnages
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Home