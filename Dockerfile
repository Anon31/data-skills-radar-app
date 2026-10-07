# Étape 1 : Construction de l'application (Build)
FROM node:20-alpine AS build
WORKDIR /app

# Copie des manifestes et installation propre
COPY package*.json ./
RUN npm ci

# Copie des sources et compilation Angular
COPY . .
RUN npm run build

# Étape 2 : Serveur web léger et sécurisé pour la production (Nginx Unprivileged)
FROM nginxinc/nginx-unprivileged:alpine

# On récupère le build généré à l'étape précédente
COPY --from=build /app/dist/data-skills-radar-app /usr/share/nginx/html

# On expose le port 8080 (le port 80 nécessite les droits root)
EXPOSE 8080
