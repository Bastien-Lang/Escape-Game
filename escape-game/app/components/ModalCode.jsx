import { useState } from 'react';

export default function ModalCode({ onClose, onCodeSubmit }) {
    const [code, setCode] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // onCodeSubmit est la fonction checkCode passée depuis Enigme1
        onCodeSubmit(code);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
                <h3 className="text-lg font-bold mb-4">Entrez le Code</h3>
                <p className="mb-4">Cette boîte est verrouillée. Quel est le code ?</p>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Code secret"
                        className="p-2 border border-gray-300 rounded text-center text-xl tracking-widest"
                        maxLength={4} 
                        required
                    />
                    
                    <div className="flex justify-end gap-2 mt-4">
                        {/* Bouton de Fermeture */}
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                        >
                            Annuler
                        </button>
                        
                        {/* Bouton de Soumission */}
                        <button 
                            type="submit" 
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                            disabled={code.length === 0}
                        >
                            Valider
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}