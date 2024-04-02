import React, { useState, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import { Button } from "../components/ui/Button";
import { DocumentView } from "../components/PDFDocumentView/DocumentView";
import { Modal } from "../components/modal/Modal";

export const MergePDF: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

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

    const handleMerg = async () => {
        await mergePDFs();
        setShowModal(true);
    }

    useEffect(() => {
        console.log('Lista de arquivos atualizada:', files);
    }, [files]);
    
    return (
        <div className="flex flex-col items-center justify-center w-full h-full gap-y-4">
            <h2 className=" text-lg">Juntar arquivos PDF</h2>
            <input type="file" accept=".pdf" multiple onChange={handleFileChange} />
            <div className="flex border border-red-800 rounded-lg p-2 gap-4">
                {files.map((file) => (
                    <DocumentView name={file.name}  onRemove={handleRemoveFile} />
                ))}
            </div>
            {mergedPdfUrl ? (
                <div>
                    <Button children="Baixar PDF" onClick={handleDownload} />
                    <Button children="Compartilhar PDF" onClick={handleShare} />
                </div>
            ) : (
                <Button children="Mesclar PDFs" onClick={handleMerg} />
            )}
            <Modal Title="Finalizar" Show={showModal} Component={`<p>Obrigado por utilizar</p>`} />
        </div>
    )
}