
// Configuration des prestations avec prix de base
const SERVICES_CONFIG = {
    'semi-permanent': {
        name: 'Semi-Permanent',
        basePrice: 35,
        urlSlug: 'semi-permanent'
    },
    'gainage': {
        name: 'Gainage',
        basePrice: 45,
        urlSlug: 'gainage'
    },
    'gel-x-sml': {
        name: 'Gel-X S/M/L',
        basePrice: 45,
        urlSlug: 'gel-x-sml'
    },
    'gel-x-xl': {
        name: 'Gel-X XL',
        basePrice: 50,
        urlSlug: 'gel-x-xl'
    }
};

// Configuration des niveaux de Nail Art (obligatoire)
const NIVEAU_CONFIG = {
    '1': { price: 10 },
    '2': { price: 15 },
    '3': { price: 20 },
    '4': { price: 25 },
    '5': { price: 30 }
};

// Configuration des options de dépose
const DEPOSE_CONFIG = {
    'depose': { price: 5 },
    'depose-exterieur': { price: 5 }, // Pour Gel-X uniquement
    'depose-seule': { price: 20 }
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
    updateDeposeOptions(service);
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

function updateDeposeOptions(service) {
    const deposeSelect = document.getElementById('depose');
    const deposeExterieureOption = deposeSelect.querySelector('option[value="depose-exterieur"]');
    
    // Mettre à jour le texte de l'option "Dépose Extérieur" selon le service
    if (service.includes('gel-x')) {
        deposeExterieureOption.textContent = 'Dépose Extérieur (+5€)';
    } else {
        deposeExterieureOption.textContent = 'Dépose Extérieur (à préciser lors du RDV)';
    }
}

function updateSummary() {
    const prixElement = document.getElementById('prix');

    if (!currentSelection.service) {
        prixElement.textContent = '-- €';
        return;
    }

    const service = SERVICES_CONFIG[currentSelection.service];
    let totalPrice = service.basePrice;

    // Ajouter le prix du niveau (obligatoire)
    if (currentSelection.niveau && NIVEAU_CONFIG[currentSelection.niveau]) {
        const niveauData = NIVEAU_CONFIG[currentSelection.niveau];
        totalPrice += niveauData.price;
    }

    // Ajouter le prix de la dépose
    if (currentSelection.depose && DEPOSE_CONFIG[currentSelection.depose]) {
        // Pour la dépose extérieure, ne pas ajouter le prix si ce n'est pas un service Gel-X
        if (currentSelection.depose === 'depose-exterieur' && !currentSelection.service.includes('gel-x')) {
            // Prix à préciser, on n'ajoute rien
        } else {
            const deposeData = DEPOSE_CONFIG[currentSelection.depose];
            totalPrice += deposeData.price;
        }
    }

    // Animation de mise à jour
    prixElement.classList.add('updating');

    setTimeout(() => {
        prixElement.textContent = `${totalPrice} €`;
        
        setTimeout(() => {
            prixElement.classList.remove('updating');
        }, 150);
    }, 150);
}

function updateBookingButton() {
    const bookingBtn = document.getElementById('bookingBtn');
    
    // Le bouton est activé seulement si un service et un niveau sont sélectionnés
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
        let deposeSlug = '';
        switch (currentSelection.depose) {
            case 'depose':
                deposeSlug = 'depose';
                break;
            case 'depose-exterieur':
                deposeSlug = 'depose-ext';
                break;
            case 'depose-seule':
                deposeSlug = 'depose-seule';
                break;
        }
        if (deposeSlug) {
            urlParts.push(deposeSlug);
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
        let deposeSlug = '';
        switch (currentSelection.depose) {
            case 'depose':
                deposeSlug = 'depose';
                break;
            case 'depose-exterieur':
                deposeSlug = 'depose-ext';
                break;
            case 'depose-seule':
                deposeSlug = 'depose-seule';
                break;
        }
        if (deposeSlug) {
            urlParts.push(deposeSlug);
        }
    }
    
    return baseUrl + urlParts.join('-');
}
