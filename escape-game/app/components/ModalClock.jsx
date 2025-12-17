/* components/ModalClock.jsx */
import { useState } from 'react';

export default function ModalClock({ onClose, onSuccess }) {
    const [hour, setHour] = useState('');
    const [min, setMin] = useState('');

    const validate = (e) => {
        e.preventDefault();
        const now = new Date();
        if (parseInt(hour) === now.getHours() && parseInt(min) === now.getMinutes()) {
            onSuccess();
        } else {
            alert("L'heure ne correspond pas au présent...");
        }
    };

    return (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-amber-900 border-4 border-amber-950 p-8 rounded-lg shadow-2xl text-center font-serif text-amber-100">
                <h3 className="text-yellow-400 text-xl mb-4 tracking-widest uppercase"> </h3>
                <form onSubmit={validate} className="flex flex-col gap-6">
                    <div className="flex gap-2 items-center justify-center">
                        <input type="number" value={hour} onChange={e=>setHour(e.target.value)} placeholder="HH" className="w-16 p-2 text-gray-900 rounded bg-amber-100 text-center text-xl" required />
                        <span className="text-2xl font-bold">:</span>
                        <input type="number" value={min} onChange={e=>setMin(e.target.value)} placeholder="MM" className="w-16 p-2 text-gray-900 rounded bg-amber-100 text-center text-xl" required />
                    </div>
                    <div className="flex gap-2">
                        <button type="button" onClick={onClose} className="flex-1 bg-amber-800 p-2 border border-amber-950 uppercase text-xs">Annuler</button>
                        <button type="submit" className="flex-1 bg-yellow-600 p-2 border border-yellow-800 text-gray-900 font-bold uppercase text-xs">Régler</button>
                    </div>
                </form>
            </div>
        </div>
    );
}