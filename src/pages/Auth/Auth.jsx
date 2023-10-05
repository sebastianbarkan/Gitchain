import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import SignIn from '../SignIn/SignIn'
import { checkAuth } from '../../redux/slices/AuthSlice'
import { Navigate } from "react-router-dom";

function Auth({ children }) {
    const authenticated = useSelector(state => state.auth.authenticated)
    const loading = useSelector(state => state.auth.loading)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(checkAuth())
    }, [])
   
    return (
        <>
            {
                loading ?
                    <p>Loading</p>
                    :
                    authenticated ?
                        (
                            { ...children }
                        )
                        :
                        (
                            <Navigate to="/signin" replace={true} />
                        )

            }
        </>
    )
}

export default Auth