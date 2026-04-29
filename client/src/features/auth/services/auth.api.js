import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:8005",
    withCredentials: true,
})
export const register = async ({username, password, email}) => {
    try {
        const response = await api.post("/api/auth/register", {
            username,
            password,
            email
        })

        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const login = async ({email, password}) => {
    try {
        const response = await api.post("/api/auth/login", {
            email,
            password
        })

        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const logout = async () => {
    try {
        const response = await api.get("/api/auth/logout"
        //    { withCredentials: true  // to include cookies in the request as axios does not include cookies by default, we need to set this option to true}
        )

        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const getMe = async () => {
    try {
        const response = await api.get("/api/auth/get-me" )

        return response.data
    } catch (error) {
        console.log(error)
    }
}
