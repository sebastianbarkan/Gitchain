import React, { useEffect, useState } from 'react'
import styles from "./SignIn.module.css"
import { useDispatch, useSelector } from 'react-redux';
import { setAuth } from '../../redux/slices/AuthSlice';
import { useNavigate } from 'react-router-dom';

export default function SignIn() {
    const [walletError, setWalletError] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const authenticated = useSelector(state => state.auth.authenticated)
    const [tronInstalled, setTronInstalled] = useState(true)
    const [tronLogin, setTronLogin] = useState(false)

    useEffect(() => {
        if (authenticated) {
            navigate("/");
        }
    }, [authenticated])

    useEffect(() => {
        const triggerTronWeb = async () => {
            await getTronWeb()
        }
        triggerTronWeb()
    }, [window.tronLink])

    async function getTronWeb() {
        console.log("HERE")
        try {
            let tronWeb;
            if (window.tronLink) {
                if (window.tronLink.ready) {
                    tronWeb = window.tronLink.tronWeb;
                    if (tronWeb.defaultAddress.base58) {
                        dispatch(setAuth({ address: tronWeb.defaultAddress.base58 }))
                    }
                } else {
                    console.log("WINDOW", window.tronLink)
                    try {
                        const res = await window.tronLink.request({ method: 'tron_requestAccounts' });
                        console.log("RES", res)
                        if (res.code === 200) {
                            tronWeb = window.tronLink.tronWeb;
                        }
                    } catch (error) {
                        console.error("Error during tronLink request", error);
                    }


                }

                if (tronWeb === undefined) {
                    setTronLogin(true)
                }

            } else {
                setTronInstalled(false)
            }

        } catch (err) {
            console.log("ERR", err)
            setWalletError(true)
            throw err
        }
    }
    return (
        <section>
            <h1 className={styles.header}>Ready to fire your boss?</h1>
            <button
                type="button"
                onClick={getTronWeb}
                className={styles.btn}
            >
                Connect Tron Wallet
            </button>
            {
                walletError ?
                    (
                        <p>
                            There was an error connecting your wallet.
                            Please make sure you have the TronLink extension.
                            Look below for instructions.
                        </p>
                    )
                    :
                    null
            }

            {
                tronInstalled ?
                    null
                    :
                    <p>
                        TRON Wallet not detected please download the Tron Wallet extension
                        <a href='https://www.tronlink.org/' target='_blank'>Click Here For more Information</a>
                    </p>
            }
            {
                tronLogin ?
                    <p>We have detected a Tron wallet, please login in order to be authorized</p>
                    :
                    null
            }
        </section>
    )
}

