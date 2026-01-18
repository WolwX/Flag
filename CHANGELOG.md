# Changelog - Flag

Toutes les modifications notables du projet Flag seront documentées dans ce fichier.

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
