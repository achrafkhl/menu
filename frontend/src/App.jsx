
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login/login.';
import Signup from './pages/signup/signup';
import Forget from './pages/forget/forget';
import Main from './pages/main/main';
import Home from './pages/home/home';
import Code from './pages/code/code';
import Reset from './pages/reset/reset';
import PrivateRoute from './config/PrivateRoute';
import "./index.css"
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/forget' element={<Forget/>}/>
        <Route path='/' element={<Home/>}/>
        <Route path='/code/:slug' element={<Code/>}/>
        <Route path='/reset' element={<Reset/>}/>
        
        <Route path='/main' element={<PrivateRoute><Main/></PrivateRoute>}/>
        <Route path='*' element={<h1>404 Not Found</h1>} />
        <Route path="/verified" element={<h1>Email Verified ✅</h1>} />
        <Route path="/verify-failed" element={<h1>Verification Failed ❌</h1>} />

      </Routes>
    </Router>
  );
}

export default App;