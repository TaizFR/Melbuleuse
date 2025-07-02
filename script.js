
// Configuration des prestations avec prix et durées
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
        basePrice: 35,
        urlSlug: 'semi-permanent'
    }
};

// Configuration des niveaux (supplément de temps et prix)
const NIVEAU_CONFIG = {
    '1': { duration: 0, price: 0 },
    '2': { duration: 40, price: 15 },
    '3': { duration: 60, price: 25 },
    '4': { duration: 80, price: 35 },
    '5': { duration: 100, price: 45 }
};

// Configuration des options de dépose
const DEPOSE_CONFIG = {
    'depose': { duration: 15, price: 5 },
    'depose-exterieur': { duration: 20, price: 10 }
};

// État de l'application
let currentSelection = {
    service: null,
    niveau: null,
    depose: null
};

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    const serviceButtons = document.querySelectorAll('.service-btn');
    const niveauSelect = document.getElementById('niveau');
    const deposeSelect = document.getElementById('depose');
    const bookingBtn = document.getElementById('bookingBtn');

    // Gestion des boutons de service
    serviceButtons.forEach(button => {
        button.addEventListener('click', function() {
            const service = this.getAttribute('data-service');
            selectService(service);
        });
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
        niveau: null,
        depose: null
    };

    // Mettre à jour l'interface
    updateServiceButtons(service);
    showOptions();
    resetOptions();
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
    document.getElementById('niveau').value = '';
    document.getElementById('depose').value = '';
}

function updateSummary() {
    const dureeElement = document.getElementById('duree');
    const prixElement = document.getElementById('prix');

    if (!currentSelection.service) {
        dureeElement.textContent = '-- min';
        prixElement.textContent = '-- €';
        return;
    }

    const service = SERVICES_CONFIG[currentSelection.service];
    let totalDuration = service.baseDuration;
    let totalPrice = service.basePrice;

    // Ajouter le supplément du niveau
    if (currentSelection.niveau && NIVEAU_CONFIG[currentSelection.niveau]) {
        const niveauData = NIVEAU_CONFIG[currentSelection.niveau];
        totalDuration += niveauData.duration;
        totalPrice += niveauData.price;
    }

    // Ajouter le supplément de la dépose
    if (currentSelection.depose && DEPOSE_CONFIG[currentSelection.depose]) {
        const deposeData = DEPOSE_CONFIG[currentSelection.depose];
        totalDuration += deposeData.duration;
        totalPrice += deposeData.price;
    }

    // Animation de mise à jour
    dureeElement.classList.add('updating');
    prixElement.classList.add('updating');

    setTimeout(() => {
        dureeElement.textContent = `${totalDuration} min`;
        prixElement.textContent = `${totalPrice} €`;
        
        setTimeout(() => {
            dureeElement.classList.remove('updating');
            prixElement.classList.remove('updating');
        }, 150);
    }, 150);
}

function updateBookingButton() {
    const bookingBtn = document.getElementById('bookingBtn');
    
    // Le bouton est activé si un service et un niveau sont sélectionnés
    const isValid = currentSelection.service && currentSelection.niveau;
    
    bookingBtn.disabled = !isValid;
    
    if (isValid) {
        bookingBtn.classList.add('active');
    } else {
        bookingBtn.classList.remove('active');
    }
}

function redirectToBooking() {
    if (!currentSelection.service || !currentSelection.niveau) {
        return;
    }

    // Construire l'URL pour Cal.com
    const baseUrl = 'https://cal.com/melbuleuse/'; // Remplacez par votre identifiant Cal.com
    const service = SERVICES_CONFIG[currentSelection.service];
    
    let urlParts = [service.urlSlug];
    
    // Ajouter le niveau
    if (currentSelection.niveau) {
        urlParts.push(`n${currentSelection.niveau}`);
    }
    
    // Ajouter la dépose si sélectionnée
    if (currentSelection.depose) {
        const deposeSlug = currentSelection.depose === 'depose' ? 'depose' : 'depose-ext';
        urlParts.push(deposeSlug);
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
    if (!currentSelection.service || !currentSelection.niveau) {
        return null;
    }

    const baseUrl = 'https://cal.com/melbuleuse/';
    const service = SERVICES_CONFIG[currentSelection.service];
    
    let urlParts = [service.urlSlug];
    
    if (currentSelection.niveau) {
        urlParts.push(`n${currentSelection.niveau}`);
    }
    
    if (currentSelection.depose) {
        const deposeSlug = currentSelection.depose === 'depose' ? 'depose' : 'depose-ext';
        urlParts.push(deposeSlug);
    }
    
    return baseUrl + urlParts.join('-');
}
