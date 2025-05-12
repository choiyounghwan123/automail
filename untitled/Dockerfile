FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install --save-dev @babel/plugin-proposal-private-property-in-object

COPY . .

ENV NODE_OPTIONS="--max-old-space-size=512"

RUN npm run build
RUN npm install -g serve

EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]