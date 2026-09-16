# Lightweight production image using Nginx Alpine
FROM nginx:alpine

LABEL maintainer="Antigravity CyberLab"
LABEL description="Cyber Security CLI Lab - 35 Progressive Linux Wargame Levels"

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy lab web files
COPY index.html /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/

# Expose standard HTTP port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
