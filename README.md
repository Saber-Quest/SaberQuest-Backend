# SaberQuest - Backend 🗄️

The backend code for [SaberQuest](https://saberquest.xyz).

## API

You can view all of the endpoints over at the [Swagger documentation](https://dev.saberquest.xyz/docs).

## Frontend 🖥️
- [Frontend Service](https://github.com/Saber-Quest/SaberQuest-frontend)

# Want to help?

> [!NOTE]
> Contributions are always appreciated!
> 
> If you want to contribute, fork the repository and make a pull request.
> The name of the pull request should represent what you are trying to add.
> If you want to contribute to the frontend, go to the [Frontend Repository](https://github.com/Saber-Quest/SaberQuest-frontend).
>
> Every pull request will be review by a maintainer, and if it is accepted, it will be merged into the next-branch for testing.
> If it passes testing and is stable, it will be merged into the main branch, otherwise a maintainer will contact you to fix the issues.
>
> This can take 3-4 days, so please be patient, as we're all working on this in our free time. Thank you!
#
## Getting started

First, install the dependencies:

```bash
npm run deps:get
# or
yarn deps:get
```

> [!IMPORTANT]
> You will need to set up the environment before you can start working on this!

> [!WARNING]
> Make sure that you use never before made secrets and authorization codes
> to prevent people from cracking your security.

Environment variables:
```js
DISCORD_SECRET // most likely you won't use
DISCORD_ID // most likely you won't use
BEATLEADER_SECRET // most likely you won't use
BEATLEADER_ID // most likely you won't use
PATREON_SECRET  // most likely you won't use
PATREON_ID // most likely you won't use
PORT
SOCKET_PORT
JWT_SECRET
REDIRECT_URI
REDIRECT_URI_API
AUTHORIZATION_CODE
PROD_PATH
```

Secondly configure the database.

> [!IMPORTANT]
> You will need a docker container for PostgreSQL.
>
> If you're using windows, install [Docker Desktop](https://www.docker.com/products/docker-desktop/) OR 
> use WSL2 and use the [Docker Engine](https://docs.docker.com/desktop/install/linux-install/).
>
> If you're using linux, install the [Docker Engine](https://docs.docker.com/desktop/install/linux-install/).

Start up a PostgreSQL docker container and edit the configuration in `src/config.json`.

If you don't know how to use docker, run this command:

```bash
docker run --name SaberQuest -e POSTGRES_PASSWORD=test -d -p 5432:5432 postgres
```

config.json is already configured for this setup.

After you've successfully initialized the database run the following command:

```bash
npm run db
# or
yarn db
```

Then to run the development server use this command:

```bash
npm run dev
# or
yarn dev
```

Or if you prefer running the nodemon version:

```bash
npm run watch
# or 
yarn watch
```

Open localhost on the port that you've set in the .env file.

## Scripts

- `dev` - Runs the development server on the specified port (default 5000)
- `build` - Builds the server for deployment
- `watch` - Runs the development server using nodemon
- `db` - Runs the migrations and seeds for the database
- `deps:get` - Runs deps:global and deps:local
- `deps:global` - Globally installs typescript, ts-node, nodemon and yarn
- `deps:local` - Install the dependencies using yarn
- `migrate` - Runs the database migrations
- `seed:run` - Seeds the database with dummy data
- `seed:make` - Makes a new seed template
- `actions` - Used for CI/CD to automatically build the project on the server.
- `lint` - Runs eslint

## Learn More

If you want to learn how to contribue to SaberQuest but don't know where to start, here are some useful resources:

Language:

- [Learn NodeJS](https://www.w3schools.com/nodejs/default.asp) - Learn about NodeJS and it's quirks.
- [TypeScript Documentation](https://www.typescriptlang.org/docs/) - Learn how TypeScript differs from NodeJS and how to use it's types.

Express:

- [Getting Started](https://www.typescriptlang.org/docs/) - How to get started with express.
- [Guide](https://expressjs.com/en/guide/routing.html) - A writeup on what and how you can do stuff with express.
- [Documentation](https://expressjs.com/en/4x/api.html) - Express documentation.

This project is licensed under the Apache-2.0 License - see the [LICENSE](LICENSE) file for details.