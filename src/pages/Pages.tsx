import * as React from 'react';
import HomePage from "./dashboard/home/Home";
import BoardsPage from "./dashboard/boards/Boards"
import BarPage from './dashboard/bar/BarPage';
import Page404 from "./pagenotfound/PageNotFound";
import DashBoardPage from "./dashboard/DashBoard";
import WorkoutRecordPage from "./dashboard/workoutRecord/WorkoutRecord";

export const DashBoard=()=>{
    return(
        <>
            <DashBoardPage/>
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

export const WorkoutRecord = () => {
    return(
        <>
            <WorkoutRecordPage/>
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