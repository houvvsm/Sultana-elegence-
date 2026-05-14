# Sultana Élégance — Location de caftans marocains

Plateforme web complète de location de caftans haut de gamme avec gestion des réservations, espace cliente, tableau de bord administrateur et réseau de partenaires.

---

## Table des matières

- [Aperçu](#aperçu)
- [Technologies utilisées](#technologies-utilisées)
- [Structure du projet](#structure-du-projet)
- [Installation](#installation)
- [Configuration de la base de données](#configuration-de-la-base-de-données)
- [Compte administrateur par défaut](#compte-administrateur-par-défaut)
- [Pages et fonctionnalités](#pages-et-fonctionnalités)
- [API Backend](#api-backend)
- [Gestion des images](#gestion-des-images)
- [Modes de paiement](#modes-de-paiement)
- [Rôles utilisateurs](#rôles-utilisateurs)

---

## Aperçu

Sultana Élégance est une application web full-stack permettant :

- Aux **clientes** de parcourir un catalogue de caftans, réserver en ligne, suivre leurs commandes et gérer leurs favoris
- Aux **boutiques partenaires** de soumettre des demandes de collaboration
- À l'**administrateur** de gérer les caftans, réservations, clients et partenaires depuis un tableau de bord dédié

---

## Technologies utilisées

| Couche | Technologies |
|---|---|
| Frontend | HTML5, CSS3 (variables CSS, animations), JavaScript ES2020 |
| Backend | PHP 8.x, PDO |
| Base de données | MySQL 8.x (via XAMPP) |
| Serveur | Apache (XAMPP) |
| Polices | Google Fonts — Cinzel, Manrope |

---

## Structure du projet

```
projet web/
├── frontend/                    # Fichiers HTML, CSS, JS
│   ├── index.html               # Page d'accueil
│   ├── catalogue.html           # Catalogue des caftans
│   ├── details.html             # Fiche produit d'un caftan
│   ├── location.html            # Formulaire de réservation
│   ├── client.html              # Espace cliente (connectée)
│   ├── partenaires.html         # Page partenaires + formulaires
│   ├── auth.html                # Connexion / Inscription
│   ├── admin.html               # Tableau de bord administrateur
│   └── assets/
│       ├── css/
│       │   └── style.css        # Styles globaux (thèmes clair/sombre)
│       ├── js/
│       │   ├── api.js           # Couche d'appels API (fetch)
│       │   ├── auth.js          # Gestion session et navigation
│       │   ├── admin.js         # Logique du tableau de bord admin
│       │   ├── catalogue.js     # Chargement et filtrage du catalogue
│       │   └── script.js        # Animations, thème, formulaires
│       └── images/              # Images statiques (caftans seedés)
│
├── backend/
│   ├── config/
│   │   └── connection.php       # Connexion PDO à MySQL
│   ├── api/                     # Endpoints publics et clients
│   │   ├── auth.php             # Gestion des sessions PHP
│   │   ├── functions.php        # jsonResponse(), slugify(), uploadImage()
│   │   ├── login.php            # POST — connexion
│   │   ├── logout.php           # GET  — déconnexion
│   │   ├── register.php         # POST — inscription
│   │   ├── session.php          # GET  — état de la session
│   │   ├── get_caftans.php      # GET  — liste des caftans (public)
│   │   ├── get_caftan.php       # GET  — détail d'un caftan
│   │   ├── get_categories.php   # GET  — catégories disponibles
│   │   ├── get_reservations.php # GET  — réservations du client connecté
│   │   ├── create_reservation.php # POST — créer une réservation
│   │   ├── get_favorites.php    # GET  — favoris du client connecté
│   │   ├── add_favorite.php     # POST — ajouter/retirer un favori
│   │   ├── get_partners.php     # GET  — partenaires approuvés (public)
│   │   └── submit_partner.php   # POST — soumettre une demande partenaire
│   └── admin/                   # Endpoints réservés à l'administrateur
│       ├── get_admin_session.php    # GET  — vérifier session admin
│       ├── get_stats.php            # GET  — statistiques du tableau de bord
│       ├── get_caftans_admin.php    # GET  — tous les caftans
│       ├── add_caftan.php           # POST — ajouter un caftan
│       ├── edit_caftan.php          # POST — modifier un caftan
│       ├── delete_caftan.php        # POST — supprimer un caftan
│       ├── get_all_reservations.php # GET  — toutes les réservations
│       ├── update_reservation.php   # POST — changer le statut d'une réservation
│       ├── get_clients.php          # GET  — liste des clients
│       ├── delete_user.php          # POST — supprimer un client
│       ├── get_partners.php         # GET  — toutes les demandes partenaires
│       └── update_partner.php       # POST — approuver/rejeter un partenaire
│
└── uploads/
    └── caftans/                 # Images uploadées via l'admin
```

---

## Installation

### Prérequis

- [XAMPP](https://www.apachefriends.org/) avec Apache et MySQL actifs
- Navigateur moderne (Chrome, Firefox, Edge)

### Étapes

**1. Cloner ou copier le projet**

Placer le dossier `projet web` dans :
```
C:/xampp/htdocs/projet web/
```

**2. Créer le dossier d'uploads**

Créer manuellement ce dossier (ne pas le mettre dans `frontend/` ni `assets/`) :
```
projet web/uploads/caftans/
```

**3. Démarrer XAMPP**

Ouvrir le panneau XAMPP et démarrer **Apache** et **MySQL**.

**4. Créer la base de données**

- Ouvrir phpMyAdmin : `http://localhost/phpmyadmin`
- Cliquer sur **Nouvelle base de données** → nommer : `sultana_elegance`
- Aller dans l'onglet **SQL** et coller le contenu de `backend/config/db.sql`
- Cliquer **Exécuter**

**5. Ajouter la colonne payment_method** *(si pas déjà dans db.sql)*

Dans phpMyAdmin → onglet SQL :
```sql
ALTER TABLE reservations
  ADD COLUMN payment_method ENUM('on_delivery','card','virement') DEFAULT 'on_delivery'
  AFTER notes;
```

**6. Seeder les caftans de démonstration** *(optionnel)*

Ouvrir dans le navigateur :
```
http://localhost/projet%20web/backend/config/seed_caftans.php
```

**7. Accéder à l'application**

```
http://localhost/projet%20web/frontend/index.html
```

---

## Configuration de la base de données

Le fichier `backend/config/connection.php` contient les paramètres de connexion :

```php
$hostname = "localhost";
$username = "root";
$password = "";          // Laisser vide pour XAMPP par défaut
$database = "sultana_elegance";
```

Modifier ces valeurs si votre configuration MySQL est différente.

---

## Compte administrateur par défaut

| Champ | Valeur |
|---|---|
| Email | `admin@sultana.ma` |
| Mot de passe | `password` |
| Rôle | Administrateur |

> ⚠️ Changer le mot de passe après la première connexion.  
> Pour générer un nouveau hash : `echo password_hash('votre_mdp', PASSWORD_DEFAULT);`

---

## Pages et fonctionnalités

### 🏠 Accueil — `index.html`
- Présentation de la marque
- Accès rapide au catalogue et à la réservation
- Section Pack Mariée mise en avant

### 👗 Catalogue — `catalogue.html`
- Chargement dynamique depuis la base de données
- Filtres : tous / Pack Mariée / moins de 1000 MAD / premium
- Recherche par nom
- Bouton favoris (cœur) — nécessite d'être connecté

### 🔍 Détails — `details.html?id=X`
- Fiche complète d'un caftan
- Galerie d'images avec miniatures cliquables
- Tailles disponibles
- Guide des tailles (modal)
- Bouton "Louer maintenant" → redirige vers `location.html?id=X`

### 📋 Réservation — `location.html`
- Sélection du caftan (pré-sélectionné si venu depuis la fiche)
- Calendrier interactif pour choisir la date
- Sélection de la durée, ville, adresse
- Option bonus beauté (coiffeur +300 MAD / make-up +400 MAD / pack complet +600 MAD)
- Récapitulatif du prix en temps réel
- **3 modes de paiement** : à la livraison, carte bancaire, virement
- Nécessite d'être connecté

### 👤 Espace cliente — `client.html`
- Prochaine réservation mise en avant
- Historique de toutes les réservations avec statuts
- Compteurs : taille enregistrée, favoris, réservations totales
- Nécessite d'être connecté

### 🤝 Partenaires — `partenaires.html`
- Formulaire de demande pour boutiques de caftans
- Formulaire de demande pour coiffeurs / make-up
- Les demandes sont visibles dans le tableau de bord admin

### 🔐 Authentification — `auth.html`
- Onglets Connexion / Inscription
- Inscription immédiatement active (sans validation admin)
- Redirection automatique : admin → `admin.html`, client → `index.html`

### 🛠️ Administration — `admin.html`
Accessible uniquement aux comptes avec `role = 'admin'`.

| Section | Fonctionnalités |
|---|---|
| Tableau de bord | Statistiques globales (caftans, réservations actives, clients, partenaires en attente) + 5 dernières réservations |
| Caftans | Ajouter, modifier, supprimer, gérer le statut et les tailles |
| Réservations | Voir toutes les réservations, changer les statuts (confirmer, livrer, retourner, annuler) |
| Clients | Liste complète, supprimer un client |
| Partenaires | Approuver ou rejeter les demandes de collaboration |

---

## API Backend

### Authentification requise (session PHP)

Tous les appels utilisent `credentials: 'include'` pour envoyer le cookie de session.

### Endpoints publics (`backend/api/`)

| Méthode | Fichier | Description |
|---|---|---|
| POST | `login.php` | Connexion — `email`, `password` |
| POST | `logout.php` | Déconnexion |
| POST | `register.php` | Inscription — `name`, `email`, `password`, `phone`, `city`, `size_profile` |
| GET | `session.php` | État de la session courante |
| GET | `get_caftans.php` | Liste des caftans (params: `category`, `search`) |
| GET | `get_caftan.php?id=X` | Détail d'un caftan |
| GET | `get_reservations.php` | Réservations du client connecté |
| POST | `create_reservation.php` | Créer une réservation |
| GET | `get_favorites.php` | Favoris du client connecté |
| POST | `add_favorite.php` | Ajouter/retirer un favori — `caftan_id` |
| POST | `submit_partner.php` | Soumettre une demande partenaire |

### Endpoints admin (`backend/admin/`)

| Méthode | Fichier | Description |
|---|---|---|
| GET | `get_stats.php` | Statistiques globales |
| GET | `get_caftans_admin.php` | Tous les caftans |
| POST | `add_caftan.php` | Ajouter un caftan |
| POST | `edit_caftan.php` | Modifier un caftan |
| POST | `delete_caftan.php` | Supprimer un caftan — `id` |
| GET | `get_all_reservations.php` | Toutes les réservations |
| POST | `update_reservation.php` | Changer statut — `id`, `status` |
| GET | `get_clients.php` | Liste des clients |
| POST | `delete_user.php` | Supprimer un client — `id` |
| GET | `get_partners.php` | Demandes partenaires |
| POST | `update_partner.php` | Approuver/rejeter — `id`, `status` |

---

## Gestion des images

Les images uploadées via le formulaire d'ajout/modification de caftan sont stockées dans :
```
projet web/uploads/caftans/
```

Les endpoints PHP retournent des URLs absolues (`http://localhost/projet web/uploads/...`) pour les images uploadées, et des chemins relatifs (`assets/images/...`) pour les images seedées. Les deux fonctionnent correctement depuis le frontend.

Les caftans seedés utilisent les images dans `frontend/assets/images/`.

---

## Modes de paiement

Lors d'une réservation, trois options sont proposées :

| Mode | Description |
|---|---|
| 🚚 À la livraison | Paiement en espèces à la réception du caftan (par défaut) |
| 💳 Carte bancaire | L'équipe contacte le client pour finaliser le paiement |
| 🏦 Virement bancaire | RIB fourni après confirmation de la réservation |

---

## Rôles utilisateurs

| Rôle | Accès |
|---|---|
| Visiteur | Accueil, catalogue, détails, partenaires, inscription/connexion |
| Client | + Réservation, espace cliente, favoris |
| Admin | + Tableau de bord complet (CRUD caftans, gestion réservations/clients/partenaires) |

---

## Statuts des réservations

```
pending → confirmed → delivered → returned
                   ↘ cancelled
```

| Statut | Signification |
|---|---|
| `pending` | En attente de confirmation admin |
| `confirmed` | Confirmée, en préparation |
| `delivered` | Livrée à la cliente |
| `returned` | Caftan retourné |
| `cancelled` | Annulée |

---

*© 2026 Sultana Élégance — Location de caftans marocains haut de gamme*
