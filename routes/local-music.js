
const express = require('express')
const router = express.Router()
const {getFilteredTree, getMetadata} = require('../music-search/local-music')

router.get('/path', async (req, res) => {

  const pathArr = getFilteredTree()
  const _meta = await getMetadata(pathArr)
  res.json({
    metadata: _meta.metadata
  })
})

module.exports = router
