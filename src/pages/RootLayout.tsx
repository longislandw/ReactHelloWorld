import {Outlet} from "react-router-dom";
import * as React from "react";

const RootLayout:React.FC = () =>{
    return(
        <div>
            <Outlet/>
        </div>
    )
}

export default RootLayout;