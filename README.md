# login-api

## Test - Current coverage
![current coverage](https://raw.githubusercontent.com/oliveiragustavo/login-api/coverage/coverage.png)

## Routes

### sign-up - post
```json
/user/sign-up
{
  "name": "name",
  "email": "email@gmail.com",
  "password": "password",
  "phones": [{
      "number": "123456789",
      "ddd": "11"
    }, {
      "number": "012345678",
      "ddd": "22"
    }
  ]
}
```

### sign-in - post
```json
/user/sign-in
{
  "email": "email",
  "password": "password"
}
```

### search - get
```
/user/search/:userId
```
