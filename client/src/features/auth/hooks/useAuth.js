// import { useContext, useEffect } from "react";
// import { AuthContext } from "../auth.context";
// import { getMe, login, logout, register } from "../services/auth.api.js";


// export const useAuth = () => {
//     const context = useContext(AuthContext)
//     const { user, setUser, loading, setLoading } = context

//     const handleLogin = async ({email, password}) => {
//         setLoading(true)
//         try {
//         const data = await login({email, password}) //login function is imported from auth.api.js and it will return user data in response if login is successful
//         setUser(data.user) // set user data to context because in login controller we are sending user data in response 
        
//         } catch (error) {
//             console.log(error)
            
//         }finally{
//         setLoading(false)
//         }
//     }

//     const handleRegister = async ({username, email, password}) => {
//         setLoading(true)
//         try{
//         const data = await register({username, email, password}) //register function is imported from auth.api.js and it will return user data in response if registration is successful
        
//          if (!data || !data.user) {
//         console.log("Invalid response from server");
//       }
//         setUser(data.user) // set user data to context because in register controller we are sending user data in response 
//       } catch (error) {
//         console.log(error) 
//         throw error;  
//         }finally{
//             setLoading(false)
//         }
        

//     }

//     const handleLogout = async () => {
//         setLoading(true)
//         try {
//             await logout() //logout function is imported from auth.api.js and it will clear the token cookie in the server

//             setUser(null) // clear user data from context
//         } catch (error) {
//             console.log(error)
//         }finally{
//             setLoading(false)
//         }
        

//     }


//         useEffect(() => { // getMe will depend on cookies to get the data
//         const getAndSetUser = async () => { // this is done because, on reloading the app, we need to check if the user is logged in or not, and if logged in then we need to set the user data to context, so that we can use it in the app    
//             try {
//             const data = await getMe();
//             setUser(data.user)
//             } catch (error) {
//                 console.log(error)
//             }finally{
//                 setLoading(false) // after getting the user data from the server, we need to set loading to false, because we have got the user data and we can render the app now

//             }
            
//         }

//         getAndSetUser();
//     }, [])


//     return { user, loading, handleLogin, handleRegister, handleLogout }
// }

import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { getMe, login, logout, register } from "../services/auth.api.js";



export const useAuth = () => {

    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context


    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        try {
            const data = await login({ email, password })
            setUser(data.user)
        } catch (err) {

        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const data = await register({ username, email, password })
            setUser(data.user)
        } catch (err) {

        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            const data = await logout()
            setUser(null)
        } catch (err) {

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {

        const getAndSetUser = async () => {
            try {

                const data = await getMe()
                setUser(data.user)
            } catch (err) { } finally {
                setLoading(false)
            }
        }

        getAndSetUser()

    }, [])

    return { user, loading, handleRegister, handleLogin, handleLogout }
}