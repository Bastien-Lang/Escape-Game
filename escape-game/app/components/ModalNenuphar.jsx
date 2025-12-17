/* components/ModalNenuphar.jsx */
import { useState, useEffect } from 'react';

export default function ModalNenuphar({ onClose, onResolve }) {
  // État des rotations : 0, 1, 2, ou 3 (multiplié par 90 degrés)
  const [rotations, setRotations] = useState([0, 0, 0, 0]);
  
  // La solution : chaque index correspond à un nénuphar
  // Exemple : Nenu1=90°, Nenu2=180°, Nenu3=0°, Nenu4=270°
  const SOLUTION = [1, 2, 0, 3]; 

  const handleRotate = (index) => {
    const newRotations = [...rotations];
    newRotations[index] = (newRotations[index] + 1) % 4;
    setRotations(newRotations);
  };

  // Vérification de la solution à chaque rotation
  useEffect(() => {
    if (rotations.every((val, i) => val === SOLUTION[i])) {
      setTimeout(() => {
        onResolve();
      }, 500);
    }
  }, [rotations]);

 return (
    <div className="absolute inset-0 flex items-center justify-center z-50">
      
      <div className="bg-amber-900 border-4 border-amber-950 p-6 rounded-lg shadow-2xl max-w-lg w-full text-center mx-4">
        <h3 className="text-yellow-400 font-serif text-xl mb-4 tracking-widest uppercase">
          L'Harmonie des Eaux
        </h3>
        
        <p className="text-amber-100 mb-6 italic text-sm">Orientez les nénuphars...</p>

        <div className="grid grid-cols-2 gap-4 justify-items-center mb-6">
          {rotations.map((rot, i) => (
            <div 
              key={i}
              onClick={() => handleRotate(i)}
              className="cursor-pointer transition-transform duration-500 ease-in-out"
              style={{ transform: `rotate(${rot * 90}deg)` }}
            >
              <img 
                src={`/assets/e3nnModal${i+1}.png`} 
                alt="nenuphar" 
                className="w-24 h-24 object-contain"
              />
            </div>
          ))}
        </div>

        <button 
          onClick={onClose}
          className="bg-amber-800 text-amber-100 px-6 py-2 rounded border-2 border-amber-950 hover:bg-amber-700 transition-colors uppercase text-xs font-bold"
        >
          Abandonner
        </button>
      </div>
    </div>
  );
}