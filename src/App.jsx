
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login/login.';
import Signup from './pages/signup/signup';
import Forget from './pages/forget/forget';
import Main from './pages/main/main';
import Home from './pages/home/home';
import Code from './pages/code/code';
import PrivateRoute from './config/PrivateRoute';
import "./index.css"
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/forget' element={<Forget/>}/>
        <Route path='/main' element={<Main/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/code' element={<Code/>}/>
      </Routes>
    </Router>
  );
}

export default App;