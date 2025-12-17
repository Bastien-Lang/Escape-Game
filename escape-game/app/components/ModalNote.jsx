/* components/ModalNote.jsx */
export default function ModalNote({ onClose, code }) {
    return (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50">
            <div 
                className="
                    bg-[#e9dcc9] 
                    text-zinc-800
                    p-10
                    rounded-sm
                    border-l-4 border-amber-800/30
                    shadow-[10px_10px_20px_rgba(0,0,0,0.4)]
                    max-w-[250px]
                    w-full
                    rotate-1 
                    relative
                "
            >
                {/* Texture de vieux papier simulée */}
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/papyros.png')]"></div>

                <h4 className="font-serif italic text-sm mb-4 border-b border-zinc-400 pb-1">
                    Note griffonnée :
                </h4>
                
                <p className="font-mono text-3xl text-center tracking-widest my-6 font-bold text-zinc-900">
                    {code}
                </p>

                <p className="text-[10px] text-center opacity-70 mb-4 italic">
                    "Ne pas oublier le code du coffre cette fois..."
                </p>

                <button 
                    onClick={onClose}
                    className="
                        block mx-auto text-xs uppercase font-bold 
                        hover:text-amber-700 transition-colors
                        border border-zinc-400 px-3 py-1 rounded
                    "
                >
                    Reposer la note
                </button>
            </div>
        </div>
    );
}