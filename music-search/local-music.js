
const dirTree = require("directory-tree")
const mmm = require('music-metadata')

const getFilteredTree = (path = "/Users/apple/Downloads") => {

	let pathArr = []
	const regExp = /(^\..{2,}$|node_modules|bower_components|[lL]ib(rary){0,1}|Documents)/
	dirTree(path,
	{
		extensions: /^\.(mp3|flac)$/,
		exclude: regExp
	}, (item, PATH, stats) =>
		pathArr.push(item.path)
	)

	return pathArr
}

const getMetadata = async (pathArr = getFilteredTree(), metadata = [], err = []) => {
	for (const path of pathArr) {
		let mt = false, _err = false
		try {
			mt = await mmm.parseFile(path)
			mt.path = path
			metadata.push(mt)
		} catch(_err) {
			err.push(_err)
		}
	}
	return {metadata, err}
}

console.log(getFilteredTree())

module.exports = {getFilteredTree, getMetadata}
