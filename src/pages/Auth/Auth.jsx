import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { checkAuth } from '../../redux/slices/AuthSlice'
import { Navigate } from "react-router-dom";
import { fetchUserData } from '../../redux/slices/GithubSlice';

function Auth({ children }) {
    const authenticated = useSelector(state => state.auth.authenticated)
    const loading = useSelector(state => state.auth.loading)
    const dispatch = useDispatch()
    const githubAuth = useSelector(state => state.github.githubAuth)
    const contributions = useSelector(state => state.github.contributions)
    const languages = useSelector(state => state.github.languages)

    useEffect(() => {
        if (!authenticated || !githubAuth) {
            dispatch(checkAuth())
        }

        if (!contributions || !languages) {
            dispatch(fetchUserData())
        }
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