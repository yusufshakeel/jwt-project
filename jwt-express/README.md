# jwt-project
Json Web Token

## Get started

Install packages

```shell
npm i
```

## Start localhost server

```shell
npm run start:dev
```

## APIs

### Login

Request:
```text
POST /login
Content-Type: application/json
```
Body:
```json
{
    "username": "yusuf",
    "password": "password"
}
```

Response:
```json
{
    "accessToken": "eyJh...",
    "refreshToken": "eyJh..."
}
```

### Get tweets

Request:
```text
GET /tweets
Authorization: Bearer eyJh...
```

Response:
```json
{
    "tweets": [
        {
            "id": 1,
            "userId": 1,
            "tweet": "Hello, World!"
        },
        {
            "id": 2,
            "userId": 1,
            "tweet": "Hello, World! 2"
        }
    ]
}
```

### Token

This will generate a new access token.

Request:
```text
POST /token
Content-Type: application/json
```

Body:
```json
{
    "username": "yusuf",
    "token": "eyJh..."
}
```

Response:
```json
{
    "accessToken": "eyJh..."
}
```

### Logout

Request:
```text
DELETE /logout
Authorization: Bearer eyJh...
```

Response:
```json
{
    "username": "yusuf"
}
```