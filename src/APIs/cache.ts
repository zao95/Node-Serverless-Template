
import md5 from 'md5'

const GET = (app) => {
    app.get('/cache', async (req, res) => {
        try {
            const now = new Date().getTime()
            const cache = md5(now).slice(0, 10)
            res.status(200)
            res.set('Content-Type', 'text/plain')
            res.send(cache)
        } catch (e) {
            console.log(e)
            res.status(400)
            res.json({
                error: e.toString()
            })
        }
    })
}

export default {
    GET,
}