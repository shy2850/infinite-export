// @ts-ignore
const { argv } = process
// @ts-ignore
const build = process.env['NODE_ENV'] === 'build' || argv[argv.length - 1] === 'build'

/**
 * @type {import('f2e-server').F2EConfig}
 */
const config = {
    livereload: !build,
    build,
    // app: 'static',
    // __withlog__: true,
    gzip: true,
    // compressors: ['br', 'gzip', 'deflate'],
    middlewares: [
        { middleware: 'template', test: /\.html?/ },
        { middleware: 'esbuild' },
        {
            middleware: 'proxy',
            test: /^\/?f2e-server/,
            url: 'https://gitee.com',
            renderHeaders: (req) => {

                return {
                    ...req.headers,
                    host: 'gitee.com',
                }
            }
        },
        // () => {
        //     return {
        //         onRoute: p => {
        //             if (!p) return 'index.html'
        //         },
        //     }
        // }
    ],
    try_files: 'index.html',
    // onServerCreate: (server) => {
    //     const { Server } = require('ws')
    //     const wss = new Server({server});
    //     wss.on('connection', (socket) => {
    //         socket.send('init')
    //     })
    // }
    // authorization: 'admin:admin'
}
module.exports = config
