//@ts-ignore pass argv from karma into execution context
process.argv = __karma__.config.args

const req = require.context('./browser', true, /\.test\.tsx?$/)
req.keys().forEach(req);