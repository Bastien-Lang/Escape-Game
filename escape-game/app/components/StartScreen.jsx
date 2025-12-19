import { useState, useEffect, useCallback } from 'react';

export default function StartScreen({ onStart }) {
    const [isBlinking, setIsBlinking] = useState(false);

    const handleStartGame = useCallback(() => {
        if (onStart) {
            document.removeEventListener('keydown', handleStartGame);
            document.removeEventListener('click', handleStartGame);
            onStart();
        }
    }, [onStart]);

    useEffect(() => {
        document.addEventListener('keydown', handleStartGame);
        document.addEventListener('click', handleStartGame);

        const intervalId = setInterval(() => {
            setIsBlinking(prev => !prev);
        }, 800);

        return () => {
            document.removeEventListener('keydown', handleStartGame);
            document.removeEventListener('click', handleStartGame);
            clearInterval(intervalId);
        };
    }, [handleStartGame]);

    return (
        <div className="fixed inset-0 bg-gray-900 flex flex-col justify-center items-center z-50 text-white">
            <img src="/assets/logo.png" alt="logo" className='mb-4 mt-4' />
            <p
                className={`text-2xl mt-4 transition-opacity duration-700 ${isBlinking ? 'opacity-100' : 'opacity-30'}`}
                style={{ fontFamily: 'monospace' }}
            >
                APPUYEZ SUR UNE TOUCHE POUR JOUER
            </p>
            <p className='mt-4 max-w-md text-center text-sm opacity-70'>
                Règles : Ne pas quitter la page pendant le jeu. Si vous changez l'URL, ouvrez la dans un nouvel onglet.
            </p>
        </div>
    );
}