const req = require.context('./browser', true, /\.test\.tsx?$/)
req.keys().forEach(req);