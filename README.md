# Movie API
## _Documentation_

To start it off, we must do the following:

```sh
npm install
npm start
```

## Endpoints

Use the following endpoints to get or create the resources whatever you want.

##### baseUrl = http://localhost:3002/api

| Method | URL |
| ------ | ------ |
| GET | {{baseUrl}}/movies |
| GET | {{baseUrl}}/movies/:movieId |
| POST | {{baseUrl}}/movies |
| PUT | {{baseUrl}}/movies/:movieId |
| DELETE | {{baseUrl}}/movies/:movieId |
| POST | {{baseUrl}}/register |

To be able to create, update or delete a resource, it is necessary to register an user. Use the following endpoint:
##### | POST | {{baseUrl}}/register |
You can register an user with data that you want.
{
    "email": "someone@gmail.com",
    "password": "mysupersecretpassword"
}

After creating an user, you need to take the accessToken and use it as a header to create, update and delete information. (Authorization Bearer <token>).

On the other hand, you can filter data using query strings.

| Method | URL |
| ------ | ------ |
| GET | {{baseUrl}}/movies |
| GET | {{baseUrl}}/movies?title=American |
| GET | {{baseUrl}}/movies?genre=Drama |
| GET | {{baseUrl}}/movies?title=Equalizer&genre=Action |

## License

MIT