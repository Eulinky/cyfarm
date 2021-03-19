# # build stage
# FROM node:lts-slim as build
# RUN apt update || : && apt install python -y
# WORKDIR /app
# ENV PATH /app/node_modules/.bin:$PATH
# COPY ./package.json /app/
# COPY ./yarn.lock /app/
# RUN yarn
# COPY . /app
# RUN yarn build

# # runtime stage
# FROM node:lts-slim
# RUN mkdir -p /opt/cyfar
# COPY --from=build /app/build /opt/cyfar
# COPY ./package.json /opt/cyfar
# WORKDIR /opt/cyfar
# RUN npm install
# EXPOSE 80
# CMD ["npm", "run", "start"]

FROM node:lts-slim as build

ARG DOCKER_ENV=./.env.google
RUN echo ${DOCKER_ENV}
RUN echo $DOCKER_ENV

RUN apt update || : && apt install python -y
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY ./package.json /app/
COPY ./yarn.lock /app/
RUN yarn
COPY . /app


COPY ${DOCKER_ENV} /app/.env


EXPOSE 80
CMD ["yarn", "start"]