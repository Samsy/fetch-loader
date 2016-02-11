# fetch-loader
An incredibly very simple fetch assets loader that load every file as a blob
and return a media element ( image / video / sound )


```js
var fetchLoader = require('fetch-loader')

this.files = []

this.files.push( { name: 'videoxsd', url : ROOTPATH + IMAGE_PATH + 'videoxsd.mp4' } )
this.files.push( { name: 'image',    url : ROOTPATH + IMAGE_PATH + 'image.jpg' } )
this.files.push( { name: 'sound', url : ROOTPATH + IMAGE_PATH + 'sound.mp3' } )


fetchLoaderManager.load(this.files, { parallel: 8 })

// file event fire everytime a file is loaded
fetchLoaderManager.on('file', onFile)

// complete event fire when everything is loaded
fetchLoaderManager.on('complete', onComplete)

```
