
# Melbuleuse - Site de Réservation Prothésie Ongulaire

## Description
Site web responsive et élégant pour Melbuleuse, salon de prothésie ongulaire. Le design s'inspire harmonieusement du logo papillon aux tons violets, bleus et roses, créant une expérience visuelle cohérente et raffinée.

## Fonctionnalités
- **Logo intégré** : Affichage du logo Melbuleuse avec adaptation responsive
- **Design harmonisé** : Palette de couleurs inspirée du logo (violets, bleus, roses)
- **Sélection de prestations** : Gainage, Gel-X, Semi-Permanent
- **Configuration personnalisée** : Choix du niveau de difficulté et options de dépose
- **Calcul en temps réel** : Affichage automatique de la durée et du prix
- **Design responsive** : Optimisé pour mobile, tablette et desktop
- **Redirection automatique** : Vers votre système de réservation Cal.com
- **Animations fluides** : Transitions et effets visuels élégants

## Palette de couleurs
Le site utilise une palette inspirée du logo :
- **Violets** : #8B5CF6, #A78BFA, #C4B5FD
- **Bleus** : #3B82F6, #60A5FA, #93C5FD  
- **Roses** : #EC4899, #F472B6, #F9A8D4
- **Dégradés** : Combinaisons harmonieuses de ces couleurs

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
const baseUrl = 'https://cal.com/melbuleuse/';
```

Les URLs générées suivront ce format :
- `https://cal.com/melbuleuse/gainage-n2-depose`
- `https://cal.com/melbuleuse/gel-x-n3`
- etc.

## Optimisations Mobile
- **Tailles tactiles** : Boutons de minimum 48px pour faciliter la sélection
- **Typographie responsive** : Utilisation de clamp() pour des tailles adaptatives
- **Espacements fluides** : Marges et paddings qui s'adaptent à la taille d'écran
- **Navigation tactile** : Interactions optimisées pour les écrans tactiles
- **Animations réduites** : Respect des préférences utilisateur (prefers-reduced-motion)

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
- `index.html` - Structure HTML avec intégration du logo
- `styles.css` - Styles CSS avec design harmonisé et responsive
- `script.js` - Logique JavaScript et calculs
- `README.md` - Documentation

## Personnalisation du design

### Couleurs
Les couleurs sont définies dans `:root` dans `styles.css` :

```css
:root {
    --primary-purple: #8B5CF6;
    --secondary-purple: #A78BFA;
    --light-purple: #C4B5FD;
    --gradient-primary: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 50%, #EC4899 100%);
    /* ... */
}
```

### Typographie
Police principale : **Poppins** (Google Fonts)
- Poids disponibles : 300, 400, 500, 600, 700
- Fallback : -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto

### Effets visuels
- **Ombres douces** : Utilisation de box-shadow avec les couleurs du logo
- **Dégradés subtils** : Arrière-plans avec les couleurs harmonisées
- **Transitions fluides** : Animations avec cubic-bezier pour plus de fluidité
- **Backdrop-filter** : Effet de flou pour les éléments semi-transparents

## Accessibilité
- **Contraste** : Respect des standards WCAG pour la lisibilité
- **Navigation clavier** : Tous les éléments interactifs sont accessibles
- **ARIA labels** : Descriptions pour les lecteurs d'écran
- **Focus visible** : Indicateurs visuels pour la navigation clavier
- **Animations respectueuses** : Adaptation aux préférences utilisateur

## Support
Pour toute question ou personnalisation, consultez la documentation ou contactez votre développeur.

## Licence
© 2024 Melbuleuse. Tous droits réservés.
