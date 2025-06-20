import './Global.css'
import { StateProvider } from './Context API/StateContext'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Signup from './pages/Signup'
import Login from './pages/Login'
import LandingPage from './pages/LandingPage'
import ErrorRoute from './pages/ErrorRoute'
import Home from './pages/Home'
import StudentSubmission from './pages/StudentSubmission'
import Results from './Components/Results'
import TestQuestions from './Components/TestQuestions'

function App() {
  return <StateProvider>
    <BrowserRouter>
        <Routes>
            <Route path='/' element = {<LandingPage/>}/>
            <Route path='/signup' element = {<Signup/>}/>
            <Route path='/signin' element = {<Login/>}/>
            <Route path='/home' element = {<Home/>}/>
            <Route path='/test/:testId' element = {<TestQuestions/>}/>
            <Route path='/share/:shareId' element = {<StudentSubmission/>}/>
            <Route path='/result' element = {<Results/>}/>
            <Route path='*' element = {<ErrorRoute/>}/>
        </Routes>
    </BrowserRouter>
  </StateProvider>
}

export default App