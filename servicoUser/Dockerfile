# Define a imagem base
FROM node:16

# Define o diretório de trabalho no contêiner
WORKDIR /app

# Copia os arquivos de definição de pacotes para o diretório /app
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia todos os arquivos do diretório atual (/back) para /app no contêiner
COPY . .

# Expõe a porta que o Node.js vai rodar
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "index.js"]
