import { useState, useEffect, useCallback } from 'react';

// Le composant accepte une prop 'onStart' pour notifier le composant parent
export default function StartScreen({ onStart }) {
    const [isBlinking, setIsBlinking] = useState(false);

    // Fonction qui gère le début du jeu
    // useCallback est utilisé pour s'assurer que la fonction n'est pas recréée inutilement
    const handleStartGame = useCallback(() => {
        // Empêche de démarrer plusieurs fois
        if (onStart) {
            // Retire les écouteurs d'événements pour éviter les effets secondaires
            document.removeEventListener('keydown', handleStartGame);
            document.removeEventListener('click', handleStartGame);
            
            // Appelle la fonction passée par le parent pour changer l'état du jeu
            onStart(); 
        }
    }, [onStart]);
    
    // Effet pour gérer les écouteurs d'événements et le clignotement du texte
    useEffect(() => {
        // Ajoute les écouteurs dès que le composant est monté
        document.addEventListener('keydown', handleStartGame);
        document.addEventListener('click', handleStartGame);

        // Active l'effet de clignotement (optionnel)
        const intervalId = setInterval(() => {
            setIsBlinking(prev => !prev);
        }, 800);

        // Fonction de nettoyage exécutée lorsque le composant est démonté (ou avant la prochaine exécution de l'effet)
        return () => {
            document.removeEventListener('keydown', handleStartGame);
            document.removeEventListener('click', handleStartGame);
            clearInterval(intervalId);
        };
    }, [handleStartGame]); // handleStartGame est dans les dépendances de useCallback

    return (
        <div className="fixed inset-0 bg-gray-900 flex flex-col justify-center items-center z-50 text-white">
            <img src="/assets/title.svg" alt="Escape the cave" className='w-[30%] mb-4'/>
            <img src="/assets/logo.svg" alt="logo" className='mb-4 mt-4' />
            <p 
                className={`text-2xl mt-4 transition-opacity duration-700 ${isBlinking ? 'opacity-100' : 'opacity-30'}`}
                style={{ fontFamily: 'monospace' }} // Style rétro
            >
                {/* Le message classique */}
                APPUYEZ SUR UNE TOUCHE POUR JOUER
            </p>
        </div>
    );
}