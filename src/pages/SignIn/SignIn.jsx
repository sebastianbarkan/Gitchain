import React, { useEffect, useState } from 'react'
import styles from "./SignIn.module.css"
import { useDispatch, useSelector } from 'react-redux';
import { setAuth } from '../../redux/slices/AuthSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import Brand from "../../assets/Brand.png"
import GraphicsLP from "../../assets/GraphicsLP.png"
import LinkBtnLP from "../../assets/LinkBtnLP.png"
import TextLP from "../../assets/TextLP.svg"


export default function SignIn() {
    const [walletError, setWalletError] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const authenticated = useSelector(state => state.auth.authenticated)
    const [tronInstalled, setTronInstalled] = useState(true)
    const [tronLogin, setTronLogin] = useState(false)
    const location = useLocation()

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
        try {
            let tronWeb;
            if (window.tronLink) {
                if (window.tronLink.ready) {
                    tronWeb = window.tronLink.tronWeb;
                    if (tronWeb.defaultAddress.base58) {
                        dispatch(setAuth({ address: tronWeb.defaultAddress.base58 }))
                    }
                } else {
                    try {
                        const res = await window.tronLink.request({ method: 'tron_requestAccounts' });
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
        <section className={styles.wrapper}>
            <div className={styles.imgWrap}>
                <img src={Brand} alt="Gitchain logo" className={styles["img-brand"]}></img>
            </div>
            <div className={styles.contentWrap}>
                <img src={TextLP} alt="main text" className={styles["img-text"]} />
                <button
                    type="button"
                    onClick={getTronWeb}
                    className={styles.btn}
                >
                    <img src={LinkBtnLP} alt="chain img" className={styles["img-link"]}></img>
                    <p>
                        Connect Tron Wallet
                    </p>
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
                        <p className={styles["no-detect"]}>
                            TRON Wallet not detected please download the Tron Wallet extension
                            <a href='https://www.tronlink.org/' target='_blank'>Click Here For more Information</a>
                        </p>
                }
                {
                    tronLogin ?
                        <p className={styles["warning-login"]}>We have detected a Tron wallet, please login in order to be authorized</p>
                        :
                        null
                }
            </div>
            {/* <div className={styles.imgWrap}>
                <img src={GraphicsLP} alt="Gitchain graphics" className={styles["img-graphics"]} />
            </div> */}
        </section>
    )
}

