# 📊 Data Skills Radar - Interface Décisionnelle (App)

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![DuckDB](https://img.shields.io/badge/DuckDB-FFF000?style=for-the-badge&logo=duckdb&logoColor=black)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)

Bienvenue sur le dépôt Frontend du projet **Data Skills Radar**.

Cette application est l'interface visuelle (Business Intelligence) d'un Système d'Information Décisionnel global conçu pour analyser et prédire l'impact de l'Intelligence Artificielle sur les mutations de l'emploi en France.

*Le code source du backend (Data Lakehouse, Ingestion, PySpark) se trouve sur le dépôt compagnon : [data-skills-radar-lakehouse](https://github.com/Anon31/data-skills-radar-lakehouse).*

---

## 🎯 Le but de cette application

Contrairement aux tableaux de bord traditionnels qui nécessitent un serveur de base de données lourd, cette application innove en utilisant une architecture **Zero-ETL**.

Grâce à **DuckDB** (intégré directement dans le navigateur via WebAssembly), cette application Angular interroge à la volée de gigantesques fichiers analytiques (format Apache Parquet) stockés sur un Object Storage (S3).

**Fonctionnalités principales (à venir) :**
- 🗺️ Cartographie interactive de la destruction/création d'emplois par région.
- 📈 Visualisation des tendances de compétences (Soft Skills vs Hard Skills) par secteur d'activité (Code NAF).
- 🔮 Tableau de bord prédictif basé sur les modèles de Machine Learning du backend.

## 🛠️ Stack Technique

- **Framework UI :** Angular (v22+)
- **Moteur Analytique (Client-side) :** DuckDB-WASM
- **Visualisation de données :** (Librairie à définir - ex: ECharts, D3.js, Leaflet)

## 🚀 Démarrage rapide (Développement local)

### Prérequis
Assurez-vous d'avoir installé **Node.js** (version `24.15.0` ou supérieure) et **Angular CLI**.

### Installation

1. Clonez le dépôt sur votre machine :
```bash
git clone https://github.com/Anon31/data-skills-radar-app.git
cd data-skills-radar-app
```

2. Installez les dépendances du projet :
```bash
npm install
```

3. Lancez le serveur de développement :
```bash
ng serve
```

4. Ouvrez votre navigateur et accédez à `http://localhost:4200/`. L'application se rechargera automatiquement si vous modifiez les fichiers sources.

## 🤝 Conventions de contribution (GitOps)

Ce projet respecte des normes strictes d'industrialisation logicielle :

- **Conventional Commits :** Tous les messages de commit doivent suivre la syntaxe `type(scope): description` (ex: `feat(ui): ajout de la carte de France`).
- **Nommage des branches :** Les développements se font sur des branches nommées `type/contexte/description` (ex: `feat/dashboard/job-trends`) avant d'être fusionnées via Pull Request sur la branche `master`.
- **Branches principales :** `master` (Production) et `develop` (Intégration).

## ⚖️ Licence

Ce projet est sous licence **MIT**. Vous êtes libre de l'utiliser, de le modifier et de le distribuer, à condition de conserver la notice de copyright. Voir le fichier [LICENSE](./LICENSE) pour plus de détails.
