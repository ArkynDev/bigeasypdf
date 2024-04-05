import React, { useState, useEffect } from 'react';
import { Document, Page } from '@react-pdf/renderer';
import axios from 'axios';

interface ModalProps {
    Show: boolean;
    pdfUrl: string;
}

export const Modal: React.FC<ModalProps> = ({ Show = false, pdfUrl }) => {
    const [pdfData, setPdfData] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPdf = async () => {
            try {
                const response = await axios.get(pdfUrl, { responseType: 'blob' });
                const reader = new FileReader();
                reader.readAsDataURL(response.data);
                reader.onload = () => setPdfData(reader.result as string);
            } catch (error) {
                setError('Error fetching PDF');
            }
        };

        if (Show) {
            fetchPdf();
        }
    }, [Show, pdfUrl]);

    return (
        <>
            {Show && (
                <div className="flex items-center justify-center bg-slate-500 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] fixed w-full h-full">
                    <div className="flex flex-col p-6 bg-white rounded-lg w-[400px] h-[200px]">
                        <div className="flex justify-end px-4">
                            <button className="rounded-full bg-red-500 w-[20px] h-[20px]" onClick={() => (Show = false)}></button>
                        </div>
                        <div className="flex flex-col w-full h-[100px]">
                            {error && <p className="text-red-500">{error}</p>}
                            {pdfData && (
                                <Document style={{ height: "100%", width: "100%" }} >
                                    <Page file={pdfUrl} style={{ height: "100%", width: "100%" }} />
                                </Document>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};