# 📊 Data Skills Radar - Business Intelligence UI (App)

Welcome to the Frontend repository of the **Data Skills Radar** project.

This application is the visual interface (Business Intelligence) of a global Decision Support System (DSS) designed to analyze and predict the impact of Artificial Intelligence on employment trends and skill mutations in France.

*The source code for the backend (Data Lakehouse, Ingestion, PySpark) can be found on the companion repository: [data-skills-radar-lakehouse](https://github.com/Anon31/data-skills-radar-lakehouse).*

> 🇫🇷 **Language Policy:** While this README is in English for international visibility, the detailed architectural documentation (in the `docs/` folder) and the **Git commit messages** are written in **French**. This aligns with the local academic and business context of this specific project (French employment data).

## 🎯 Purpose of this application

Unlike traditional dashboards that rely on heavy backend database servers, this application innovates by implementing a **Zero-ETL** architecture.

Powered by **DuckDB** (running directly inside the user's browser via WebAssembly), this Angular application queries massive analytical datasets (Apache Parquet format) stored on an Object Storage (S3) on the fly.

**Key Features (Upcoming):**

* 🗺️ Interactive mapping of job creation/destruction across French regions.
* 📈 Visualization of skill trends (Soft Skills vs. Hard Skills) filtered by business sector (NAF Codes).
* 🔮 Predictive dashboard driven by the backend's Machine Learning forecasting models.

## 🛠️ Tech Stack

* **UI Framework:** Angular (v22+)
* **Client-side Analytics Engine:** DuckDB-WASM
* **Data Visualization:** *(Library to be defined - e.g., ECharts, D3.js, Leaflet)*

## 🚀 Quick Start (Local Development)

### Prerequisites

Ensure you have **Node.js** (version `24.15.0` or higher) and the **Angular CLI** installed on your machine.

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Anon31/data-skills-radar-app.git
cd data-skills-radar-app
```

2. Install project dependencies:
```bash
npm install
```

3. Start the development server:
```bash
ng serve
```

4. Open your browser and navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## 🤝 Contribution Guidelines (GitOps)

This project strictly adheres to industrial software engineering standards:

* **Commit Language:** Commit descriptions must be written in **French** (e.g., `feat(ui): ajout de la carte de France`).
* **Conventional Commits:** All commit messages must follow the `type(scope): description` syntax.
* **Branch Naming:** Developments must be done on ephemeral branches following the `type/context/short-description` format (e.g., `feat/dashboard/job-trends`) before being merged via Pull Request.
* **Main Branches:** `master` (Production) and `develop` (Integration).

## ⚖️ License

This project is licensed under the **MIT License**. You are free to use, modify, and distribute this software, provided that the original copyright notice is included. See the [LICENSE](./LICENSE) file for more details.
