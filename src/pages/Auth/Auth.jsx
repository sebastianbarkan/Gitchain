import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { checkAuth } from '../../redux/slices/AuthSlice'
import { Navigate } from "react-router-dom";
import { fetchUserData } from '../../redux/slices/GithubSlice';
import tronWeb from '../../tron/tronWeb';
import { setAuth } from '../../redux/slices/AuthSlice';

function Auth({ children }) {
    const authenticated = useSelector(state => state.auth.authenticated)
    const loading = useSelector(state => state.auth.loading)
    const dispatch = useDispatch()
    const githubAuth = useSelector(state => state.github.githubAuth)
    const contributions = useSelector(state => state.github.contributions)
    const languages = useSelector(state => state.github.languages)
    const address = useSelector(state => state.auth.address)

    useEffect(() => {
        if (!authenticated || !githubAuth) {
            dispatch(checkAuth())
        }

        if (!contributions || !languages) {
            dispatch(fetchUserData())
        }
    }, [])

    useEffect(() => {
        let previousAddress = null;

        setInterval(() => {
            // Ensure tronWeb is available and properly initialized
            if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
                const currentAddress = window.tronWeb.defaultAddress.base58;
                // If the address is different from the previously stored one, log the change
                if (currentAddress !== previousAddress) {
                    dispatch(setAuth({ address: currentAddress }))
                    previousAddress = currentAddress;
                }
            }
        }, 3000);

    }, [tronWeb.fullNode.host])

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