# 🐍 Hidden Snake

Un jeu Snake secret caché dans une page web innocente. Activez-le avec le **Code Konami** ou un **appui long** !

## 📦 Installation

```bash
# Cloner ou copier le projet
cd hidden-snake

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Le site sera accessible sur `http://localhost:3000`

## 🚀 Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance le serveur de développement |
| `npm run build` | Compile le projet pour la production |
| `npm run preview` | Prévisualise la version de production |

## 🕵️ Méthodes d'activation secrètes

### 1. Code Konami (Desktop & Mobile)
Tapez la séquence suivante sur votre clavier :

```
↑ ↑ ↓ ↓ ← → ← → B A
```

Une barre de progression apparaît en haut de l'écran pour vous guider.

### 2. Appui long (Desktop & Mobile)
- Repérez la zone invisible en **bas à droite** de l'écran
- **Maintenez appuyé pendant 2 secondes**
- Un cercle de progression apparaît pendant l'appui

💡 *Astuce : Survolez la zone avec la souris pour voir un indice subtil*

## 🎮 Contrôles du jeu

### Sur Desktop (Clavier)

| Touche | Action |
|--------|--------|
| `↑` `↓` `←` `→` | Déplacer le serpent |
| `W` `A` `S` `D` | Déplacer le serpent (alternatif) |
| `Espace` | Pause / Démarrer |
| `P` | Pause |
| `R` | Redémarrer la partie |
| `Échap` | Fermer le jeu |

### Sur Mobile (Tactile)

- **D-Pad** : Boutons directionnels toujours visibles (↑ ↓ ← →)
- **Swipe** : Glissez dans une direction pour tourner
- **Bouton ⏸️** : Pause / Reprendre
- **Bouton 🔄** : Redémarrer
- **Bouton ✕** : Fermer le jeu
- **Bouton 🔊/🔇** : Activer/Désactiver le son

## 📊 Système de score

- **+10 points** par nourriture mangée
- Le **meilleur score** est sauvegardé automatiquement dans le `localStorage`
- Un effet spécial 🏆 apparaît lors d'un nouveau record !

### Données sauvegardées

| Clé localStorage | Description |
|------------------|-------------|
| `hidden_snake_high_score` | Meilleur score |
| `hidden_snake_sound_enabled` | Préférence sonore |
| `hidden_snake_games_played` | Nombre de parties jouées |

## 🎨 Fonctionnalités

### Gameplay
- ✅ Grille 20×20 cases
- ✅ Vitesse progressive (plus vous mangez, plus c'est rapide)
- ✅ Détection des collisions (murs et corps)
- ✅ Pause et reprise
- ✅ Redémarrage instantané

### Effets visuels
- ✅ Glow sur le serpent et la nourriture
- ✅ Particules lors de la consommation
- ✅ Animation du score
- ✅ Grille de fond animée

### Sons
- ✅ Son de manger (mélodie montante)
- ✅ Son de game over (mélodie descendante)
- ✅ Son de nouveau record (fanfare)
- ✅ Bouton mute global

### Accessibilité
- ✅ Labels ARIA sur tous les boutons
- ✅ Support `prefers-reduced-motion`
- ✅ Navigation au clavier complète
- ✅ Contraste suffisant

## 📁 Structure du projet

```
hidden-snake/
├── public/
│   └── snake.svg              # Favicon
├── src/
│   ├── components/
│   │   ├── HiddenSnake.jsx    # Jeu Snake principal
│   │   ├── LandingPage.jsx    # Page d'accueil
│   │   ├── MobileControls.jsx # Contrôles tactiles
│   │   ├── Modal.jsx          # Modal réutilisable
│   │   └── SecretActivator.jsx# Détection Konami/Long Press
│   ├── hooks/
│   │   ├── useKonamiCode.js   # Hook Code Konami
│   │   ├── useLongPress.js    # Hook appui long
│   │   ├── useMediaQuery.js   # Hook détection mobile
│   │   ├── useSnakeGame.js    # Logique du jeu Snake
│   │   └── useSwipeGesture.js # Hook gestes swipe
│   ├── styles/
│   │   └── index.css          # Styles Tailwind + custom
│   ├── utils/
│   │   ├── sounds.js          # Gestionnaire Web Audio
│   │   └── storage.js         # Gestion localStorage
│   ├── App.jsx                # Composant racine
│   └── main.jsx               # Point d'entrée
├── index.html
├── package.json
├── postcss.config.cjs
├── tailwind.config.cjs
├── vite.config.js
└── README.md
```

## 🛠️ Technologies utilisées

- **React 18** - Interface utilisateur
- **Vite** - Build tool ultra-rapide
- **Tailwind CSS** - Styles utilitaires
- **Web Audio API** - Sons synthétiques
- **Canvas API** - Rendu du jeu
- **localStorage** - Persistance des données

## 📱 Compatibilité

| Plateforme | Support |
|------------|---------|
| Chrome (Desktop) | ✅ Complet |
| Firefox (Desktop) | ✅ Complet |
| Safari (Desktop) | ✅ Complet |
| Chrome (Mobile) | ✅ Complet |
| Safari (iOS) | ✅ Complet |
| Samsung Internet | ✅ Complet |

## 🎯 Astuces de jeu

1. **Restez au centre** au début pour avoir plus de marge de manœuvre
2. **Anticipez** vos mouvements, le serpent ne peut pas faire demi-tour
3. **La vitesse augmente** à chaque nourriture - restez concentré !
4. **Les bords sont mortels** - pas de traversée de l'écran

## 📄 Licence

MIT - Libre d'utilisation et de modification.

---

Créé avec ❤️ et beaucoup de `requestAnimationFrame()`
