# Message Service API

Simple message API with endpoints to create, delete and fetch messages.
All endpoints need the recipient (just a string) parameter and then

#### Used tech

- [**Node.js**](https://nodejs.org/en/)
  The basis for the server implementation
- [**Express**](http://expressjs.com/)
  Very flexible Node framework for running web applications.
- [**body-parser**](https://www.npmjs.com/package/body-parser) Parsing library for converting raw data to js object.

#### Further improvements that can be made

- Data Persistence - database
- Authentication
- Better error handling like 400's for bad input
- Input validation and input sanitization
- Rate Limiting
- Tests (unit and integration)

# Usage examples

## Setup

```sh
npm i
npm start
```

## Send message to recipient

```sh
curl -X POST http://localhost:3000/message -H "Content-Type: application/json" -d '{"recipient": "user@example.com", "message": "Hello World!"}'
```

## Fetch messages for recipient (all since last fetch)

```sh
curl -X GET "http://localhost:3000/message/user@example.com"
```

## Delete messages

```sh
curl -X DELETE http://localhost:3000/message/user@example.com -H "Content-Type: application/json" -d '{"indexes": [0, 1]}'
```

## Get messages using start/stop index

```sh
curl -X GET "http://localhost:3000/messages/user@example.com?start=0&stop=2"
```
