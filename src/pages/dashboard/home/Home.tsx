import React, {useState} from "react";
import TypingEffect from "../../../component/ui/TypingEffect";
import "assets/index.css"

const Home:React.FC=()=>{
    const [typingOrder, setTypingOrder] = useState({1:true,2:false,3:false})

    const handleFistTypingComplete=()=>{
        setTypingOrder({...typingOrder, 2:true})
    }

    return(
        <div className={"bg-gray-50 py-5 lg:py-16"}>
        <div className={"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:flex lg:items-center lg:justify-between"}>
            <h2 className={"text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl m-0"}>
                <TypingEffect classname={"block mb-3 font-sans"} interval={60} text={"Hello World"} onTypingComplete={handleFistTypingComplete} />
                <TypingEffect classname={"block text-lime-600"} interval={110} text={"你好呀，世界"}/>
            </h2>
        </div>
        <p className="text-xl text-gray-500 max-w-7xl mx-auto my-0 px-4 py-3 sm:px-6 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <TypingEffect start={typingOrder[2]} interval={30} text={"Welcome To My Page"} />
        </p>
        </div>
    )
}

export default Home;
