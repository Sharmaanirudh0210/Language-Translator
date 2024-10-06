import languages from "../languages";

import {react} from "react";
import  { useState } from "react";
function Translator  () {
    const [fromText,setFromText] = useState(' ');
    const [toText,setToText] = useState(' ');
    const [fromLanguage,setFromLanguage] = useState('en-GB');
    const [toLanguage,setToLanguage] = useState('hi-IN');
    const [loading,setLoading] = useState(false);

    const handleExchange =()=>{
        let tempvalue = fromText;
        setFromText(toText);
        setToText(tempvalue);

        let templanguage = fromLanguage;
        setFromLanguage(toLanguage);
        setToLanguage(templanguage);
    }

    const copyContent =(text)=>{
        navigator.clipboard.writeText(text);
    }

    const utterText=(text,language)=>{
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text,language);
        utterance.lang = language;
        synth.speak(utterance);
    }

    const handleiconclick =(target,id) =>
    {
        
        if(target.classList.contains('fa-copy')){
            if(id == 'from')
            {
                copyContent(fromText);
            }
            else{
                copyContent(toText);
            }

        }
        else
        {
            if(id == 'from')
            {
                utterText(fromText,fromLanguage);
            }
            else
            {
                utterText(toText,toLanguage);
            }
        }
    }

    const handleTranslate = () => {
        setLoading(true);
        let url = `https://api.mymemory.translated.net/get?q=${fromText}&langpair=${fromLanguage}|${toLanguage}`;

        fetch(url)
        .then((res) => res.json())
        .then((data) => {
            setToText(data.responseData.translatedText);
            setLoading(false);
        });
    };
    
    return ( 
        <>
            <div className="wrapper">
                <div className="text-input">
                    <textarea  className ="from-text" name="from" id="from" placeholder="Enter text" value={fromText} onChange={(event) =>setFromText(event.target.value)}></textarea>
                    <textarea  className ="to-text" name="to" id="to" readOnly value = {toText}></textarea>
                </div>
                <ul className="controls">
                    <li className="row-from">
                        <div className="icons from">
                            <i id ="from" class="fa-solid fa-volume-high" onClick={(event)=>handleiconclick(event.target,'from')}></i>
                            <i id ="from" class="fa-solid fa-copy" onClick={(event)=>handleiconclick(event.target,'from')}></i>
                        </div>
                        <select value={fromLanguage} onChangeCapture={(event)=>setFromLanguage(event.target.value)}>
                            {Object.entries(languages).map(([code, name]) => (
                                <option key={code} value={code}>
                                {name}
                                </option>
                            ))}
                        </select>
                    </li>
                    <li className="exchange" onClick={handleExchange}>
                        <i class="fa-solid fa-right-left"></i>
                    </li>
                    <li className="row-to">
                        <select value={toLanguage} onChangeCapture={(event)=>setToLanguage(event.target.value)}>
                            {Object.entries(languages).map(([code, name]) => (
                                <option key={code} value={code}>
                                {name}
                                </option>
                            ))}
                        </select>
                        <div className="icons to">
                            <i id = " to" class="fa-solid fa-copy" onClick={(event)=>handleiconclick(event.target,'to')}></i>
                            <i id = "to" class="fa-solid fa-volume-high" onClick={(event)=>handleiconclick(event.target,'to')}></i>
                        </div>
                    </li>
                </ul>
            </div>
            <button onClick={handleTranslate} disabled={loading}>
                {loading ? 'Translating..' : "Translate text"}
            </button>
        </>
        
    )
}

export default Translator;