# TODO LIST APP

## Installation

Install server dependencies:

```
cd server
npm install
```

Create your `server/.env` file with your own db config variables or copy the content of `server/.env.example`.

Install webapp dependencies:

```
cd app
npm install
```

## Running the app

Start database with default env variables:

```
docker run --name postgres -e POSTGRES_PASSWORD=postgres -d postgres
```

or modify the above code accordingly if you didn't use env variables from `server/.env.example` file.

Start server:

```
cd server
npm run start
```

Start webapp server:

```
cd app
npm start
```

## Testing

Run server routes tests:

```
cd server
npm test
```

Run react app tests:

```
cd app
npm test
```
