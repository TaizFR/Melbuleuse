
// Configuration des prestations avec prix de base et durées
const SERVICES_CONFIG = {
    'semi-permanent': {
        name: 'Semi-Permanent',
        basePrice: 35,
        urlSlug: 'semi-permanent',
        requiresNailArt: true,
        requiresTaille: false,
        durations: {
            '1': 90, // 1h30
            '2': 105, // 1h45
            '3': 120, // 2h00
            '4': 135, // 2h15
            '5': 150  // 2h30
        }
    },
    'gainage': {
        name: 'Gainage',
        basePrice: 45,
        urlSlug: 'gainage',
        requiresNailArt: true,
        requiresTaille: false,
        durations: {
            '1': 100, // 1h40
            '2': 110, // 1h50
            '3': 130, // 2h10
            '4': 150, // 2h30
            '5': 170  // 2h50
        }
    },
    'gel-x': {
        name: 'Gel-X',
        basePrice: 45, // Prix de base pour S/M/L
        urlSlug: 'gel-x',
        requiresNailArt: true,
        requiresTaille: true,
        durations: {
            '1': 100, // 1h40
            '2': 120, // 2h00
            '3': 135, // 2h15
            '4': 160, // 2h40
            '5': 180  // 3h00
        }
    },
    'depose-seule': {
        name: 'Dépose seule',
        basePrice: 20,
        urlSlug: 'depose-seule',
        requiresNailArt: false,
        requiresTaille: false,
        durations: {
            'melbuleuse': 30,
            'exterieur': 45
        }
    }
};

// Configuration des tailles Gel-X
const TAILLE_CONFIG = {
    'sml': { price: 0, slug: 'sml', extraTime: 0 }, // Prix de base déjà inclus
    'xl': { price: 5, slug: 'xl', extraTime: 15 }    // +5€ et +15 min
};

// Configuration des niveaux de Nail Art
const NIVEAU_CONFIG = {
    '1': { price: 10 },
    '2': { price: 15 },
    '3': { price: 20 },
    '4': { price: 25 },
    '5': { price: 30 }
};

// Configuration des options de dépose
const DEPOSE_CONFIG = {
    'depose': { price: 5, time: 30 },
    'depose-exterieur': { price: 10, time: 45 }
};

// État de l'application
let currentSelection = {
    service: null,
    taille: null,
    niveau: null,
    depose: null,
    deposeSeuleType: null
};

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    const serviceButtons = document.querySelectorAll('.service-btn');
    const tailleSelect = document.getElementById('taille');
    const niveauSelect = document.getElementById('niveau');
    const deposeSelect = document.getElementById('depose');
    const deposeSeuleTypeSelect = document.getElementById('depose-seule-type');
    const bookingBtn = document.getElementById('bookingBtn');

    // Gestion des boutons de service
    serviceButtons.forEach(button => {
        button.addEventListener('click', function() {
            const service = this.getAttribute('data-service');
            selectService(service);
        });
    });

    // Gestion du menu taille
    tailleSelect.addEventListener('change', function() {
        currentSelection.taille = this.value;
        updateSummary();
        updateBookingButton();
    });

    // Gestion du menu niveau
    niveauSelect.addEventListener('change', function() {
        currentSelection.niveau = this.value;
        updateSummary();
        updateBookingButton();
    });

    // Gestion du menu dépose
    deposeSelect.addEventListener('change', function() {
        currentSelection.depose = this.value;
        updateSummary();
        updateBookingButton();
    });

    // Gestion du menu dépose seule type
    deposeSeuleTypeSelect.addEventListener('change', function() {
        currentSelection.deposeSeuleType = this.value;
        updateSummary();
        updateBookingButton();
    });

    // Gestion du bouton de réservation
    bookingBtn.addEventListener('click', function() {
        if (!this.disabled) {
            redirectToBooking();
        }
    });
}

function selectService(service) {
    // Réinitialiser la sélection
    currentSelection = {
        service: service,
        taille: null,
        niveau: null,
        depose: null,
        deposeSeuleType: null
    };

    // Mettre à jour l'interface
    updateServiceButtons(service);
    showOptions();
    resetOptions();
    updateOptionsVisibility(service);
    updateSummary();
    updateBookingButton();
}

function updateServiceButtons(selectedService) {
    const serviceButtons = document.querySelectorAll('.service-btn');
    serviceButtons.forEach(button => {
        const service = button.getAttribute('data-service');
        if (service === selectedService) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

function showOptions() {
    const optionsSection = document.getElementById('options');
    optionsSection.style.display = 'block';
    
    // Animation d'apparition
    setTimeout(() => {
        optionsSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }, 100);
}

function resetOptions() {
    document.getElementById('taille').value = '';
    document.getElementById('niveau').value = '';
    document.getElementById('depose').value = '';
    document.getElementById('depose-seule-type').value = '';
}

function updateOptionsVisibility(service) {
    const tailleGroup = document.getElementById('taille-group');
    const niveauGroup = document.getElementById('niveau-group');
    const deposeGroup = document.getElementById('depose-group');
    const deposeSeuleGroup = document.getElementById('depose-seule-group');
    const serviceConfig = SERVICES_CONFIG[service];

    // Masquer tous les groupes d'options spéciales
    tailleGroup.style.display = 'none';
    niveauGroup.style.display = 'none';
    deposeGroup.style.display = 'none';
    deposeSeuleGroup.style.display = 'none';

    if (service === 'depose-seule') {
        // Pour la dépose seule, afficher uniquement le type de dépose
        deposeSeuleGroup.style.display = 'block';
    } else {
        // Pour les autres prestations
        if (serviceConfig.requiresTaille) {
            tailleGroup.style.display = 'block';
        }
        
        if (serviceConfig.requiresNailArt) {
            niveauGroup.style.display = 'block';
            deposeGroup.style.display = 'block';
        }
    }
}

function updateSummary() {
    const prixElement = document.getElementById('prix');
    const dureeElement = document.getElementById('duree');

    if (!currentSelection.service) {
        prixElement.textContent = '-- €';
        dureeElement.textContent = '--';
        return;
    }

    const service = SERVICES_CONFIG[currentSelection.service];
    let totalPrice = service.basePrice;
    let totalTime = 0;

    if (currentSelection.service === 'depose-seule') {
        // Pour la dépose seule
        totalPrice = 20;
        if (currentSelection.deposeSeuleType && service.durations[currentSelection.deposeSeuleType]) {
            totalTime = service.durations[currentSelection.deposeSeuleType];
        }
    } else {
        // Pour les autres prestations
        
        // Calcul du temps de base selon le niveau
        if (currentSelection.niveau && service.durations[currentSelection.niveau]) {
            totalTime = service.durations[currentSelection.niveau];
        }

        // Ajouter le prix de la taille (pour Gel-X)
        if (service.requiresTaille && currentSelection.taille && TAILLE_CONFIG[currentSelection.taille]) {
            const tailleData = TAILLE_CONFIG[currentSelection.taille];
            totalPrice += tailleData.price;
            totalTime += tailleData.extraTime;
        }

        // Ajouter le prix du niveau (obligatoire pour les autres prestations)
        if (currentSelection.niveau && NIVEAU_CONFIG[currentSelection.niveau]) {
            const niveauData = NIVEAU_CONFIG[currentSelection.niveau];
            totalPrice += niveauData.price;
        }

        // Ajouter le prix et le temps de la dépose
        if (currentSelection.depose && DEPOSE_CONFIG[currentSelection.depose]) {
            const deposeData = DEPOSE_CONFIG[currentSelection.depose];
            totalPrice += deposeData.price;
            totalTime += deposeData.time;
        }
    }

    // Animation de mise à jour du prix
    prixElement.classList.add('updating');
    setTimeout(() => {
        prixElement.textContent = `${totalPrice} €`;
        setTimeout(() => {
            prixElement.classList.remove('updating');
        }, 150);
    }, 150);

    // Mise à jour de la durée
    if (totalTime > 0) {
        const hours = Math.floor(totalTime / 60);
        const minutes = totalTime % 60;
        let timeText = '';
        
        if (hours > 0) {
            timeText += `${hours}h`;
            if (minutes > 0) {
                timeText += `${minutes.toString().padStart(2, '0')}`;
            }
        } else {
            timeText = `${minutes} min`;
        }
        
        dureeElement.textContent = timeText;
    } else {
        dureeElement.textContent = '--';
    }
}

function updateBookingButton() {
    const bookingBtn = document.getElementById('bookingBtn');
    const service = SERVICES_CONFIG[currentSelection.service];
    
    let isValid = false;
    
    if (currentSelection.service) {
        if (currentSelection.service === 'depose-seule') {
            // Pour la dépose seule, vérifier que le type est sélectionné
            isValid = currentSelection.deposeSeuleType !== null && currentSelection.deposeSeuleType !== '';
        } else if (service.requiresNailArt) {
            // Pour les prestations normales, niveau obligatoire
            // + taille obligatoire si c'est Gel-X
            let niveauValid = currentSelection.niveau !== null && currentSelection.niveau !== '';
            let tailleValid = true;
            
            if (service.requiresTaille) {
                tailleValid = currentSelection.taille !== null && currentSelection.taille !== '';
            }
            
            isValid = niveauValid && tailleValid;
        }
    }
    
    bookingBtn.disabled = !isValid;
    
    if (isValid) {
        bookingBtn.classList.add('active');
    } else {
        bookingBtn.classList.remove('active');
    }
}

function redirectToBooking() {
    if (!currentSelection.service) {
        return;
    }

    const service = SERVICES_CONFIG[currentSelection.service];
    
    // Vérifications de validation
    if (currentSelection.service === 'depose-seule') {
        if (!currentSelection.deposeSeuleType || currentSelection.deposeSeuleType === '') {
            return;
        }
    } else {
        if (service.requiresNailArt && (!currentSelection.niveau || currentSelection.niveau === '')) {
            return;
        }
        
        if (service.requiresTaille && (!currentSelection.taille || currentSelection.taille === '')) {
            return;
        }
    }

    // Construire l'URL pour Cal.com
    const baseUrl = 'https://cal.com/melbuleuse/'; // Remplacez par votre identifiant Cal.com
    
    let urlParts = [service.urlSlug];
    
    if (currentSelection.service === 'depose-seule') {
        // Pour la dépose seule, ajouter le type
        urlParts.push(currentSelection.deposeSeuleType);
    } else {
        // Pour les autres prestations
        
        // Ajouter la taille si applicable (pour Gel-X)
        if (service.requiresTaille && currentSelection.taille) {
            const tailleData = TAILLE_CONFIG[currentSelection.taille];
            urlParts.push(tailleData.slug);
        }
        
        // Ajouter le niveau seulement si requis et sélectionné
        if (service.requiresNailArt && currentSelection.niveau) {
            urlParts.push(`n${currentSelection.niveau}`);
        }
        
        // Ajouter la dépose si sélectionnée
        if (currentSelection.depose) {
            let deposeSlug = '';
            switch (currentSelection.depose) {
                case 'depose':
                    deposeSlug = 'depose';
                    break;
                case 'depose-exterieur':
                    deposeSlug = 'depose-ext';
                    break;
            }
            if (deposeSlug) {
                urlParts.push(deposeSlug);
            }
        }
    }
    
    const finalUrl = baseUrl + urlParts.join('-');
    
    // Redirection vers Cal.com
    window.open(finalUrl, '_blank');
}

// Fonction utilitaire pour le debug (optionnelle)
function logCurrentSelection() {
    console.log('Sélection actuelle:', currentSelection);
    console.log('URL générée:', generateBookingUrl());
}

function generateBookingUrl() {
    if (!currentSelection.service) {
        return null;
    }

    const service = SERVICES_CONFIG[currentSelection.service];
    
    // Vérifications de validation
    if (currentSelection.service === 'depose-seule') {
        if (!currentSelection.deposeSeuleType || currentSelection.deposeSeuleType === '') {
            return null;
        }
    } else {
        if (service.requiresNailArt && (!currentSelection.niveau || currentSelection.niveau === '')) {
            return null;
        }
        
        if (service.requiresTaille && (!currentSelection.taille || currentSelection.taille === '')) {
            return null;
        }
    }

    const baseUrl = 'https://cal.com/melbuleuse/';
    
    let urlParts = [service.urlSlug];
    
    if (currentSelection.service === 'depose-seule') {
        urlParts.push(currentSelection.deposeSeuleType);
    } else {
        // Ajouter la taille si applicable (pour Gel-X)
        if (service.requiresTaille && currentSelection.taille) {
            const tailleData = TAILLE_CONFIG[currentSelection.taille];
            urlParts.push(tailleData.slug);
        }
        
        // Ajouter le niveau seulement si requis et sélectionné
        if (service.requiresNailArt && currentSelection.niveau) {
            urlParts.push(`n${currentSelection.niveau}`);
        }
        
        // Ajouter la dépose si sélectionnée
        if (currentSelection.depose) {
            let deposeSlug = '';
            switch (currentSelection.depose) {
                case 'depose':
                    deposeSlug = 'depose';
                    break;
                case 'depose-exterieur':
                    deposeSlug = 'depose-ext';
                    break;
            }
            if (deposeSlug) {
                urlParts.push(deposeSlug);
            }
        }
    }
    
    return baseUrl + urlParts.join('-');
}
