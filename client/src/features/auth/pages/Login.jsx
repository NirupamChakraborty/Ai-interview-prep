import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../../../styles/button.css";
import "../auth.styles.css";
import { useAuth } from '../hooks/useAuth';
const Login = () => {


    const { handleLogin, loading  } = useAuth();

    // 2way binding for form inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        handleLogin({email, password}) // call handleLogin function from useAuth hook and pass email and password as arguments
        navigate("/")
    }

    if(loading){
        return (<main><h1>Loading.......</h1></main>)
    }
  return (
    <main>
        <div className="form-container">
            <h1>Login</h1>

            <form onSubmit={handleSubmit}> 
                {/* //input has email and password */}
                <div className="input-group">
                    <label htmlFor="email">Email</label> 
                    <input onChange={(e)=>{setEmail(e.target.value)}} type="email" id='email' name='email' placeholder='Enter your email address' required />
                </div>

                <div className="input-group">
                    <label htmlFor="password">Password</label> 
                    <input onChange={(e)=>{setPassword(e.target.value)}} type="password" id='password' name='password' placeholder='Enter your password' required />
                </div>

                <button className='button primary-button btn'  >Login</button>
            </form>
            <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
    </main>
  )
}

export default Login