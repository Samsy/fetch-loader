# fetch-loader 

npm install --save fetch-loader
----------

An incredibly very simple fetch assets loader that load every file as a blob
and return a media element ( image / video / sound / json )


```js
var fetchLoader = require('fetch-loader')

this.files = []

this.files.push( { name: 'videoxsd', url : ROOTPATH + VIDEO_PATH + 'videoxsd.mp4' } )
this.files.push( { name: 'image',    url : ROOTPATH + IMAGE_PATH + 'image.jpg' } )
this.files.push( { name: 'sound', url : ROOTPATH + SOUND_PATH + 'sound.mp3' } )
this.files.push( { name: 'myjson', url : ROOTPATH + JSON_PATH + 'data.json' } )

var fetchLoaderManager = new fetchLoader()

// file event fire everytime a file is loaded
fetchLoaderManager.on('file', onFile)

// complete event fire when everything is loaded
fetchLoaderManager.on('complete', onComplete)


fetchLoaderManager.load(this.files, { parallel: 8 })


// kill events
fetchLoaderManager.off('file')

fetchLoaderManager.off('complete')


```
