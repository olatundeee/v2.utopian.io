FROM node:8.12-alpine
ADD . /opt/utopian
WORKDIR /opt/utopian
RUN yarn
RUN npm install pm2 -g
EXPOSE 5000
CMD ["pm2-runtime", "index.js", "-i", "max"]