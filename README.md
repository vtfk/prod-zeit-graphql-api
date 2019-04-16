# [WiP] GraphQL Combined APIs
GraphQL API which combines several REST APIs.

## Authentication
Use a [JWT](https://jwt.io/) as a Bearer token in the header with key "Authorization".

**Note: The JWT has to expire in less than 2 minutes.**

Example of header:
``` json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NTU0MjI2OTAsImV4cCI6MTU1NTQyMjgxMH0.Ts0xn2AF0cWVsAsvlClRU0zlL_lwPvm7lNpGu0hFlZk"
}
```

Tip: The node module [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) is a great way to create JWTs.

## Development
GraphiQL is enabled on the root ("/") route.
Just use an extension in your browser to add headers on requests, then add an "Authorization" key with the JWT as a value.
Then navigate to your GraphQL endpoint and graph away.

Get more info on how to use it here: https://github.com/graphql/graphiql


You can also use curl, but it's not recommended as it's hard to type queries.
```bash
curl \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT>" \
  --data '{ "query": "{ persons(personalId: \"11111122222\") { name {fullname} } }" }' \
  https://graphql.example.com/
```

## REST APIs currently included
- [DSF](https://www.infotorg.no/tjenester/det-sentrale-folkeregister)
- [KOR](https://difi.github.io/idporten-oidc-dokumentasjon/index.html)

## Current full scheme
This is the full scheme now, more will be added.
Breaking changes will be added in a new route (ex. /graphql/v2/).

Under each field in family you can use the same fields as under "persons".


``` scheme
{
  persons(personalId: ["111111333333", "22222244444"]) {
    personalId
    name {
      fullname
      firstname
      middlename
      surname
    }
    details {
      gender
      age
      alive
    }
    contact {
      reserved
      status
      email {
        address
        updated
        lastVerified
      }
      mobile {
        number
        updated
        lastVerified
      }
    }
    address {
      address
      zip
      city
    }
    family {
      mother {
        personalId
        ...
      }
      father {
        personalId
        ...
      }
      spouse {
        personalId
        ...
      }
      children {
        personalId
        ...
      }
    }
  }
}
```

# Lisens

[MIT](LICENSE)