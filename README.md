# fetch-loader 

npm install --save fetch-loader
----------

An incredibly very simple fetch assets loader that load every file as a blob
and return a media element ( image / video / sound / json )


```js
var fetchLoader = require('fetch-loader')

this.files = []

//	{ 
//		name: 'image',                               =>   name of the media 
//		url : ROOTPATH + IMAGE_PATH + 'image.jpg',   =>   url of the media 
//		data: {description: "red image"}             =>   additional data you want to be associated with the loaded media
//	}


this.files.push( { name: 'videoxsd', url : ROOTPATH + VIDEO_PATH + 'videoxsd.mp4' } )
this.files.push( { name: 'image',    url : ROOTPATH + IMAGE_PATH + 'image.jpg', data: {description: "red image"} )
this.files.push( { name: 'sound', url : ROOTPATH + SOUND_PATH + 'sound.mp3' } )
this.files.push( { name: 'myjson', url : ROOTPATH + JSON_PATH + 'data.json' } )

var fetchLoaderManager = new fetchLoader()

// file event fire everytime a file is loaded
fetchLoaderManager.on('file', onFile)

// complete event fire when everything is loaded
fetchLoaderManager.on('complete', onComplete)


// fetchLoaderManager.load options : 

// parallel : limit of the unsync fetch loading
// headreq  : determine if the loader first process a head request ( true progression values ) 

fetchLoaderManager.load(this.files, { parallel: 8, headreq: true })


// kill events
fetchLoaderManager.off('file')

fetchLoaderManager.off('complete')


```
