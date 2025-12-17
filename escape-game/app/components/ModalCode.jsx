import { useState } from 'react';

export default function ModalCode({ onClose, onCodeSubmit }) {
    const [code, setCode] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // onCodeSubmit est la fonction checkCode passée depuis Enigme1
        onCodeSubmit(code);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            
            <div 
              
                className="
                    bg-amber-900 text-amber-100 
                    p-8 
                    rounded-lg 
                    border-4 border-amber-950
                    shadow-[6px_6px_0_rgba(0,0,0,0.6)] 
                    max-w-sm w-full
                    font-serif
                "
            >
                <h3 className="
                    text-xl font-bold mb-4 
                    text-yellow-400 
                    border-b border-amber-700 pb-2
                    tracking-wider
                ">
                    Saisie du Code Secret
                </h3>
                
                <p className="mb-6 opacity-90 text-sm">
                    Cette boîte est protégée par un mécanisme. Quel est le code ?
                </p>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="-"
                        className="
                            p-3 
                            border-2 border-amber-950 
                            rounded-md 
                            text-center 
                            text-2xl 
                            tracking-[0.5em] 
                            text-gray-900 
                            bg-amber-100 
                            focus:ring-2 focus:ring-yellow-500
                        "
                        maxLength={4} 
                        required
                    />
                    
                    <div className="flex justify-end gap-3 mt-4">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="
                                px-4 py-2 
                                bg-amber-700 text-amber-100 
                                rounded-md 
                                border-2 border-amber-900
                                hover:bg-amber-600
                                font-bold text-sm
                            "
                        >
                            Annuler
                        </button>
                        
                        <button 
                            type="submit" 
                            className="
                                px-4 py-2 
                                bg-yellow-600 text-gray-900 
                                rounded-md 
                                border-2 border-yellow-800
                                hover:bg-yellow-500 
                                disabled:opacity-40
                                font-bold text-sm
                            "
                            disabled={code.length === 0}
                        >
                            VALIDER
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}