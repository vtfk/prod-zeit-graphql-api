
function logger (level, message) {
  const messageArray = Array.isArray(message) ? message : [message]
  const time = new Date().toUTCString()
  const logMessage = `${time} | < ${level.toUpperCase()} > ${messageArray.join(' - ')}`
  console.log(logMessage)
}

module.exports = {
  logger,
  logConfig: (opt, pre, suf) => {}
}