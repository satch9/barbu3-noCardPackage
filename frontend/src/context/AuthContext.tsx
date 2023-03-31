import { createContext, useContext, useEffect, useState } from 'react'

import { SERVER } from '../constants'
import { getCookie, deleteCookie, setCookie } from '../helpers'
import { useCookies } from 'react-cookie';

export const AuthContext = createContext({})

export const useAuthContext = () => useContext(AuthContext)

export const AuthProvider = ({ children }: any) => {

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [cookies, setCookie] = useCookies(['barbu']);



    const login = async (username: string, password: string) => {
        setLoading(true)
        try {
            const values = {
                identifier: username,
                password
            }

            const response = await fetch(`${SERVER}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            })

            const data = await response.json()
            if (data?.error) {
                throw data?.error
            } else {
                // set the token
                console.log('data', data)
                setCookie('barbu', data.user);
            }

        } catch (error) {
            console.error(error)
            setError('Quelque chose ne va pas!')
        } finally {
            setLoading(false)
        }
    }

    const register = async (username: string, password: string, email: string) => {
        setLoading(true)
        try {
            const values = {
                username: username,
                password: password,
                email: email
            }

            const response = await fetch(`${SERVER}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            })

            const data = await response.json()
            console.log('data', data)
            if (data?.error) {
                throw data?.error
            } else {
                setCookie('barbu', data.user);
                console.log('cookies', cookies)
            }

        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        deleteCookie('barbu')
    }

    useEffect(() => {
        const token = getCookie('barbu')
        if (token) {
            setCookie('barbu', token);
            setLoading(false)
        } else {
            setLoading(false)
        }
    }, [])

    return (
        <AuthContext.Provider value={{ cookies, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}
