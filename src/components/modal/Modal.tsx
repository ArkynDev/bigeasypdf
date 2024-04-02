interface ModalProps {
    Title: string;
    Show: boolean;
    Component?: string;
}

export const Modal: React.FC<ModalProps> = ({ Title, Show = false, Component }) => {
    return (
        <>
            {Show && (
                <div className="flex items-center justify-center bg-slate-500 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] fixed w-full h-full">
                    <div className="flex flex-col p-6 bg-white">
                        <div className="flex justify-between px-4">
                            <h2>{Title}</h2>
                            <button className="rounded-full bg-red-500 w-[20px] h-[20px]" onClick={() => (Show = false)}></button>
                        </div>
                        <div className="flex flex-col w-full">
                            {Component}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};