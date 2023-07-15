import React, { useContext, useState ,useEffect} from 'react'
import { auth } from '../utils/firebase'
import {signInWithEmailAndPassword ,createUserWithEmailAndPassword, sendPasswordResetEmail, updatePassword, updateEmail, updateProfile} from 'firebase/auth'
import {GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({children}) {
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)
    const googleProvider = new GoogleAuthProvider();

    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }

    function loginWithGoogle() {
        return signInWithPopup(auth,googleProvider )
    }

    function logout(){
        return auth.signOut()
    }

    function resetPassword(email){
        return sendPasswordResetEmail(auth, email)
    }

    function authUpdatePassword(newPassword){
        return updatePassword(currentUser,newPassword) 
    }

    function authUpdateEmail(email){
        return updateEmail(currentUser,email)
    }

    function authUpdateProfile(value){
        return updateProfile(currentUser,value)
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            setLoading(false)
        })
        return unsubscribe;
    },[])

    const value = {
        currentUser,
        loading,
        signup,
        login,
        logout,
        loginWithGoogle,
        resetPassword,
        authUpdatePassword,
        authUpdateEmail,
        authUpdateProfile
    }
    
    return (
    <AuthContext.Provider value={value}>
        {!loading && children}
    </AuthContext.Provider>
  )
}
