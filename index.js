require('whatwg-fetch')

function FetchLoader() {

	this.buffer = []

	this.res = {}

	this.totalWeight = 0

	this.loadedWeight = 0

	this.loadedMetadata = 0

	this.loadedFiles = 0

	this.currentLoadingIndex = 0

	this.currentLoadingFile = 0

	this.mapEvent = {}

	this.mapDatas = {}


	this.load = function load(manifest, opts) { 

		this.files = manifest

		this.opts = opts || {}

		this.parallel = this.opts.parallel || 5 

		this.totalFiles = this.files.length

		this.getHeaders()
	}



	this.getHeaders = function getHeaders() {

		var i = 0
	

		while(i < this.files.length ) {

			var fetchmeta = fetch(this.files[i].url, {

			  method: "HEAD"

			})

			this.mapDatas[this.files[i].url] = this.files[i]

			fetchmeta.then( 

				(function(response){

					this.onLoadedMetadata(response, this.mapDatas[response.url])

				}).bind(this), 

				(function(error){
					
					this.onErrorMetadata(error)

				}).bind(this)
			)

			i++
		}

	};

	this.loadQueue = function() { 

		var fetchdata = fetch(this.buffer[this.currentLoadingIndex].url, {

		  method: "GET",

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

				this.onLoadedFile(response, fetchdata.data)

			}).bind(this)
		)

		.catch( function(error) {

		  console.log('There has been a problem with your fetch operation: ' + error.message)

		})
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

		this.totalWeight += parseInt( response.headers.get("Content-Length") )

		data.weight = parseInt( response.headers.get("Content-Length") )

		this.buffer.push(data)

		this.loadedMetadata++

		if( this.totalFiles === this.loadedMetadata ) {

			this.nextIndexQueue()
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

			this.mapEvent[name](data)

		} 
	}
}

module.exports = FetchLoader;
