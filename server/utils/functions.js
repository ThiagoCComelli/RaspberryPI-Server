const portfinder = require('portfinder');

module.exports = {portFinder: async (minPort) => {
    portfinder.basePort = (minPort+1) || 8001

    const res = await portfinder.getPortPromise().then((port) => {
        return port
    })

    return res
}}