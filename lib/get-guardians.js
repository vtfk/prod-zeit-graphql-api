module.exports = async (personalId, context) => {
  if (!personalId) throw Error('Missing required parameter: personalId')
  if (!context) throw Error('Missing required parameter: context')

  let dsfData

  try {
    dsfData = await context.getDsfForeldre.load(personalId)
  } catch (error) {
    throw error
  }

  // If no responisiblity is specified, return the person itself.
  if (!dsfData.raw['HOV']['FORAN-KD']) {
    return null
  }

  let guardianIds = []

  // Check for who is resposible for this person
  switch (dsfData.raw['HOV']['FORAN-KD']) {
    case 'D':
      guardianIds.push(dsfData.motherIdNumber)
      guardianIds.push(dsfData.fatherIdNumber)
      break

    case 'M':
      guardianIds.push(dsfData.fatherIdNumber)
      break

    case 'F':
      guardianIds.push(dsfData.fatherIdNumber)
      break

    default:
      return null
  }

  // Find the responsible persons who has an address (is 'Bosatt')
  guardianIds = dsfData.raw['FOR']
    .filter(
      parent =>
        guardianIds.includes(`${parent.FODT}${parent.PERS}`) &&
        parent['STAT'] === 'Bosatt'
    )
    .map(parent => `${parent.FODT}${parent.PERS}`)

  return guardianIds.map(guardianId => ({
    id: guardianId
  }))
}
