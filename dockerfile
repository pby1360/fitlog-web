FROM node:18.16
WORKDIR C:\Users\user\project\fitlog-web

COPY package.json .

ADD . .
RUN npm install

EXPOSE 3000

CMD ["npm", "start"]