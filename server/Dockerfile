FROM node:20

ENV PROJECT_NAME=defaultProject

WORKDIR /app

RUN mkdir /workspace

RUN groupadd -r appuser && useradd -r -g appuser -m appuser

COPY package*.json ./

RUN npm install

COPY . .

RUN chmod 711 /app

RUN chmod 711 /app/Services

RUN chmod 711 /app/node_modules

RUN chmod 644 /app/package.json

RUN chown -R appuser:appuser /workspace

USER appuser

CMD ["sh","-c","mkdir -p /workspace/$PROJECT_NAME && npm run dev"]
