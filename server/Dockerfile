FROM node:20

WORKDIR /app

RUN chmod 711 /app

RUN groupadd -r appuser && useradd -r -g appuser -m appuser

RUN mkdir /workspace 

RUN mkdir /workspace/childProject

COPY package*.json ./

RUN npm install

COPY . .

RUN chmod 644 /app/package.json

RUN chown -R appuser:appuser /workspace

USER appuser

RUN ls -ld /app/package.json && ls -l /app/package.json

CMD ["npm", "run", "dev"]
