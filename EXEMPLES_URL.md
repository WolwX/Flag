# 🔗 Exemples d'URLs avec Paramètres - Flag v1.0

Ce document contient des exemples d'URLs prêts à l'emploi pour tester et utiliser tous les paramètres disponibles.

---

## 📋 Paramètres Disponibles

| Paramètre | Description | Valeurs |
|-----------|-------------|---------|
| `code` | Code de sécurité | Texte libre |
| `flagger` | Nom du flagger | Texte libre |
| `msg` | Message personnalisé | Texte (encoder espaces avec `%20`) |
| `icon` | Icône emoji | Voir liste ci-dessous |
| `color` | Couleur de fond | `blue`, `red`, `magenta`, `green`, ou HEX |
| `reward` | Récompense | Voir liste ci-dessous |
| `lock` | Verrouillage | `true`, `false`, `1`, `0` |

---

## 🎯 Exemples Simples

### Code uniquement
```
index.html?code=SEC2024
```

### Code + Nom
```
index.html?code=FLAG123&flagger=Jean
```

### Code + Nom + Message
```
index.html?code=ALERT&flagger=Marie&msg=Ne%20cliquez%20pas%20sur%20les%20liens%20suspects!
```

---

## 🎨 Exemples Visuels

### Flag bleu Windows
```
index.html?icon=🚩&color=blue&msg=Poste%20verrouillé
```

### Smiley vert positif
```
index.html?icon=😊&color=green&msg=Bravo%20pour%20votre%20vigilance!
```

### Alert rouge avec warning
```
index.html?icon=⚠️&color=red&msg=Tentative%20de%20phishing%20détectée!
```

### Couleur personnalisée (Orange)
```
index.html?icon=🏆&color=ff5733&msg=Champion%20de%20la%20sécurité
```

### Magenta avec pizza
```
index.html?icon=🍕&color=magenta&msg=Pizza%20Friday!
```

---

## 🏆 Exemples avec Récompenses

### Café offert
```
index.html?code=COFFEE2024&flagger=Sophie&reward=Café&icon=☕&color=6f4e37
```

### Pizza pour l'équipe
```
index.html?code=PIZZA&flagger=Marc&reward=Pizza&icon=🍕&color=red&msg=Merci%20pour%20votre%20vigilance!
```

### Câlin mérité
```
index.html?code=HUG&flagger=Emma&reward=Câlin&icon=🤗&color=ff69b4
```

### Bière en terrasse
```
index.html?code=BEER123&flagger=Thomas&reward=Bière&icon=🍺&color=ffa500
```

### Service rendu
```
index.html?code=SERVICE&flagger=Équipe%20IT&reward=Service&icon=🤝&color=0078d7
```

---

## 🔒 Exemples avec Lock

### Lock activé avec code
```
index.html?code=SECURE2024&flagger=Admin&lock=true
```

### Lock désactivé (pas de déblocage)
```
index.html?code=DEMO&flagger=Formateur&lock=false&msg=Démonstration%20seulement
```

### Formation avec lock
```
index.html?code=TRAINING&flagger=RH&lock=true&msg=Session%20de%20formation%20complétée&icon=📚&color=blue
```

---

## 🚀 Configuration Complète (Tous les paramètres)

### Exemple Entreprise
```
index.html?code=COMPANY2024&flagger=Équipe%20Sécurité&msg=Bravo%20pour%20votre%20vigilance!&icon=🏆&color=00b300&reward=Café&lock=true
```

### Exemple Formation
```
index.html?code=FORMATION&flagger=IT%20Department&msg=Module%20phishing%20terminé&icon=🎓&color=0078d7&reward=Croissant&lock=true
```

### Exemple Fun
```
index.html?code=PARTY2024&flagger=Boss&msg=Vous%20avez%20gagné%20une%20récompense!&icon=🎉&color=ff00ff&reward=Pizza&lock=false
```

### Exemple Serious
```
index.html?code=SECURITY2024&flagger=RSSI&msg=Incident%20de%20sécurité%20évité.%20Merci!&icon=🛡️&color=e81123&reward=Service&lock=true
```

---

## 🎨 Palette d'Icônes

**Symboles :**
- 🚩 Flag
- ⚠️ Warning
- 🏆 Trophée
- 🛡️ Bouclier
- 📚 Livre
- 🎓 Diplôme
- 🎉 Fête

**Smileys :**
- 😀 Heureux
- 😊 Sourire
- 😂 Rire
- 😎 Cool
- 😍 Amour
- 🤔 Réflexion
- 😱 Peur
- 😡 Colère

**Nourriture :**
- 🍕 Pizza
- 🍔 Burger
- 🍰 Gâteau
- 🍺 Bière
- ☕ Café
- 🥐 Croissant

**Autres :**
- 🤗 Câlin
- 🤝 Poignée de main

---

## 🎨 Codes Couleurs Recommandés

| Couleur | Code HEX | Usage |
|---------|----------|-------|
| Bleu Windows | `0078d7` | Standard professionnel |
| Rouge Erreur | `e81123` | Alerte/Danger |
| Vert Succès | `00b300` | Validation/Bravo |
| Magenta | `ff00ff` | Fun/Créatif |
| Orange | `ff5733` | Attention |
| Rose | `ff69b4` | Douceur |
| Marron Café | `6f4e37` | Café/Confort |
| Or | `ffd700` | Récompense |
| Violet | `9b59b6` | Mystère |

---

## 🏆 Liste Complète des Récompenses

1. Aucun *(rien n'est affiché)*
2. ☕ Café
3. 🥤 Boisson
4. 🥐 Croissant
5. 🍫 Chocolat
6. 🍬 Bonbon
7. 🍰 Gâteau
8. 🍕 Pizza
9. 🍽️ Repas
10. 🍺 Bière
11. 💋 Bisous
12. 🤗 Câlin
13. 🤝 Service

---

## 💡 Conseils d'Utilisation

### ✅ Bonnes Pratiques

1. **Encoder les espaces** : Utilisez `%20` ou `+`
   ```
   msg=Ceci%20est%20un%20message
   ```

2. **Codes courts** : Préférez les codes courts et mémorisables
   ```
   code=SEC24 (au lieu de SECURITY_ULTRA_LONG_2024)
   ```

3. **Couleurs cohérentes** : Utilisez des codes couleurs en accord avec le message
   - Rouge = Danger/Erreur
   - Vert = Succès/Validation
   - Bleu = Neutre/Pro

4. **Lock adapté** : Activez le lock si vous voulez forcer la saisie du code
   ```
   lock=true → Section déblocage visible
   lock=false → Pas de section déblocage
   ```

### ❌ À Éviter

1. **Messages trop longs** : Gardez les messages courts et impactants
2. **Codes trop complexes** : Les utilisateurs doivent pouvoir les taper
3. **Couleurs criardes** : Restez professionnel si usage en entreprise

---

## 🔗 Liens Utiles

- **Documentation complète** : Voir README.md
- **Page de test** : test_url_params.html
- **Repository GitHub** : https://github.com/WolwX/Flag

---

## 📞 Support

Pour toute question ou suggestion :
- **Email** : wolwx@hotmail.com
- **GitHub** : https://github.com/WolwX

---

**Flag v1.0** - © 2025 Xavier (WolwX) - Tous droits réservés
