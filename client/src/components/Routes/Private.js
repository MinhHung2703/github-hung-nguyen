import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/auth'
import { Outlet } from 'react-router-dom';

const Private = () => {
    const [ok, setOk] = useState(false);
    const [auth, setAuth] = useAuth();

    useEffect(() => { }, [])

    return ok ? <Outlet /> : "spinner"
}
export default Private