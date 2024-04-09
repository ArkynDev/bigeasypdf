import { useState, useEffect } from "react";
import { Canvas } from "@react-pdf/renderer";
import PDFJS from 'pdfjs-dist';

export const FirstPage = ({ file }) => {
    const [pdf, setPdf] = useState(null);

    useEffect(() => {
        PDFJS.getDocument(file).then((pdf) => {
            console.log(pdf);
            setPdf(pdf);
        });
    }, [file]);
    
    return (
        <div>
            
        </div>
    );
};