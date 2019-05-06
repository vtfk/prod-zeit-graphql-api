module.exports = async (personalId, context) => {
  if (!personalId) throw Error('Missing required parameter: personalId')
  if (!context) throw Error('Missing required parameter: context')

  const dsfData = await context.getDsfForeldre.load(personalId)

  // If no responisiblity is specified, return the person itself.
  if (!dsfData.raw['HOV']['FORAN-KD']) {
    return [{ id: personalId }]
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
      return [{ id: personalId }]
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
