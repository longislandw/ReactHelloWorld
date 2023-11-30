import React, {useEffect, useState} from 'react';
import {Navigate, useNavigate} from "react-router-dom";
// @ts-ignore
import logo from 'assets/logo.svg';
import Swal from 'sweetalert2';

const Page404 = () => {
    const navigate = useNavigate();
    function doRedirect(){
        console.log("Redirecting")
        const waitTime:number = 3000
        let timerInterval:number;
        Swal.fire({
            title: "頁面不存在!",
            html: " <b></b> 秒後重新導向.",
            timer: waitTime,
            timerProgressBar: true,
            confirmButtonText: "Redirect Now",
            didOpen: () => {
                // Swal.showLoading();
                const timer = Swal.getPopup()?.querySelector("b");
                timerInterval = window.setInterval(() => {
                    if (timer) timer.textContent = `${Swal.getTimerLeft()}`;
                }, 100);
            },
            willClose: () => {
                window.clearInterval(timerInterval);
            }
        }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
                console.log("I was closed by the timer");
            }
        }).finally(
            ()=>{
                navigate("/")
                // window.location.href="http://192.168.56.1:3000/"
            }
        )
    }
    useEffect(
        ()=>{
            const setRedirectTimeout = setTimeout(() => {
                doRedirect();
            }, 100);
            return () => {
                clearTimeout(setRedirectTimeout);};
            },
        [])

    return (
        <>
            <img src={logo} className={"App-logo"} alt="logo" width={100} />
            <h2>404 Page not found</h2>
        </>
    );
};

export default Page404;
