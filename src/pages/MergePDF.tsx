import React, { useState, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import { Page, Document } from '@react-pdf/renderer';
import { Button } from "../components/ui/Button";

export const MergePDF: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const selectedFiles = Array.from(event.target.files);
            setFiles([...files, ...selectedFiles]);
        }
    };

    const mergePDFs = async () => {
        if (files.length < 2) {
            alert('Por favor, selecione pelo menos dois arquivos PDF para mesclar.');
            return;
        }
    
        const pdfDocuments = await Promise.all(files.map(async (file) => {
            const fileData = await file.arrayBuffer();
            return PDFDocument.load(fileData);
        }));
    
        const mergedPdf = await PDFDocument.create();
    
        for (const pdfDoc of pdfDocuments) {
            const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
            copiedPages.forEach((page) => {
                mergedPdf.addPage(page);
            });
        }
    
        const mergedPdfData = await mergedPdf.save();
        const mergedPdfBlob = new Blob([mergedPdfData], { type: 'application/pdf' });
        const mergedPdfUrl = URL.createObjectURL(mergedPdfBlob);
        setMergedPdfUrl(mergedPdfUrl);
    };

    const handleDownload = () => {
        if (mergedPdfUrl) {
            const link = document.createElement('a');
            link.href = mergedPdfUrl;
            link.download = 'merged_pdf.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };
    
    const handleShare = () => {
        if (mergedPdfUrl) {
          // Implemente a lógica de compartilhamento aqui
            console.log('Compartilhando:', mergedPdfUrl);
        }
    };

    const renderPdfPreview = (file: File) => {
        const url = URL.createObjectURL(file);
        return (
            <div key={file.name}>
                <Document file={url}>
                    <Page pageNumber={1} width={200} height={150} scale={0.7} />
                </Document>
            </div>
        );
    };


    
    return (
        <div className="flex flex-col items-center justify-center w-full h-full gap-y-4">
            <h2 className=" text-lg">Juntar arquivos PDF</h2>
            <input type="file" accept=".pdf" multiple onChange={handleFileChange} />
            <div className="flex border border-red-800 rounded-lg p-2 gap-4">
                {files.map((file) => renderPdfPreview(file))}
            </div>
            {mergedPdfUrl ? (
                <div>
                    <Button children="Baixar PDF" onClick={handleDownload} />
                    <Button children="Compartilhar PDF" onClick={handleShare} />
                </div>
            ) : (
                <Button children="Mesclar PDFs" onClick={mergePDFs} />
            )}
        </div>
    )
}