import * as React from 'react';
import HomePage from "./dashboard/home/Home";
import BoardsPage from "./dashboard/boards/Boards"
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
            <HomePage/>
        </>
    )
}

export const Boards = () => {
    return(
        <>
            <BoardsPage/>
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