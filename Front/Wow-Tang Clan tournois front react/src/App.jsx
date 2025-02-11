import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import Layout from './components/Layout/Layout'
import Home from './components/Home/Home'
import Characters from './components/Characters/Characters'
import CreateCharacter from './components/Characters/Create'
import UpdateCharacter from './components/Characters/Update'
import Parties from './components/Parties/Parties'
import CreateParty from './components/Parties/Create'
import UpdateParty from './components/Parties/Update'


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout/>}>
            <Route index element={<Home />}/>
            <Route path="characters">
              <Route index element={<Characters/>}/>
              <Route path="create" element={<CreateCharacter/>}/>
              <Route path="update/:characterId" element={<UpdateCharacter/>}/>
            </Route>
            <Route path="parties">
              <Route index element={<Parties/>}/>
              <Route path="create" element={<CreateParty/>}/>
              <Route path="update/:partyId" element={<UpdateParty/>}/>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
