const whitelist = ['http://localhost:3000', 'https://www.mwdev.org', 'http://127.0.0.1:3500']
const corsOptions = {
    credentials: true, 
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions