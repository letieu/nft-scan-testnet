FROM node:18-alpine As build

RUN apk update && apk upgrade && \
  apk add --no-cache bash

WORKDIR /usr/src/app

COPY --chown=node:node package.json package-lock.json ./

RUN npm install

COPY --chown=node:node . .

# Run the build command which creates the production bundle
RUN npm run build

# Set NODE_ENV environment variable
ENV NODE_ENV production

USER node

###################
# PRODUCTION
###################
FROM node:18-alpine As production

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

# Start the server using the production build
CMD [ "node", "dist/index.js" ]
EXPOSE 3001
