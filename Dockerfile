#stage 1
FROM node:latest as node
EXPOSE 8001/udp
EXPOSE 8001/tcp
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod
#stage 2
FROM nginx:alpine
EXPOSE 8001/udp
EXPOSE 8001/tcp
COPY --from=node /app/dist/zway-simple /usr/share/nginx/html