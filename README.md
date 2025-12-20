

#  Escape Game — *Escape The Cave*

![Aperçu du jeu](/escape-game/public/assets/page-acceuil.png)

**Escape The Cave** est une expérience narrative et interactive de type **Escape Game**, développée avec **Next.js** et **GSAP**. Plongez dans un univers inspiré de *Minecraft*, résolvez des énigmes, collectez des objets et réparez des mécanismes pour vous échapper des profondeurs de la grotte.

---

[Vidéo de résolution](https://youtu.be/SF_qKlVypFo)

---

##  Fonctionnalités

- **Navigation horizontale immersive**  
  Défilement horizontal fluide géré par **GSAP ScrollTrigger** pour explorer les différentes sections du jeu.

- **Système d’inventaire**  
  Collecte et utilisation d’objets clés : clés, engrenages, bâtons, etc.

- **Énigmes interactives**  
  Mécanismes à réparer, portes à déverrouiller et interactions contextuelles.

- **Cinématiques dynamiques**  
  Vidéos plein écran synchronisées avec la progression : voyage en minecart, activation de mécanismes, générique final.

- **Ambiance sonore immersive**  
  Bande-son adaptative lancée au démarrage avec contrôleur de volume intégré.

- **Système de brouillard (Fog)**  
  Les zones du niveau se dévoilent uniquement après la résolution des énigmes précédentes, renforçant la progression visuelle.

---

##  Technologies utilisées

- **Framework** : Next.js 14+ (App Router)
- **Animations & Scroll** : GSAP (ScrollTrigger, Context)
- **Styling** : Tailwind CSS
- **Gestion d’état** : React Context API (inventaire)
- **Assets** : Images PNG et vidéos MP4 personnalisées

---

##  Installation et lancement

### 1. Cloner le dépôt

```bash
git clone https://github.com/votre-utilisateur/escape-game.git
cd escape-game
```

### 2. Installer les dépendances

```bash
npm install
# ou
yarn install
```

### 3. Lancer le serveur de développement

```bash
npm run dev
```

### 4. Accéder au jeu

Ouvrez votre navigateur à l’adresse :  
**http://localhost:3000**

---

##  Configuration du volume

Un contrôleur discret est disponible en bas à gauche de l’écran dès le lancement du jeu. Il permet d’ajuster le volume ou de couper totalement le son pour une expérience personnalisée.

---

## Contexte du projet

Projet développé pour un examen en 3ème année de BUT Métiers du Multimédia et de l'Internet.

---

