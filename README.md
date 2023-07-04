# Membrane CC
## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Bit Finex Docs
[Bitfinex APIs Websocket and HTTP](https://docs.bitfinex.com/reference/rest-public-platform-status)

## Membrane CC Apis HTTP Docs
[Membrane HTTP:3000](https://documenter.getpostman.com/view/9110478/2s93zE3LB9)

## Membrane CC WebSockets Docs
### Ticker (Bid and Ask Prices)
Request Event
```json
{
    "event": "ticker",
    "data": {
        "pair": "tBTCUSD"
    }
}
```
Response Event
```json
{
    "event": "ticker",
    "data": {
        "bidPrice": 30852,
        "bidAmount": 22.07871565,
        "askPrice": 30853,
        "askAmount": 20.7840661
    }
}
```
### Trade (Simulate a trade)

Request Event
```json
{
    "event": "trade",
    "data": {
        "pair": "tETHUSD",
        "operation": "BUY",
        "amount": 1.5
    }
}
```

Response Event
```json
{
    "event": "trade",
    "data": {
        "price": 2914.3500000000004
    }
}
```
## License

Nest is [MIT licensed](LICENSE).
