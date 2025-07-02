
// Configuration des prestations avec prix de base
const SERVICES_CONFIG = {
    'semi-permanent': {
        name: 'Semi-Permanent',
        basePrice: 35,
        urlSlug: 'semi-permanent',
        requiresNailArt: true,
        requiresTaille: false
    },
    'gainage': {
        name: 'Gainage',
        basePrice: 45,
        urlSlug: 'gainage',
        requiresNailArt: true,
        requiresTaille: false
    },
    'gel-x': {
        name: 'Gel-X',
        basePrice: 45, // Prix de base pour S/M/L
        urlSlug: 'gel-x',
        requiresNailArt: true,
        requiresTaille: true
    },
    'depose-seule': {
        name: 'Dépose seule',
        basePrice: 20,
        urlSlug: 'depose-seule',
        requiresNailArt: false,
        requiresTaille: false
    }
};

// Configuration des tailles Gel-X
const TAILLE_CONFIG = {
    'sml': { price: 0, slug: 'sml' }, // Prix de base déjà inclus
    'xl': { price: 5, slug: 'xl' }    // +5€ par rapport au prix de base
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
    'depose': { price: 5 },
    'depose-exterieur': { price: 5 }
};

// État de l'application
let currentSelection = {
    service: null,
    taille: null,
    niveau: null,
    depose: null
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
        depose: null
    };

    // Mettre à jour l'interface
    updateServiceButtons(service);
    showOptions();
    resetOptions();
    updateOptionsVisibility(service);
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
    document.getElementById('taille').value = '';
    document.getElementById('niveau').value = '';
    document.getElementById('depose').value = '';
}

function updateOptionsVisibility(service) {
    const tailleGroup = document.getElementById('taille-group');
    const niveauGroup = document.getElementById('niveau-group');
    const deposeGroup = document.getElementById('depose-group');
    const serviceConfig = SERVICES_CONFIG[service];

    // Gestion de la sélection de taille (uniquement pour Gel-X)
    if (serviceConfig.requiresTaille) {
        tailleGroup.style.display = 'block';
    } else {
        tailleGroup.style.display = 'none';
    }

    if (serviceConfig.requiresNailArt) {
        // Prestations normales : niveau obligatoire, dépose optionnelle
        niveauGroup.style.display = 'block';
        deposeGroup.style.display = 'block';
        niveauGroup.querySelector('label').textContent = 'Nail Art Niveau (obligatoire)';
    } else {
        // Dépose seule : pas de niveau, pas de dépose supplémentaire
        niveauGroup.style.display = 'none';
        deposeGroup.style.display = 'none';
    }
}

function updateDeposeOptions(service) {
    const deposeSelect = document.getElementById('depose');
    const deposeExterieureOption = deposeSelect.querySelector('option[value="depose-exterieur"]');
    
    // Mettre à jour le texte de l'option "Dépose Extérieur" selon le service
    if (service === 'gel-x') {
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

    // Pour la dépose seule, prix fixe
    if (currentSelection.service === 'depose-seule') {
        totalPrice = 20;
    } else {
        // Ajouter le prix de la taille (pour Gel-X)
        if (service.requiresTaille && currentSelection.taille && TAILLE_CONFIG[currentSelection.taille]) {
            const tailleData = TAILLE_CONFIG[currentSelection.taille];
            totalPrice += tailleData.price;
        }

        // Ajouter le prix du niveau (obligatoire pour les autres prestations)
        if (currentSelection.niveau && NIVEAU_CONFIG[currentSelection.niveau]) {
            const niveauData = NIVEAU_CONFIG[currentSelection.niveau];
            totalPrice += niveauData.price;
        }

        // Ajouter le prix de la dépose
        if (currentSelection.depose && DEPOSE_CONFIG[currentSelection.depose]) {
            // Pour la dépose extérieure, ne pas ajouter le prix si ce n'est pas un service Gel-X
            if (currentSelection.depose === 'depose-exterieur' && currentSelection.service !== 'gel-x') {
                // Prix à préciser, on n'ajoute rien
            } else {
                const deposeData = DEPOSE_CONFIG[currentSelection.depose];
                totalPrice += deposeData.price;
            }
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
    const service = SERVICES_CONFIG[currentSelection.service];
    
    let isValid = false;
    
    if (currentSelection.service) {
        if (service.requiresNailArt) {
            // Pour les prestations normales, niveau obligatoire
            // + taille obligatoire si c'est Gel-X
            let niveauValid = currentSelection.niveau !== null && currentSelection.niveau !== '';
            let tailleValid = true;
            
            if (service.requiresTaille) {
                tailleValid = currentSelection.taille !== null && currentSelection.taille !== '';
            }
            
            isValid = niveauValid && tailleValid;
        } else {
            // Pour la dépose seule, pas de niveau requis
            isValid = true;
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
    
    // Vérifier les conditions de validation
    if (service.requiresNailArt && (!currentSelection.niveau || currentSelection.niveau === '')) {
        return;
    }
    
    if (service.requiresTaille && (!currentSelection.taille || currentSelection.taille === '')) {
        return;
    }

    // Construire l'URL pour Cal.com
    const baseUrl = 'https://cal.com/melbuleuse/'; // Remplacez par votre identifiant Cal.com
    
    let urlParts = [service.urlSlug];
    
    // Ajouter la taille si applicable (pour Gel-X)
    if (service.requiresTaille && currentSelection.taille) {
        const tailleData = TAILLE_CONFIG[currentSelection.taille];
        urlParts.push(tailleData.slug);
    }
    
    // Ajouter le niveau seulement si requis et sélectionné
    if (service.requiresNailArt && currentSelection.niveau) {
        urlParts.push(`n${currentSelection.niveau}`);
    }
    
    // Ajouter la dépose si sélectionnée (sauf pour dépose seule)
    if (currentSelection.service !== 'depose-seule' && currentSelection.depose) {
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
    
    // Vérifier les conditions de validation
    if (service.requiresNailArt && (!currentSelection.niveau || currentSelection.niveau === '')) {
        return null;
    }
    
    if (service.requiresTaille && (!currentSelection.taille || currentSelection.taille === '')) {
        return null;
    }

    const baseUrl = 'https://cal.com/melbuleuse/';
    
    let urlParts = [service.urlSlug];
    
    // Ajouter la taille si applicable (pour Gel-X)
    if (service.requiresTaille && currentSelection.taille) {
        const tailleData = TAILLE_CONFIG[currentSelection.taille];
        urlParts.push(tailleData.slug);
    }
    
    // Ajouter le niveau seulement si requis et sélectionné
    if (service.requiresNailArt && currentSelection.niveau) {
        urlParts.push(`n${currentSelection.niveau}`);
    }
    
    // Ajouter la dépose si sélectionnée (sauf pour dépose seule)
    if (currentSelection.service !== 'depose-seule' && currentSelection.depose) {
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
    
    return baseUrl + urlParts.join('-');
}
