# Flag API v2.0 - Backend Documentation

## 📋 Vue d'ensemble

Backend PHP pour l'application Flag. Permet l'enregistrement et la récupération des statistiques de flags dans un fichier JSON.

---

## 📂 Structure

```
api/
├── save_flag.php           # Enregistre un nouveau flag
└── get_stats.php           # Récupère les statistiques

stats/
├── flags.json              # Fichier de stockage (JSON)
└── .htaccess               # Protection du dossier
```

---

## 🔌 API Endpoints

### 1. Enregistrer un flag

**Endpoint :** `POST /api/save_flag.php`

**Headers :**
```
Content-Type: application/json
```

**Body (JSON) :**
```json
{
  "computer_name": "PC-XAVIER",
  "flagger_name": "Alice",
  "target_name": "Xavier",
  "message": "bisous",
  "color": "007BD7",
  "has_code": true,
  "unlock_time_seconds": 45
}
```

**Champs requis :**
- `computer_name` (string) - Nom/ID de l'ordinateur
- `flagger_name` (string) - Nom de la personne qui crée le flag
- `target_name` (string) - Nom de la personne ciblée

**Champs optionnels :**
- `message` (string) - Message personnalisé
- `color` (string) - Couleur hexadécimale (sans #)
- `has_code` (boolean) - Si un code de sécurité est défini
- `unlock_time_seconds` (integer) - Temps de déblocage en secondes

**Réponse (Succès - 201) :**
```json
{
  "success": true,
  "message": "Flag saved successfully",
  "flag_id": 1,
  "timestamp": "2025-11-06T15:30:00+01:00"
}
```

**Réponse (Erreur - 400) :**
```json
{
  "error": "Validation Error",
  "message": "Field 'computer_name' is required"
}
```

---

### 2. Récupérer les statistiques

**Endpoint :** `GET /api/get_stats.php`

**Paramètres de requête (optionnels) :**
- `include_flags=true` - Inclure la liste des flags
- `limit=10` - Limiter le nombre de flags retournés

**Exemples d'appels :**
```
GET /api/get_stats.php
GET /api/get_stats.php?include_flags=true
GET /api/get_stats.php?include_flags=true&limit=50
```

**Réponse (Succès - 200) :**
```json
{
  "version": "2.0",
  "last_updated": "2025-11-06T15:30:00+01:00",
  "statistics": {
    "total_flags": 150,
    "unique_computers": 45,
    "unique_flaggers": 12,
    "unique_targets": 38,
    "average_unlock_time": 42.5,
    "top_flaggers": [
      {
        "name": "Alice",
        "count": 25,
        "last_flag": "2025-11-06T15:30:00+01:00"
      },
      {
        "name": "Bob",
        "count": 18,
        "last_flag": "2025-11-05T10:15:00+01:00"
      }
    ],
    "top_targets": [
      {
        "name": "Xavier",
        "count": 12,
        "last_flag": "2025-11-06T14:20:00+01:00"
      }
    ],
    "top_computers": [
      {
        "name": "PC-XAVIER",
        "count": 8,
        "last_flag": "2025-11-06T15:30:00+01:00"
      }
    ]
  },
  "flags": [
    {
      "id": 1,
      "timestamp": "2025-11-06T15:30:00+01:00",
      "computer_name": "PC-XAVIER",
      "flagger_name": "Alice",
      "target_name": "Xavier",
      "message": "bisous",
      "color": "007BD7",
      "has_code": true,
      "unlock_time_seconds": 45,
      "ip_address": "192.168.1.100"
    }
  ],
  "flags_count": 1
}
```

---

## 🔒 Sécurité

### Protection du fichier JSON

Le fichier `stats/.htaccess` bloque l'accès direct au fichier `flags.json` :

```apache
<FilesMatch "\.json$">
    Order Allow,Deny
    Deny from all
</FilesMatch>
```

### Verrouillage des fichiers

L'API utilise `flock()` pour éviter les écritures concurrentes :
- `LOCK_EX` (exclusif) pour l'écriture dans `save_flag.php`
- `LOCK_SH` (partagé) pour la lecture dans `get_stats.php`

### Sanitization

Toutes les données entrantes sont nettoyées avec `htmlspecialchars()` :
```php
function sanitize($value) {
    return htmlspecialchars(trim($value), ENT_QUOTES, 'UTF-8');
}
```

### CORS

Les headers CORS sont configurés pour autoriser les requêtes cross-origin :
```php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
```

---

## 📊 Structure du fichier JSON

Le fichier `stats/flags.json` contient :

```json
{
  "version": "2.0",
  "last_updated": "2025-11-06T15:30:00+01:00",
  "flags": [
    // Tableau de tous les flags enregistrés
  ],
  "statistics": {
    "total_flags": 0,
    "unique_computers": 0,
    "unique_flaggers": 0,
    "unique_targets": 0,
    "average_unlock_time": 0,
    "top_flaggers": [
      // Top 10 des personnes qui créent le plus de flags
    ],
    "top_targets": [
      // Top 10 des personnes les plus ciblées
    ],
    "top_computers": [
      // Top 10 des ordinateurs les plus flaggés
    ]
  }
}
```

### Calcul automatique des statistiques

Les statistiques sont recalculées à chaque enregistrement :
- **total_flags** : Nombre total de flags
- **unique_computers** : Nombre d'ordinateurs différents
- **unique_flaggers** : Nombre de flaggers différents
- **unique_targets** : Nombre de cibles différentes
- **average_unlock_time** : Temps moyen de déblocage (en secondes)
- **top_flaggers** : Top 10 des flaggers (trié par nombre décroissant)
- **top_targets** : Top 10 des cibles
- **top_computers** : Top 10 des ordinateurs

---

## 🧪 Tests

### Test de save_flag.php

**Avec cURL :**
```bash
curl -X POST http://localhost/flag/api/save_flag.php \
  -H "Content-Type: application/json" \
  -d '{
    "computer_name": "TEST-PC",
    "flagger_name": "TestUser",
    "target_name": "TestTarget",
    "message": "Test message",
    "color": "FF0000",
    "has_code": false
  }'
```

**Avec PowerShell :**
```powershell
$body = @{
    computer_name = "TEST-PC"
    flagger_name = "TestUser"
    target_name = "TestTarget"
    message = "Test message"
    color = "FF0000"
    has_code = $false
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost/flag/api/save_flag.php" -Method Post -Body $body -ContentType "application/json"
```

### Test de get_stats.php

**Avec navigateur :**
```
http://localhost/flag/api/get_stats.php?include_flags=true&limit=10
```

**Avec cURL :**
```bash
curl http://localhost/flag/api/get_stats.php?include_flags=true
```

---

## ⚙️ Configuration requise

- **PHP** : 7.0 ou supérieur
- **Modules PHP** :
  - `json` (généralement inclus)
  - `fileinfo` (optionnel)
- **Permissions fichiers** :
  - `stats/flags.json` : lecture/écriture (0666 ou 0644)
  - `stats/` : lecture/exécution (0755)

### Permissions recommandées

```bash
chmod 755 api/
chmod 644 api/*.php
chmod 755 stats/
chmod 666 stats/flags.json
chmod 644 stats/.htaccess
```

---

## 🚨 Dépannage

### Erreur : "Storage file not found"
- Vérifier que `stats/flags.json` existe
- Vérifier les chemins dans les scripts PHP

### Erreur : "Cannot lock storage file"
- Vérifier les permissions du fichier JSON
- S'assurer que le serveur web peut écrire dans `stats/`

### Erreur : "Parse Error"
- Le fichier JSON est corrompu
- Restaurer depuis une sauvegarde ou réinitialiser :
  ```json
  {
    "version": "2.0",
    "last_updated": null,
    "flags": [],
    "statistics": {
      "total_flags": 0,
      "unique_computers": 0,
      "unique_flaggers": 0,
      "unique_targets": 0,
      "average_unlock_time": 0,
      "top_flaggers": [],
      "top_targets": [],
      "top_computers": []
    }
  }
  ```

### CORS Error
- Vérifier que les headers CORS sont bien définis
- Pour développement local, désactiver temporairement CORS dans le navigateur

---

## 📝 Changelog

### v2.0 (06/11/2025)
- 🎉 Release initiale du backend
- 📦 Enregistrement des flags dans fichier JSON
- 📊 Calcul automatique des statistiques
- 🔒 Verrouillage fichier avec `flock()`
- 🛡️ Protection du dossier stats avec `.htaccess`
- 🌐 Support CORS pour requêtes cross-origin

---

## 📞 Support

Pour toute question ou problème :
- **GitHub** : [github.com/WolwX/Flag](https://github.com/WolwX/Flag)
- **Documentation** : Voir `docs/PROJECT_REFERENCE`

---

**© 2025 WolwX - Flag v2.0 Backend**
