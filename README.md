# GraphQL Combined APIs
GraphQL API that combines several REST APIs.

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

## In-code requests
### Node.js
If you are using VSCode then I recommend the extension [GraphQL](https://marketplace.visualstudio.com/items?itemName=Prisma.vscode-graphql) for writing queries as it provides syntax highlighting. It can also provide autocomplete, schema validation and snippets if you setup a [GraphQL-config](https://github.com/prisma/graphql-config) file.

To use it just prepend a backtick string with `/* GraphQL */`, for example:

```graph
const query = /* GraphQL */`
  query getPerson($personalId: [String!]) {
    persons(personalId: $personalId) {
      firstname
    }
  }
  `
```

Using the [graphql-request](https://www.npmjs.com/package/graphql-request) node module you can easily do GraphQL requests.

When using variables in the query (personalId in this case) it is recommended to use the internal variable system, rather than string substitutions directly in the query.

This will handle the escaping of characters and provide error messages on unexpected input.

To use variables within a query you write the query like this:
```graph
1 query getPerson($personalId: [String!]) { // 
2   persons(personalId: $personalId) {
3     firstname
6   }
7 }
```

Line 1: Defines the query and the query name (you choose the query name yourself, like defining a function).
This also declares the variable and it's type, in this case a List containing non-nullable (required) Strings.

Line 2: Here we get the persons field with personalId as an argument.
The argument get it's value from the $personalId variable, which we specify in the code.


Take a look at this example for a full request:

```js
require('dotenv').config()
const { GraphQLClient } = require('graphql-request')
const jwt = require('jsonwebtoken')

// Sign the token with provided secret and an expiry time under 2 minutes
const jwtToken = jwt.sign({}, process.env.GRAPHQL_JWT, {expiresIn: '2m'})


;(async function main() {
  // Create a new client
  const graphQLClient = new GraphQLClient(process.env.GRAPHQL_URL, {
    headers: {
      authorization: `Bearer ${jwtToken}`,
    }
  })

  // Define a new query
  const query = /* GraphQL */`
  query getPerson($personalId: [String!]) {
    persons(personalId: $personalId) {
      firstname
      address {
        zip
      }
    }
  }
  `

  // Define the variables
  const variables = {
    personalId: ["01010144444"]
  }

  // Mash it all together and send the request.
  const data = await graphQLClient.request(query, variables)

  // Pretty-print the results in the terminal.
  console.log(JSON.stringify(data, undefined, 2))
})().catch(error => {console.log(error)})
```

#### Good resources:
- [GraphQL Docs - queries](https://graphql.org/learn/queries/)
- [GraphQL Docs - variables](https://graphql.org/learn/queries/#variables)
- [Node-module (graphql-request)](https://www.npmjs.com/package/graphql-request)
- [Node-module (jsonwebtoken)](https://www.npmjs.com/package/jsonwebtoken)
- [VSCode extension - GraphQL](https://marketplace.visualstudio.com/items?itemName=Prisma.vscode-graphql)

## Development
### GraphiQL
GraphiQL is enabled on the root ("/") route.
Just use an extension in your browser to add headers on requests, then add an "Authorization" key with the JWT as a value.
Now navigate to your GraphQL endpoint and graph away.

Get more info on how to use it here: https://github.com/graphql/graphiql

### Insomnia
Insomnia has also GraphQL support.
Just create a new request, select POST as the method.
And select GraphQL Query as the body, it can then auto-fetch the schema and provide auto completion.

### Curl
You can also use curl, but it's not recommended as it's hard to type queries.
```bash
curl \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT>" \
  --data '{ "query": "{ persons(personalId: \"11111122222\") { fullname } }" }' \
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
    fullname
    firstname
    middlename
    surname
    details {
      gender
      age
      alive
    }
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
    address {
      address
      zip
      city
    }
    guardians {
      personalId
      ...
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
