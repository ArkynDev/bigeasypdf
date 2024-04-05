import React, { useState, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import Dropzone from "react-dropzone";

import { Button } from "../components/ui/Button";
import { DocumentView } from "../components/PDFDocumentView/DocumentView";
import "./MergePDF.css";

export const MergePDF: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);

    const handleDrop = (acceptedFiles) => {
        // Validação para aceitar apenas arquivos PDF
        const acceptedFileTypes = ["application/pdf"];
        const invalidFiles = acceptedFiles.filter(
            (file) => !acceptedFileTypes.includes(file.type)
        );
    
        if (invalidFiles.length > 0) {
            alert("Somente arquivos PDF são permitidos!");
            return;
        }
    
        setFiles([...files, ...acceptedFiles]);
    };

    const addFiles = (newFiles: FileList) => {
        const updatedFiles = [...files, ...newFiles];
        setFiles(updatedFiles);
        console.log(files);
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const selectedFiles = Array.from(event.target.files);
            //setFiles([...files, ...selectedFiles]);
            addFiles(selectedFiles);
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

    const handleRemoveFile = (fileName: string) => {
        const newFiles = files.filter(file => file.name !== fileName);
        setFiles(newFiles);
    };

    useEffect(() => {
        console.log('Lista de arquivos atualizada:', files);
    }, [files]);
    
    return (
        <div className="flex flex-col items-center justify-center w-full h-full gap-y-4">
            <h2 className=" text-lg">Juntar arquivos PDF</h2>
            {files.length === 0 ? (
                <Dropzone
                    accept=".pdf"
                    onDrop={handleDrop}
                >
                    {({ getRootProps, getInputProps }) => (
                        <div {...getRootProps()} className="dropzone flex items-center justify-center border-2 border-dashed px-8 py-12 border-red-600 rounded-lg  cursor-pointer" >
                            <input {...getInputProps()} />
                            <p className="text-red-600 font-extrabold text-center">Arraste seus arquivos PDF aqui <br />Ou clique para selecionalos</p>
                        </div>
                    )}
                </Dropzone>
            ) : (
                <div className="flex flex-col gap-2">
                    {mergedPdfUrl ? (
                        <div className="flex items-center justify-center">
                            <DocumentView />
                        </div>
                    ) : (
                        <Dropzone
                            accept=".pdf"
                            onDrop={handleDrop}
                            noClick
                        >
                            {({getRootProps}) => (
                                <div {...getRootProps()} className="flex items-center justify-center border-2 border-dashed p-4 border-red-600 rounded-lg gap-2">
                                    {files.map((file) => (
                                        <DocumentView name={file.name}  onRemove={handleRemoveFile} />
                                    ))}
                                </div>
                            )}
                        </Dropzone>
                    )}
                    {mergedPdfUrl ? (
                        <div className="flex flex-col gap-2 justify-center">
                            <input type="text" name="mergerName" id="mergedName" placeholder="Escolha o nome do arquivo." className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                            <div className="flex gap-2 justify-center">
                                <Button children="Baixar PDF" onClick={handleDownload} />
                                <Button children="Compartilhar PDF" onClick={handleShare} />
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <input type="file" accept=".pdf" className="uploaded-input border border-red-700  pr-2 rounded-lg" multiple onChange={handleFileChange} />
                            <Button children="Mesclar PDFs" onClick={mergePDFs} />
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}