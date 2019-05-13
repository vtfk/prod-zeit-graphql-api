const { mergeSchemas } = require('graphql-tools')
const promisedSchemas = [
  require('../schemas/person-schema'),
//  require('./fint')()
]
module.exports = async () => {
  const schemas = await Promise.all(promisedSchemas)

  const schema = mergeSchemas({
    schemas
  })
  return schema
}