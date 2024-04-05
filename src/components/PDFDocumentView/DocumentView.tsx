import React from 'react';
import { FileText } from 'lucide-react';

interface DocumentProps {
    name?: string;
    onRemove?: (index: number) => void;
}

export const DocumentView: React.FC<DocumentProps> = ({  name, onRemove }) => {
    return(
        <div className='flex flex-col justify-around items-center border w-[100px] h-[125px] border-gray-800 rounded-md gap-2 px-2 overflow-hidden'>
            <div className='flex justify-end w-full'>
                <button className='rounded-full bg-red-500 w-[10px] h-[10px]' onClick={() => onRemove && onRemove(name)}>
                </button>
            </div>
            <FileText />
            <p className='w-full text-xs'>{name}</p>
        </div>
    )
};