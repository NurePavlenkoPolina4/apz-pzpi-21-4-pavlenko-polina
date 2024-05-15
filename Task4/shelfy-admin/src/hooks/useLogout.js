import { useAuthContext } from "./useAuthContext";

export const useLogout = ()=>{
    const {dispatch} = useAuthContext()
    const logout = () =>{
        localStorage.removeItem('jwt-admin')
        dispatch({type: 'LOGOUT'})

    }
    return {logout}
}