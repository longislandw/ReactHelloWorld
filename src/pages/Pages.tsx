import * as React from 'react'
import BarPage from './dashboard/bar/BarPage';
import Page404 from "./pagenotfound/PageNotFound";
import DashBoardpage from "./dashboard/DashBoard";

export const DashBoard=()=>{
    return(
        <>
            <DashBoardpage/>
        </>
    )
}

export const Home = () => {
    return(
        <>
            <h1>Home Page</h1>
            <div>Hello world!</div>
        </>
    )
}

export const Bar = () => {
    return(
    <>
        <BarPage/>
    </>
    )
}

export const PageNotFound =()=>{
    return(
        <>
            <Page404/>
        </>
    )
}