const { mergeSchemas } = require('graphql-tools')
const { logger } = require('../lib/tools/logger')
const promisedSchemas = [
  require('./local/person-schema'),
  require('./local/auth-schema'),
  require('./local/current-user-schema')
//  require('./remote-schemas/fint')()
]
module.exports = async () => {
  logger('info', ['Merging schemas', promisedSchemas.length])
  const schemas = await Promise.all(promisedSchemas)

  const schema = mergeSchemas({
    schemas
  })
  return schema
}
