// state layer
import { createContext, useState } from "react";


export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    // 2 things user data and loading

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

   

    return(
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    )

}