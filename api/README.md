<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Description
This project was based on [Real world](https://realworld-docs.netlify.app).

[Swagger docs](http://localhost:5000/api/docs)

## Project's enviroment require

```
node ≥ 22.17
yarn ≥ 1.22.22
typescript ≥ 5.7.3
```

## Project setup

```bash
$ yarn install
```

## Compile and run the project

```bash
# docker build nestjs's container
$ cd api
$ docker build --target development -t next-realworld-api-dev .

# docker compose
$ docker compose --env-file ./api/.env.dev -f docker-compose.dev.yml up
```

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod

# running lint
$ yarn lint
```

## Run tests

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
