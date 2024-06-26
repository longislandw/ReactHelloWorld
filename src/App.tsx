import * as React from 'react'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {DashBoard, Home, Boards, Bar, PageNotFound, WorkoutRecord} from './pages/Pages';
import RootLayout from './pages/RootLayout'
// import './style.css';


const router = createBrowserRouter([
    {
        // path: "/",
        element:<RootLayout/>,
        errorElement:<PageNotFound/>,
        children:[
            {
                element: <DashBoard/>,
                children:[
                    {
                        path: "",
                        element: <Home/>,
                    },
                    {
                        path: "bar",
                        element: <Bar/>,
                    },
                    {
                        path: "boards",
                        element: <Boards/>,
                    },
                    {
                        path: "workout_record",
                        element: <WorkoutRecord/>,
                    },
                    {
                        path: "*",
                        element: <PageNotFound/>,
                    }
                ]
            },
            {
                // path: "about",
                // element: <AboutMe/>,
            }

        ]
    },
], {basename:process.env.PUBLIC_URL});

function App (){
    return (
        <RouterProvider router={router} />
    );
}

export default App;
