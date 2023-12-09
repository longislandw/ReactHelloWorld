import React, {useEffect, useState} from "react";

type myProps={
    start?:boolean,
    text:string,
    interval:number,
    classname?:string,
    onTypingComplete?:Function
}

const TypingEffect:React.FC<myProps>=(props:myProps)=>{
    const {start, text, interval,classname,  onTypingComplete} = props
    const [displayText, setDisplayText] = useState("")
    const [index, setIndex]= useState(0);
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
        if (start||start===undefined) {
            const timerId = setTimeout(() => {
                if (isTyping) {
                    if (index < text.length) {
                        const newText = displayText + text[index]
                        setDisplayText(newText)
                        setIndex(index + 1)
                    } else {
                        setIsTyping(false)
                    }
                }
            }, interval);

            return () => {
                clearTimeout(timerId)
            }
        }
    }, [start, index,interval,text,isTyping, displayText])

    useEffect(() => {
        if(!isTyping){
            if (onTypingComplete!==undefined){
                onTypingComplete()
            }
        }
    }, [isTyping]);

    return(
        <span className={classname}>{displayText}</span>
    )
}

export default TypingEffect