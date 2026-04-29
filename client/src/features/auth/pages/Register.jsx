import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../../../styles/button.css";
import "../auth.styles.css";
import { useAuth } from '../hooks/useAuth';

const Register = () => {

  const { handleRegister, loading  } = useAuth();  
      // 2way binding for form inputs
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [username, setUsername] = useState('');
      const navigate = useNavigate();
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission logic here
        try {
         await handleRegister({username, email, password}) // call handleRegister function from useAuth hook and pass username, email and password as arguments
        navigate("/")
        } catch (error) {
          console.log(error)
          // const message =
          // error?.response?.data?.message || "Registration not done";

          // throw new Error(message);
        }
        
    }

    if(loading){
        return (<main><h1>Loading.......</h1></main>)
    }
  return (
    <main>
        <div className="form-container">
            <h1>Register</h1>

            <form onSubmit={handleSubmit}> 
                {/* //input has email and password */}

                <div className="input-group">
                    <label htmlFor="username">Username</label> 
                    <input onChange={(e)=>{setUsername(e.target.value)}} type="text" id='username' name='username' placeholder='Enter your username' required />
                </div>

                <div className="input-group">
                    <label htmlFor="email">Email</label> 
                    <input onChange={(e)=>{setEmail(e.target.value)}} type="email" id='email' name='email' placeholder='Enter your email address' required />
                </div>

                <div className="input-group">
                    <label htmlFor="password">Password</label> 
                    <input onChange={(e)=>{setPassword(e.target.value)}} type="password" id='password' name='password' placeholder='Enter your password' required />
                </div>

                <button className='button primary-button btn'  >Register</button>
            </form>
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
    </main>
  )
}

export default Register