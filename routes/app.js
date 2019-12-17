
const axios = require('axios')
const express = require('express')

const router = express.Router()

const spotify = require('../config/keys').spotify

router.post('/token', (req, res) => {

	const {code, grant_type, refresh_token} = req.body
	const auth = Buffer.from(`${spotify.clientID}:${spotify.clientSecret}`).toString('base64')
	const headers = {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Authorization': `Basic ${auth}`
	}
	console.log(grant_type, code, refresh_token)
	axios.post('https://accounts.spotify.com/api/token', null, {headers,
		params: {
			grant_type,
			refresh_token,
			code,
			redirect_uri: 'http://localhost:8080'
		}})
		.then(spotifyRes => {
			res.json(spotifyRes.data)
			console.log(spotifyRes.data)
		})
		.catch(err => res.json(err.response.data))
})

module.exports = router
