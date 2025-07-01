
# Site de Réservation - Prothésie Ongulaire

## Description
Site web responsive pour un salon de prothésie ongulaire permettant aux clients de sélectionner leur prestation et de prendre rendez-vous facilement.

## Fonctionnalités
- **Sélection de prestations** : Gainage, Gel-X, Semi-Permanent
- **Configuration personnalisée** : Choix du niveau de difficulté et options de dépose
- **Calcul en temps réel** : Affichage automatique de la durée et du prix
- **Design responsive** : Optimisé pour mobile et desktop
- **Redirection automatique** : Vers votre système de réservation Cal.com

## Configuration

### Personnalisation des prestations
Dans le fichier `script.js`, modifiez la configuration `SERVICES_CONFIG` :

```javascript
const SERVICES_CONFIG = {
    gainage: {
        name: 'Gainage',
        baseDuration: 90,    // Durée de base en minutes
        basePrice: 45,       // Prix de base en euros
        urlSlug: 'gainage'   // Partie de l'URL pour Cal.com
    },
    // ... autres prestations
};
```

### Configuration des niveaux
Modifiez `NIVEAU_CONFIG` pour ajuster les suppléments :

```javascript
const NIVEAU_CONFIG = {
    '2': { duration: 40, price: 15 }, // +40min, +15€
    '3': { duration: 60, price: 25 }, // +60min, +25€
    // ... autres niveaux
};
```

### URLs Cal.com
Dans la fonction `redirectToBooking()`, modifiez l'URL de base :

```javascript
const baseUrl = 'https://cal.com/votre-identifiant/';
```

Les URLs générées suivront ce format :
- `https://cal.com/votre-identifiant/gainage-n2-depose`
- `https://cal.com/votre-identifiant/gel-x-n3`
- etc.

## Hébergement

### Netlify
1. Glissez-déposez le dossier du projet sur [netlify.com](https://netlify.com)
2. Votre site sera automatiquement déployé

### Vercel
1. Connectez votre repository GitHub à [vercel.com](https://vercel.com)
2. Le déploiement se fait automatiquement

### GitHub Pages
1. Créez un repository GitHub
2. Uploadez les fichiers
3. Activez GitHub Pages dans les paramètres

## Structure des fichiers
- `index.html` - Structure HTML principale
- `styles.css` - Styles CSS avec design responsive
- `script.js` - Logique JavaScript et calculs
- `README.md` - Documentation

## Personnalisation du design

### Couleurs
Les couleurs sont définies dans `:root` dans `styles.css` :

```css
:root {
    --primary-color: #E8B4B8;     /* Rose principal */
    --secondary-color: #F5D2D7;   /* Rose secondaire */
    --accent-color: #D4A5A5;      /* Rose accent */
    /* ... */
}
```

### Icônes
Les icônes emoji peuvent être remplacées dans `index.html` :

```html
<span class="service-icon">💅</span> <!-- Gainage -->
<span class="service-icon">✨</span> <!-- Gel-X -->
<span class="service-icon">🌸</span> <!-- Semi-Permanent -->
```

## Support
Pour toute question ou personnalisation, consultez la documentation ou contactez votre développeur.
