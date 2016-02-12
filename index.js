require('whatwg-fetch')

function FetchLoader() {

	this.mapEvent = {}

	this.mapDatas = {}

	this.load = function load(manifest, opts) { 

		this.files = manifest

		this.opts = opts || {}

		this.parallel = this.opts.parallel || 5 

		this.totalFiles = this.files.length

		this.reset()

		this.getHeaders(0)
	}


	this.reset = function reset() {

		this.totalWeight = 0

		this.loadedWeight = 0

		this.loadedMetadata = 0

		this.loadedFiles = 0

		this.currentLoadingIndex = 0

		this.currentLoadingFile = 0

		this.buffer = []

		this.res = {}
		
	}


	this.getHeaders = function getHeaders(i) {

		var fetchmeta = fetch(this.files[i].url, {

		  method: "HEAD"

		})

		var currentDataFile = this.files[i]

		fetchmeta.then( 

			(function(response){

				return this.onLoadedMetadata(response, currentDataFile)

			}).bind(this), 

			(function(error){
				
				return this.onErrorMetadata(error)

			}).bind(this)
		)

		i++

	};

	this.loadQueue = function() { 

		var fetchdata = fetch(this.buffer[this.currentLoadingIndex].url, {

		  method: "GET"

		})

		fetchdata.data = this.buffer[this.currentLoadingIndex]

		fetchdata.then(

			function(response) {

				if (response.headers.get('Content-Type') == 'application/json' ) {

					return response.json()

				}

				else {

					return response.blob()

				}
			}

		).then(

			(function(response){

				console.log(response)

				this.onLoadedFile(response, fetchdata.data)

			}).bind(this)
		)

	}


	this.onLoadedFile = function(blob, data) {  

		var mediatype;

		if ( blob.type ) {

			mediatype = blob.type.slice(0, blob.type.indexOf("/"))

			if (mediatype == 'video' ) {

				this.file = document.createElement( 'video' )

			}

			if (mediatype == 'audio' ) {

				this.file = new Audio()

			}

			if (mediatype == 'image' ) {

				this.file = new Image()
				
			}

			this.file.src = window.URL.createObjectURL(blob)

		}

		else {

			mediatype = 'json'

			this.file =  blob; 

		}

		this.loadedWeight += data.weight

		var res = {

			name: data.name,

			type: mediatype,

			content: this.file    			

		}

		this.res[res.name] = res

		this.emit('file', { progression : this.loadedWeight / this.totalWeight, file: res })

		this.onLoadFile(data)
	}

	this.onLoadFile = function(blob, data) {  

		this.currentLoadingFile--

		this.loadedFiles++

		if ( this.loadedFiles == this.totalFiles ) {

			this.emit('complete', this.res )



		}

		else {

			this.nextIndexQueue()

		}

	}

	this.onLoadedMetadata = function(response, data) {  

		var size = parseInt( response.headers.get("Content-Length") )

		data.weight = size > 0 ? size : Math.random() * 100000  

		this.totalWeight += data.weight
 
		this.buffer.push(data)

		this.loadedMetadata++

		if( this.totalFiles === this.loadedMetadata ) {

			this.nextIndexQueue()
		}

		else {

			this.getHeaders(this.loadedMetadata)
		}

	}

	this.nextIndexQueue = function() {  

		if( this.currentLoadingFile <= this.parallel && this.currentLoadingIndex < this.totalFiles) {
			
			this.currentLoadingFile++

			this.loadQueue()

			this.currentLoadingIndex++

			this.nextIndexQueue()
		}

	}

	this.onErrorMetadata = function(error) {  

		this.totalFiles--

		console.log(error)
	}

	this.onErrorFile = function(error) {  

		console.log(error)

	}

	this.on = function(name, callback) {  

		this.mapEvent[name] = callback

	}

	this.off = function(name) {  

		delete this.mapEvent[name]; 

	}

	this.emit = function(name, data) { 

		if (this.mapEvent[name] ) {

			var ev = this.mapEvent[name]

			// trick to abandon the promise scope

			setTimeout( function() {

				ev(data)

			},0)
		} 
	}
}

module.exports = FetchLoader;
