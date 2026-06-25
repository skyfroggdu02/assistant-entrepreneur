# Assistant Entrepreneur

Application desktop pour le développement de tes entreprises (ArtBid & autres projets).

## Installation

### Prérequis
- [Node.js](https://nodejs.org/) (version 18 ou supérieure)

### Lancer l'application

```bash
# 1. Installer les dépendances
npm install

# 2. Démarrer l'application
npm start
```

Au premier lancement, l'app te demandera ta clé API Anthropic.
Tu peux en créer une sur : https://console.anthropic.com/settings/keys

La clé est stockée localement sur ton ordinateur (localStorage), elle ne transite nulle part ailleurs.

## Structure du projet

```
assistant-entrepreneur/
├── package.json
├── src/
│   ├── main.js       # Processus principal Electron
│   ├── preload.js    # Pont sécurisé IPC
│   └── index.html    # Interface utilisateur
└── assets/
    └── icon.png      # (optionnel) icône de l'app
```

## Personnalisation

Pour modifier le contexte de l'IA (tes projets, ton profil), édite le `system prompt` dans `src/main.js` à la ligne contenant `"Tu es un assistant expert..."`.

## Créer un exécutable (.exe / .app)

```bash
npm install --save-dev electron-builder
npx electron-builder build
```

L'exécutable sera généré dans le dossier `dist/`.
