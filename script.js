
// Configuration des prestations avec prix et durées de base
const SERVICES_CONFIG = {
    gainage: {
        name: 'Gainage',
        baseDuration: 90,
        basePrice: 45,
        urlSlug: 'gainage'
    },
    'gel-x': {
        name: 'Gel-X',
        baseDuration: 120,
        basePrice: 60,
        urlSlug: 'gel-x'
    },
    'semi-permanent': {
        name: 'Semi-Permanent',
        baseDuration: 60,
        basePrice: 30,
        urlSlug: 'semi-permanent'
    }
};

// Configuration des niveaux (ajouts de temps et prix)
const NIVEAU_CONFIG = {
    '1': { duration: 0, price: 0 },
    '2': { duration: 40, price: 15 },
    '3': { duration: 60, price: 25 },
    '4': { duration: 80, price: 35 },
    '5': { duration: 100, price: 45 }
};

// Configuration des déposes
const DEPOSE_CONFIG = {
    'depose': { duration: 15, price: 5, urlSlug: 'depose' },
    'depose-exterieur': { duration: 20, price: 10, urlSlug: 'depose-ext' }
};

// Variables globales
let selectedService = null;
let selectedNiveau = null;
let selectedDepose = null;

// Éléments DOM
const serviceButtons = document.querySelectorAll('.service-btn');
const optionsSection = document.getElementById('options');
const niveauSelect = document.getElementById('niveau');
const deposeSelect = document.getElementById('depose');
const dureeDisplay = document.getElementById('duree');
const prixDisplay = document.getElementById('prix');
const bookingBtn = document.getElementById('bookingBtn');

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    console.log('Application initialisée');
});

function initializeEventListeners() {
    // Événements pour les boutons de service
    serviceButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const service = this.dataset.service;
            selectService(service);
        });
    });

    // Événements pour les sélecteurs
    niveauSelect.addEventListener('change', function() {
        selectedNiveau = this.value;
        updateCalculations();
        console.log('Niveau sélectionné:', selectedNiveau);
    });

    deposeSelect.addEventListener('change', function() {
        selectedDepose = this.value || null;
        updateCalculations();
        console.log('Dépose sélectionnée:', selectedDepose);
    });

    // Événement pour le bouton de réservation
    bookingBtn.addEventListener('click', function() {
        if (isFormValid()) {
            redirectToBooking();
        }
    });
}

function selectService(service) {
    selectedService = service;
    
    // Mettre à jour l'interface
    serviceButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelector(`[data-service="${service}"]`).classList.add('active');
    
    // Afficher la section des options
    optionsSection.style.display = 'block';
    optionsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Réinitialiser les sélections
    resetSelections();
    
    console.log('Service sélectionné:', service);
}

function resetSelections() {
    selectedNiveau = null;
    selectedDepose = null;
    niveauSelect.value = '';
    deposeSelect.value = '';
    
    updateCalculations();
}

function updateCalculations() {
    if (!selectedService) return;
    
    const service = SERVICES_CONFIG[selectedService];
    let totalDuration = service.baseDuration;
    let totalPrice = service.basePrice;
    
    // Ajouter les modifications du niveau
    if (selectedNiveau && NIVEAU_CONFIG[selectedNiveau]) {
        totalDuration += NIVEAU_CONFIG[selectedNiveau].duration;
        totalPrice += NIVEAU_CONFIG[selectedNiveau].price;
    }
    
    // Ajouter les modifications de la dépose
    if (selectedDepose && DEPOSE_CONFIG[selectedDepose]) {
        totalDuration += DEPOSE_CONFIG[selectedDepose].duration;
        totalPrice += DEPOSE_CONFIG[selectedDepose].price;
    }
    
    // Mettre à jour l'affichage avec animation
    updateDisplayWithAnimation(dureeDisplay, `${totalDuration} min`);
    updateDisplayWithAnimation(prixDisplay, `${totalPrice} €`);
    
    // Mettre à jour l'état du bouton
    updateBookingButton();
    
    console.log('Calculs mis à jour - Durée:', totalDuration, 'Prix:', totalPrice);
}

function updateDisplayWithAnimation(element, newValue) {
    element.classList.add('updating');
    
    setTimeout(() => {
        element.textContent = newValue;
        element.classList.remove('updating');
    }, 150);
}

function isFormValid() {
    return selectedService && selectedNiveau;
}

function updateBookingButton() {
    const isValid = isFormValid();
    bookingBtn.disabled = !isValid;
    
    if (isValid) {
        bookingBtn.style.opacity = '1';
        bookingBtn.style.cursor = 'pointer';
    } else {
        bookingBtn.style.opacity = '0.5';
        bookingBtn.style.cursor = 'not-allowed';
    }
}

function redirectToBooking() {
    if (!isFormValid()) {
        console.error('Formulaire invalide');
        return;
    }
    
    // Construire l'URL de redirection
    const baseUrl = 'https://cal.com/monid/'; // À personnaliser
    const service = SERVICES_CONFIG[selectedService].urlSlug;
    const niveau = `n${selectedNiveau}`;
    const depose = selectedDepose ? `-${DEPOSE_CONFIG[selectedDepose].urlSlug}` : '';
    
    const finalUrl = `${baseUrl}${service}-${niveau}${depose}`;
    
    console.log('Redirection vers:', finalUrl);
    
    // Effet visuel sur le bouton
    bookingBtn.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        // Redirection vers Cal.com
        window.open(finalUrl, '_blank');
        
        // Réinitialiser le bouton
        bookingBtn.style.transform = 'scale(1)';
    }, 200);
}

// Fonctions utilitaires pour le debugging
function getCurrentSelection() {
    return {
        service: selectedService,
        niveau: selectedNiveau,
        depose: selectedDepose,
        isValid: isFormValid()
    };
}

// Exposer pour le debugging en console
window.debugBooking = {
    getCurrentSelection,
    SERVICES_CONFIG,
    NIVEAU_CONFIG,
    DEPOSE_CONFIG
};
