# Changelog - Flag

Toutes les modifications notables du projet Flag seront documentées dans ce fichier.

## [1.4.1] - 2026-01-19

### ✨ Ajouté
- **Paramètre URL `delay`** : Contrôle du délai de fermeture automatique de la popup de succès
  - Valeur en **secondes** pour simplicité utilisateur
  - `flag.html` : délai par défaut de 3 secondes
  - `index.html` : délai par défaut de 0.3 secondes
  - Exemples : `?delay=5` (5 secondes), `?delay=0` (immédiat)
  - Conversion automatique en millisecondes en interne (delayValue * 1000)

### 🔧 Modifié
- **Variable globale `closeDelay`** : Initialisée à 3000ms (flag.html) et 300ms (index.html)
- **Fonction `getUrlParameters()`** (flag.html) : Lecture et validation du paramètre `delay` avec conversion en millisecondes
- **Fonction `simpleUnlock()`** (index.html) : Utilisation de `closeDelay` au lieu de valeur codée en dur
- **Commentaires code** : Mise à jour pour indiquer "secondes" au lieu de "millisecondes"

---

## [1.4.0] - 2026-01-19

### ✨ Ajouté
- **QR Code dynamique** : Changement automatique du QR code selon la couleur BSoD sélectionnée
  - 4 couleurs prédéfinies avec QR codes spécifiques : Blue (#0078D7), Red (#E81123), Magenta (#FF00FF), Green (#00B300)
  - QR code par défaut pour toutes les autres couleurs
  - 5 nouveaux fichiers QR : `qr-code-wx-{blue,red,magenta,green,defaut}.png`
- **Paramètre URL `popup_time`** : Personnalisation de la durée d'affichage des popups (en secondes)
  - Valeur par défaut : 3 secondes
  - Exemple : `?popup_time=5` pour afficher les popups pendant 5 secondes
- **Fonction `updateQRCode()`** : Gestion du mapping couleur → fichier QR code
- **Variable QR_CODE_BASE64** : QR code organisé en variable JavaScript pour meilleure maintenabilité

### 🔧 Modifié
- **`setMainColor()`** : Appelle maintenant `updateQRCode()` pour synchroniser le QR avec la couleur
- **`getUrlParameters()`** : Gère le paramètre `popup_time` et met à jour le QR code si couleur spécifiée en URL
- **Structure QR code** : Migration de `<img src="img/qr_code.png">` vers variable JavaScript + assignation au DOMContentLoaded
- **`popupDisplayTime`** : Variable globale configurable (3000ms par défaut, modifiable via URL)

### 📁 Fichiers ajoutés
- `img/qr-code-wx-blue.png`
- `img/qr-code-wx-red.png`
- `img/qr-code-wx-magenta.png`
- `img/qr-code-wx-green.png`
- `img/qr-code-wx-defaut.png`

---

## [1.3.0] - 2026-01-18

### ✨ Ajouté
- **Branding personnalisable** : Ligne de branding "Sensibilisation hygiène numérique by XR" avec lien cliquable
- **Emoji Unicode ℹ️** : Icône d'information en Unicode natif (pas de CDN Font Awesome pour version standalone)
- **Bouton déverrouillage simple** : Affichage conditionnel d'un bouton déverrouillage sans code quand lock désactivé
- **2 nouveaux paramètres URL** :
  - `client` : Personnalise le nom du client dans la ligne de branding
  - `brandingurl` : Personnalise l'URL du lien de branding (défaut: https://www.wolwx.net)

### 🐛 Corrigé
- **simpleUnlockSection visible au démarrage** : Le bouton n'apparaît plus au chargement initial, seulement après clic sur FLAG
- **updateLockState scope** : Fonction déplacée en portée globale (hors DOMContentLoaded) pour accessibilité
- **Toggle message perso** : Le message personnalisé se cache correctement quand la checkbox est décochée
- **Acceptation code vide** : Le système accepte maintenant un code vide pour déverrouillage sans code
- **Fermeture de page** : Harmonisation avec simpleUnlock() pour éviter about:blank
- **Fullscreen aléatoire** : Suppression de l'appel automatique enterFullscreen() au window.onload

### 🔧 Modifié
- **URL branding par défaut** : Changée de itdaqui.fr vers wolwx.net
- **Structure HTML branding** : Div au lieu de p dans code-defaillance pour meilleure sémantique
- **CSS branding** : Ajout styles .branding-line et .branding-icon (hover effect)

### 🧹 Nettoyage
- Suppression de toutes les références à "IT d'Aquí" ou "itdaqui" dans le code et l'historique Git
- Correction orthographique OBLI_VERROUILLAGE → OUBLI_VERROUILLAGE

---

## [1.2.0] - 2025-11-05

### ✨ Ajouté
- Version standalone minifiée `flag.html` (51 KB)
- Script de build `build_standalone_min.ps1`
- Fichier `.gitignore` pour éviter fichiers temporaires

### 🔧 Modifié
- Minification automatique CSS et JavaScript (réduction 20%)
- Nettoyage du projet (suppression fichiers temporaires)

---

## [1.1.0] - 2025-11-05

### ✨ Ajouté
- Support complet des paramètres URL (7 paramètres)
- URL dynamiques pour partage rapide
- Page de test `test_url_params.html` avec 12 exemples
- Documentation `EXEMPLES_URL.md`

### 🔧 Modifié
- Config Bar finalisée (6 sections)
- Chronomètre MM:SS
- 13 récompenses disponibles
- Palette étendue (4 couleurs + HEX)
- Messages validation stylisés

---

## [1.0.0] - 2025-10-30

### ✨ Ajouté (Version Initiale)
- Design BSoD Windows fidèle
- QR code intégré
- Saisie de code de sécurité
- Interface 2 colonnes (gauche/droite)
- Mode plein écran
- Config bar avec 6 sections
- Système de verrouillage
- Timer/chronomètre

---

## Format

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

Types de changements :
- `✨ Ajouté` pour les nouvelles fonctionnalités
- `🔧 Modifié` pour les changements aux fonctionnalités existantes
- `🐛 Corrigé` pour les corrections de bugs
- `🗑️ Supprimé` pour les fonctionnalités supprimées
- `🔒 Sécurité` pour les correctifs de sécurité
- `🧹 Nettoyage` pour le code cleanup
