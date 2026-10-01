# 🏗️ Architecture Frontend & Guide des Styles

Ce document définit les fondations techniques de l'interface "Data Skills Radar", propulsée par Angular (v22+) en mode Single Page Application (SPA).

## 🚀 1. Le Paradigme Zero-ETL (DuckDB)

Contrairement à une application web classique qui interroge une API REST connectée à une base de données PostgreSQL lourde, cette application est totalement autonome.

*   **Le Moteur :** Nous utilisons **DuckDB-WASM**. Le moteur de base de données analytique (OLAP) s'exécute *directement dans le navigateur* du client grâce à WebAssembly.
*   **La Donnée :** DuckDB requête à la volée des fichiers distants au format **Apache Parquet** (stockés sur un S3 ou un serveur statique) grâce au mécanisme de *Byte-Range Fetch* (il ne télécharge que les colonnes nécessaires, pas tout le fichier).

**Avantage métier :** Coût de serveur backend nul, fluidité maximale pour l'utilisateur sur les filtres croisés.

## 🎨 2. Guide des Styles & CSS

Le projet adopte une architecture CSS hybride alliant vélocité et maintenabilité.

### 🥇 Priorité 1 : Classes Utilitaires (Tailwind CSS)
90% du design doit être réalisé via des classes utilitaires (Tailwind).
*   *Pourquoi ?* Cela gère nativement le responsive, évite le code mort CSS et standardise les espacements.
*   *Usage :* Flexbox, Grid, Marges, Paddings, Typographie globale.

### 🥈 Priorité 2 : Librairie de Composants (UI Kit)
Pour les éléments interactifs d'interface (Sélecteurs de dates, Tableaux de données complexes, Modales), nous déléguons la complexité à une librairie spécialisée (à définir) pour garantir l'accessibilité (a11y).

### 🥉 Priorité 3 : CSS Personnalisé (Le Thème)
Le CSS brut (dans `styles.css` ou les composants Angular) est utilisé en dernier recours.
*   *Usage :* Définition des CSS Custom Properties (Variables CSS) pour la charte graphique globale.
*   *Règle stricte :* Ne jamais coder de couleurs en dur (Hex) dans les composants. Utiliser systématiquement les variables sémantiques (ex: `var(--primary-color)`).

## 🌍 3. Environnement et SSR

*   **Server-Side Rendering (SSR) :** Désactivé (`false`).
*   *Justification :* Le SSR de Node.js entrerait en conflit avec l'exécution client-side de DuckDB-WASM. Notre application est un outil métier privé/BI interactif, le référencement SEO n'est pas un pré-requis.