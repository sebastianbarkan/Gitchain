import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Home from '../Home/Home'
import SignIn from '../SignIn/SignIn'
import { checkAuth } from '../../redux/slices/AuthSlice'

function Auth() {
    const authenticated = useSelector(state => state.auth.authenticated)
    const dispatch = useDispatch()
    dispatch(checkAuth())


    return (
        <>
            {
                authenticated ?
                    (
                        <Home />
                    )
                    :
                    (
                        <SignIn />
                    )

            }
        </>
    )
}

export default Auth