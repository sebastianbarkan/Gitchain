import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "../redux/slices/AuthSlice";

export const useHomeLoader = () => {
    const dispatch = useDispatch();
    const authenticated = useSelector(state => state.auth.authenticated);

    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch]);

    if (authenticated === false) {
        return 401;
    }

    return null;
};




