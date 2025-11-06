// Variables dynamiques pour la version 2.0

// ===== VARIABLES GLOBALES v2.0 =====
let currentFlaggerName = 'votre collègue vigilant'; // Nom par défaut
let flagData = {}; // Stockage temporaire des données du flag

// Variables pour le timer (globales pour être accessibles partout)
let timerInterval = null;
let startTime = null;

// ===== FONCTIONS GLOBALES v2.0 =====

/**
 * Envoie les données du flag au backend PHP
 * @param {Object} data - Données du flag à enregistrer
 */
function sendFlagToBackend(data) {
    // Vérifier si l'API est disponible (optionnel - mode dégradé)
    const apiUrl = 'api/save_flag.php';
    
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(result => {
        console.log('✅ Flag enregistré avec succès:', result);
        // Optionnel : afficher une notification discrète
    })
    .catch(error => {
        console.warn('⚠️ Impossible d\'enregistrer le flag (mode dégradé):', error);
        // L'application continue de fonctionner même si l'API est indisponible
    });
}

/**
 * Récupère le nom de l'ordinateur (simulation)
 * En JavaScript, on ne peut pas récupérer le vrai nom de l'ordinateur
 * On utilise plutôt des informations du navigateur
 */
function getComputerName() {
    // Essayer de récupérer un identifiant unique du navigateur
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    
    // Créer un identifiant basé sur le user agent (simplifié)
    const hash = userAgent.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
    }, 0);
    
    return `${platform}-${Math.abs(hash).toString(16).substring(0, 8).toUpperCase()}`;
}

/**
 * Fonction pour démarrer le chronomètre
 */
function startTimer() {
    const timerDisplay = document.getElementById('timerDisplay');
    const timerText = document.getElementById('timerText');
    
    if (timerInterval) return; // Empêche les multiples démarrages
    
    startTime = Date.now();
    if (timerDisplay) timerDisplay.style.display = 'block';
    
    timerInterval = setInterval(function() {
        const elapsed = Date.now() - startTime;
        const seconds = Math.floor(elapsed / 1000);
        const minutes = Math.floor(seconds / 60);
        const displaySeconds = seconds % 60;
        
        const formattedTime = 
            String(minutes).padStart(2, '0') + ':' + 
            String(displaySeconds).padStart(2, '0');
        
        if (timerText) timerText.textContent = formattedTime;
    }, 1000);
}

/**
 * Fonction pour arrêter le chronomètre et retourner le temps écoulé
 */
function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    // Calculer le temps écoulé en secondes
    if (startTime) {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        return elapsed;
    }
    return 0;
}

// ===== INITIALISATION DOMContentLoaded =====
document.addEventListener('DOMContentLoaded', function() {
    const timerDisplay = document.getElementById('timerDisplay');
    const timerText = document.getElementById('timerText');
    
    // ===== GESTION NOM PC (LocalStorage) v1.5 =====
    const inputComputerName = document.getElementById('inputComputerName');
    
    // Charger le nom PC sauvegardé
    if (inputComputerName) {
        const savedComputerName = localStorage.getItem('flag_computer_name');
        if (savedComputerName) {
            inputComputerName.value = savedComputerName;
            console.log('💻 Nom PC restauré:', savedComputerName);
        }
        
        // Sauvegarder automatiquement quand modifié
        inputComputerName.addEventListener('blur', function() {
            const computerName = inputComputerName.value.trim();
            if (computerName) {
                localStorage.setItem('flag_computer_name', computerName);
                console.log('💾 Nom PC sauvegardé:', computerName);
            }
        });
    }
    
    // START button logic
    const startBtn = document.getElementById('startBtn');
    const configPanel = document.querySelector('.config-panel');
    if (startBtn) {
        startBtn.addEventListener('click', function() {
            // ===== ENVOI AU BACKEND v2.0 =====
            // Récupérer toutes les données de configuration
            const inputFlagger = document.getElementById('inputFlagger');
            const inputTarget = document.getElementById('inputTarget');
            const inputCustomText = document.getElementById('inputCustomText');
            const mainColorInput = document.getElementById('mainColorInput');
            const inputSecurityCode = document.getElementById('inputSecurityCode');
            const toggleLock = document.getElementById('toggleLock');
            const inputComputerName = document.getElementById('inputComputerName');
            
            // Récupérer le nom PC (priorité: champ > LocalStorage > fallback)
            let computerName = '';
            if (inputComputerName && inputComputerName.value.trim()) {
                computerName = inputComputerName.value.trim();
                // Sauvegarder dans LocalStorage
                localStorage.setItem('flag_computer_name', computerName);
            } else {
                computerName = localStorage.getItem('flag_computer_name') || getComputerName();
            }
            
            // Préparer les données à envoyer
            flagData = {
                computer_name: computerName,
                flagger_name: inputFlagger ? inputFlagger.value.trim() || 'Anonyme' : 'Anonyme',
                target_name: inputTarget ? inputTarget.value.trim() || 'Inconnu' : 'Inconnu',
                message: inputCustomText ? inputCustomText.value.trim() : '',
                color: mainColorInput ? mainColorInput.value : '#007BD7',
                has_code: toggleLock ? toggleLock.checked : false,
                unlock_time_seconds: null // Sera mis à jour au déblocage
            };
            
            // Envoyer immédiatement au backend
            sendFlagToBackend(flagData);
            
            // Démarrer le chronomètre
            startTimer();
            
            // Plein écran
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            }
            // Masquer la config bar
            if (configPanel) configPanel.style.display = 'none';
        });
    }
    // Gestion de l'icône emoji
    const iconEmojiSelect = document.getElementById('iconEmojiSelect');
    const iconEmojiPreview = document.getElementById('iconEmojiPreview');
    const emojiBgPreview = document.getElementById('emoji-bg-preview');
    function setIconEmoji(val) {
        const emoji = val && val.trim() ? val.trim() : '';
        if (iconEmojiPreview) iconEmojiPreview.textContent = emoji;
        if (emojiBgPreview) {
            emojiBgPreview.textContent = emoji;
            // Si aucune icône, cacher complètement l'élément
            emojiBgPreview.style.display = emoji ? 'flex' : 'none';
        }
    }
    if (iconEmojiSelect) {
        iconEmojiSelect.addEventListener('change', function() {
            setIconEmoji(iconEmojiSelect.value);
        });
        // Valeur par défaut
        setIconEmoji(iconEmojiSelect.value);
    }
    // Gestion de la couleur principale
    const mainColorInput = document.getElementById('mainColorInput');
    const colorPalette = document.getElementById('colorPalette');
    const bsodContainer = document.querySelector('.bsod-container');
    
    function setMainColor(hex) {
        // Applique la couleur principale sur le body (ou root)
        document.documentElement.style.setProperty('--main-color', hex);
        if (mainColorInput) mainColorInput.value = hex.toUpperCase();
        // Applique au background de la page
        if (bsodContainer) {
            bsodContainer.style.backgroundColor = hex;
        }
        document.body.style.backgroundColor = hex;
    }
    // Palette boutons
    if (colorPalette) {
        colorPalette.querySelectorAll('.color-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                setMainColor(this.getAttribute('data-color'));
            });
        });
    }
    // Champ hexadécimal
    if (mainColorInput) {
        mainColorInput.addEventListener('input', function() {
            const val = mainColorInput.value;
            if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                setMainColor(val);
            }
        });
        // Valeur par défaut
        setMainColor(mainColorInput.value);
    }
    const inputFlagger = document.getElementById('inputFlagger');
    const flaggerName1 = document.getElementById('flaggerName1');
    const flaggerName2 = document.getElementById('flaggerName2');
    const toggleCustomText = document.getElementById('toggleCustomText');
    const inputCustomText = document.getElementById('inputCustomText');
    const customMessageDisplay = document.getElementById('customMessageDisplay');
    const selectReward = document.getElementById('selectReward');
    const rewardDisplay = document.getElementById('rewardDisplay');
    const rewardText = document.getElementById('rewardText');
    const toggleLock = document.getElementById('toggleLock');
    const inputSecurityCode = document.getElementById('inputSecurityCode');
    const unlockSection = document.getElementById('unlockSection');
    
    // Nom du collègue
    if (inputFlagger) {
        inputFlagger.addEventListener('input', function() {
            const name = inputFlagger.value.trim();
            currentFlaggerName = name ? name : 'votre collègue vigilant'; // Mise à jour globale
            if (flaggerName1) {
                flaggerName1.textContent = name ? name : 'Un collègue vigilant';
            }
            if (flaggerName2) {
                flaggerName2.textContent = name ? name : 'votre collègue';
            }
            // Met à jour le titre de la page
            document.title = name ? `Pris en Flag par ${name}` : 'Pris en Flag';
        });
    }
    
    // Message personnalisé
    if (inputCustomText && customMessageDisplay) {
        inputCustomText.addEventListener('input', function() {
            const message = inputCustomText.value.trim();
            customMessageDisplay.textContent = message;
            customMessageDisplay.style.display = message ? 'block' : 'none';
        });
    }
    
    // Récompense
    if (selectReward && rewardDisplay && rewardText) {
        selectReward.addEventListener('change', function() {
            const reward = selectReward.value.trim();
            if (reward) {
                rewardText.textContent = reward;
                rewardDisplay.style.display = 'block';
            } else {
                rewardDisplay.style.display = 'none';
            }
        });
        // Initialisation (caché par défaut car "Aucun" est sélectionné)
        rewardDisplay.style.display = 'none';
    }
    
    // Initialisation du titre
    document.title = 'Pris en Flag';

    // Gestion du verrouillage
    function updateLockState() {
        if (toggleLock && toggleLock.checked) {
            // Lock activé : afficher le champ code et la section débloquer
            if (inputSecurityCode) {
                inputSecurityCode.style.display = '';
            }
            if (unlockSection) {
                unlockSection.style.display = '';
            }
        } else {
            // Lock désactivé : cacher le champ code et la section débloquer
            if (inputSecurityCode) {
                inputSecurityCode.style.display = 'none';
            }
            if (unlockSection) {
                unlockSection.style.display = 'none';
            }
        }
    }
    
    if (toggleLock) {
        toggleLock.addEventListener('change', updateLockState);
        // Initialisation (désactivé par défaut)
        updateLockState();
    }
});
// --- 🚩 CONFIGURATION IMPORTANTE (À MODIFIER) ---

// L'URL de votre futur serveur (Backend) qui enregistrera l'événement de Flag
const URL_SERVEUR_LOG = "http://votre-serveur/api/enregistrer_flag"; 

// --- VARIABLES GLOBALES ---

let expectedCode = "RECOMPENSE"; // Code par défaut si l'URL ne fournit pas de code
let flaggerName = "Un Collègue Vigilant"; // Nom par défaut

// --- FONCTIONS LOGIQUES ---

function getUrlParameters() {
    /** Récupère les paramètres de l'URL et met à jour le contenu/code secret **/
    const urlParams = new URLSearchParams(window.location.search);
    
    // 1. Définition du Code Secret
    if (urlParams.has('code')) {
        const code = urlParams.get('code').trim().toUpperCase();
        expectedCode = code;
        const codeInput = document.getElementById('inputSecurityCode');
        if (codeInput) {
            codeInput.value = code;
        }
    }
    
    // 2. Définition du Nom du Flagger (pour le message de reward)
    if (urlParams.has('flagger')) {
        const name = urlParams.get('flagger').trim();
        flaggerName = name;
        currentFlaggerName = name;
        const nameInput = document.getElementById('flaggerName');
        if (nameInput) {
            nameInput.value = name;
        }
        // Mise à jour des affichages
        const flaggerSpans = document.querySelectorAll('.flagger-name');
        flaggerSpans.forEach(span => {
            span.textContent = name;
        });
    }
    
    // 3. Mise à jour du Message personnalisé
    const customMessageElement = document.getElementById('custom-message');
    if (urlParams.has('msg') && customMessageElement) {
        const msg = decodeURIComponent(urlParams.get('msg')); 
        customMessageElement.innerHTML = msg;
        const msgInput = document.getElementById('customMessage');
        if (msgInput) {
            msgInput.value = msg;
        }
    }
    
    // 4. Définition de l'Icône emoji
    if (urlParams.has('icon')) {
        const icon = decodeURIComponent(urlParams.get('icon'));
        const iconSelect = document.getElementById('iconEmojiSelect');
        if (iconSelect) {
            iconSelect.value = icon;
            // Déclencher manuellement l'update
            const emojiBgPreview = document.getElementById('emojiBgPreview');
            if (emojiBgPreview) {
                emojiBgPreview.textContent = icon;
                emojiBgPreview.style.display = icon ? 'flex' : 'none';
            }
        }
    }
    
    // 5. Définition de la Couleur de fond
    if (urlParams.has('color')) {
        const color = urlParams.get('color').toLowerCase();
        const colorMap = {
            'blue': '#0078d7',
            'red': '#e81123',
            'magenta': '#ff00ff',
            'green': '#00b300'
        };
        
        let hexColor;
        if (colorMap[color]) {
            // Couleur prédéfinie
            hexColor = colorMap[color];
        } else if (color.startsWith('#')) {
            // Code HEX avec #
            hexColor = color;
        } else if (/^[0-9a-f]{6}$/i.test(color)) {
            // Code HEX sans #
            hexColor = '#' + color;
        }
        
        if (hexColor) {
            // Appliquer la couleur
            document.documentElement.style.setProperty('--main-color', hexColor);
            const bsodContainer = document.querySelector('.bsod-container');
            if (bsodContainer) {
                bsodContainer.style.backgroundColor = hexColor;
            }
            document.body.style.backgroundColor = hexColor;
            
            // Mettre à jour l'input
            const mainColorInput = document.getElementById('mainColorInput');
            if (mainColorInput) {
                mainColorInput.value = hexColor.toUpperCase();
            }
        }
    }
    
    // 6. Définition de la Récompense
    if (urlParams.has('reward')) {
        const reward = decodeURIComponent(urlParams.get('reward'));
        const rewardSelect = document.getElementById('selectReward');
        const rewardDisplay = document.getElementById('rewardDisplay');
        const rewardText = document.getElementById('rewardText');
        
        if (rewardSelect) {
            rewardSelect.value = reward;
            // Appliquer visuellement
            if (reward && rewardText) {
                rewardText.textContent = reward;
                if (rewardDisplay) {
                    rewardDisplay.style.display = 'block';
                }
            } else {
                if (rewardDisplay) {
                    rewardDisplay.style.display = 'none';
                }
            }
        }
    }
    
    // 7. Définition de l'État du Verrouillage
    if (urlParams.has('lock')) {
        const lockValue = urlParams.get('lock').toLowerCase();
        const lockToggle = document.getElementById('toggleLock');
        if (lockToggle) {
            lockToggle.checked = (lockValue === 'true' || lockValue === '1' || lockValue === 'on');
            updateLockState();
        }
    }
}


function enterFullscreen() {
    /** Tente de mettre la page en plein écran pour maximiser l'effet de blocage **/
    const body = document.getElementById('bodyFlag');
    // Tente de mettre en plein écran avec les différentes méthodes de navigateur
    if (body.requestFullscreen) {
        body.requestFullscreen();
    } else if (body.mozRequestFullScreen) {
        body.mozRequestFullScreen();
    } else if (body.webkitRequestFullscreen) { 
        body.webkitRequestFullscreen();
    } else if (body.msRequestFullscreen) { 
        body.msRequestFullscreen();
    }
}


function checkCode() {
    /** Vérifie le code entré par l'utilisateur ciblé **/
    const codeInput = document.getElementById('codeInput');
    const codeEntré = codeInput.value.trim().toUpperCase();
    
    // Récupérer le code de sécurité défini dans la config bar
    const inputSecurityCode = document.getElementById('inputSecurityCode');
    const securityCode = inputSecurityCode ? inputSecurityCode.value.trim().toUpperCase() : '';
    
    // Si aucun code n'est défini dans la config, utiliser expectedCode (pour compatibilité URL)
    const codeAttendu = securityCode || expectedCode;

    // Vérification du code
    if (codeEntré === codeAttendu) { 
        // Code correct : Déblocage
        
        // ===== MISE À JOUR DU TEMPS DE DÉBLOCAGE v2.0 =====
        const unlockTime = stopTimer(); // Arrêter le timer et récupérer le temps
        
        // Mettre à jour les données du flag avec le temps de déblocage
        if (typeof sendFlagToBackend === 'function' && typeof flagData !== 'undefined') {
            flagData.unlock_time_seconds = unlockTime;
            // Renvoyer les données mises à jour au backend
            sendFlagToBackend(flagData);
        }
        
        // Récupérer le nom du flagger et la récompense
        const flaggerNameElement = document.getElementById('flaggerName1');
        const currentName = flaggerNameElement ? flaggerNameElement.textContent : 'votre collègue vigilant';
        const rewardTextElement = document.getElementById('rewardText');
        const currentReward = rewardTextElement ? rewardTextElement.textContent : '';
        
        // Construire le message de succès
        let successMessage = '✅ Félicitations ! Code correct.\nSession débloquée.\n\n';
        successMessage += `Votre collègue : ${currentName}`;
        if (currentReward) {
            successMessage += `\nmérite son reward : ${currentReward}`;
        }
        successMessage += `\n\nTemps écoulé : ${Math.floor(unlockTime / 60)}min ${unlockTime % 60}s`;
        
        // Afficher le message de succès
        showSuccessMessage(successMessage);
        
        // Fermeture après 3 secondes
        setTimeout(function() {
            if (window.opener) {
                window.close();
            } else {
                window.location.href = "about:blank"; 
            }
        }, 3000);

    } else {
        // Code incorrect : Afficher message sans sortir du plein écran
        // Récupérer le nom du flagger depuis la page
        const flaggerNameElement = document.getElementById('flaggerName1');
        const currentName = flaggerNameElement ? flaggerNameElement.textContent : 'votre collègue vigilant';
        
        // Créer un message d'erreur temporaire sur la page
        showErrorMessage(`❌ Code invalide. Contactez ${currentName}.`);
        
        codeInput.value = ''; 
        codeInput.focus();
    }
}

// Fonction pour afficher un message d'erreur sans alert (qui fait sortir du plein écran)
function showErrorMessage(message) {
    // Créer ou réutiliser un élément pour le message d'erreur
    let errorDiv = document.getElementById('errorMessage');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'errorMessage';
        errorDiv.style.position = 'fixed';
        errorDiv.style.top = '50%';
        errorDiv.style.left = '50%';
        errorDiv.style.transform = 'translate(-50%, -50%)';
        errorDiv.style.backgroundColor = 'rgba(232, 17, 35, 0.95)';
        errorDiv.style.color = '#fff';
        errorDiv.style.padding = '2em 3em';
        errorDiv.style.borderRadius = '8px';
        errorDiv.style.fontSize = '1.8vw';
        errorDiv.style.fontWeight = 'bold';
        errorDiv.style.zIndex = '10000';
        errorDiv.style.boxShadow = '0 8px 30px rgba(0,0,0,0.6)';
        errorDiv.style.textAlign = 'center';
        errorDiv.style.maxWidth = '80%';
        errorDiv.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        errorDiv.style.border = '3px solid #fff';
        document.body.appendChild(errorDiv);
    }
    
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    errorDiv.style.opacity = '0';
    errorDiv.style.transform = 'translate(-50%, -50%) scale(0.8)';
    
    // Animation d'apparition
    setTimeout(function() {
        errorDiv.style.opacity = '1';
        errorDiv.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);
    
    // Masquer après 3 secondes avec animation
    setTimeout(function() {
        errorDiv.style.opacity = '0';
        errorDiv.style.transform = 'translate(-50%, -50%) scale(0.8)';
        setTimeout(function() {
            errorDiv.style.display = 'none';
        }, 300);
    }, 3000);
}

// Fonction pour afficher un message de succès (même style mais en vert)
function showSuccessMessage(message) {
    // Créer ou réutiliser un élément pour le message de succès
    let successDiv = document.getElementById('successMessage');
    if (!successDiv) {
        successDiv = document.createElement('div');
        successDiv.id = 'successMessage';
        successDiv.style.position = 'fixed';
        successDiv.style.top = '50%';
        successDiv.style.left = '50%';
        successDiv.style.transform = 'translate(-50%, -50%)';
        successDiv.style.backgroundColor = 'rgba(40, 167, 69, 0.95)'; // Vert
        successDiv.style.color = '#fff';
        successDiv.style.padding = '2em 3em';
        successDiv.style.borderRadius = '8px';
        successDiv.style.fontSize = '1.6vw';
        successDiv.style.fontWeight = 'bold';
        successDiv.style.zIndex = '10000';
        successDiv.style.boxShadow = '0 8px 30px rgba(0,0,0,0.6)';
        successDiv.style.textAlign = 'center';
        successDiv.style.maxWidth = '80%';
        successDiv.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        successDiv.style.border = '3px solid #fff';
        successDiv.style.whiteSpace = 'pre-line'; // Permet les retours à la ligne
        successDiv.style.lineHeight = '1.5';
        document.body.appendChild(successDiv);
    }
    
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    successDiv.style.opacity = '0';
    successDiv.style.transform = 'translate(-50%, -50%) scale(0.8)';
    
    // Animation d'apparition
    setTimeout(function() {
        successDiv.style.opacity = '1';
        successDiv.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);
    
    // Pas de masquage automatique - on laisse 3 secondes avant la fermeture de la page
}

// Fonction d'enregistrement commentée pour le test local.
/*
function enregistrerFlag(success, flagger) {
    // Envoie l'information de faute au serveur (asynchrone)
    const data = {
        timestamp: new Date().toISOString(), 
        statut: success ? "FLAGGED_SUCCESS" : "FLAGGED_FAILED",
        code_secret: expectedCode,
        flagger_name: flagger,
    };

    fetch(URL_SERVEUR_LOG, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        console.log('Flag enregistré avec succès.');
    })
    .catch(error => {
        console.error('Erreur lors de l\'enregistrement du Flag:', error);
    });
}
*/


// --- DÉMARRAGE ET GESTION DES ÉVÉNEMENTS ---

window.onload = function() {
    getUrlParameters(); // Récupère les paramètres de l'URL
    enterFullscreen(); 
    document.getElementById('codeInput').focus();
    
    // Permet de valider en appuyant sur 'Entrée'
    document.getElementById('codeInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkCode();
        }
    });
    
    // ===== GESTION DE LA TOUCHE ÉCHAP v2.0 =====
    // Touche Échap : Arrête le chrono + Envoie les stats + Ferme la page
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) {
            // Arrêter le chronomètre et récupérer le temps écoulé
            const unlockTime = stopTimer();
            
            // Mettre à jour et envoyer les stats au backend
            if (typeof sendFlagToBackend === 'function' && typeof flagData !== 'undefined') {
                flagData.unlock_time_seconds = unlockTime;
                flagData.escaped = true; // Marqueur pour indiquer une sortie via Échap
                sendFlagToBackend(flagData);
            }
            
            // Fermer la page
            setTimeout(function() {
                if (window.opener) {
                    window.close();
                } else {
                    window.location.href = "about:blank";
                }
            }, 500); // Petit délai pour laisser l'envoi se terminer
        }
    });

    // Empêche le clic droit pour éviter l'accès facile aux outils de développement
    document.addEventListener('contextmenu', event => event.preventDefault());
};