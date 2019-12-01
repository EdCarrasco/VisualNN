NEURON_COLOR = 'orange'

let inputX = []
let inputY = []
let dataReceived = false
let inputLayerExists = false

let layers = []
let clickedObject = null
let prevMouseX = 0
let prevMouseY = 0

let xhttp = new XMLHttpRequest()
xhttp.onreadystatechange = function() {
	if (xhttp.readyState === 4 && xhttp.status === 200) {
		let lines = xhttp.response.split('\n')
		for (let line of lines) {
			let strings = line.split(' ')
			let sample = []
			for (let i = 0; i < strings.length; i++) {
				let number = parseInt(strings[i])
				if (i == 0) {
					inputY.push(number)
				} else {
					sample.push(number)
				}
				
			}
			inputX.push(sample)
		}
		console.log(inputX)
		dataReceived = true
	}
}
xhttp.open('GET', 'https://raw.githubusercontent.com/EdCarrasco/VisualNN/master/data1.txt', false)
xhttp.send(null)


function setup() {
	createCanvas(640, 480)
	// neurons.push(new Neuron())
	layers.push(new Layer(width*0.4))
	layers.push(new Layer(width*0.8))
}

function draw() {
	background(51)
	if (dataReceived && !inputLayerExists) {
		createInputLayer()
	}
	// Update phase
	for (let layer of layers) {
		layer.update()
	}

	// Draw phase
	for (let i = layers.length-1; i >= 0; i--) {
		layers[i].draw()
	}
	// Final phase
	prevMouseX = mouseX
	prevMouseY = mouseY
}

function createInputLayer() {
	let inputLayer = new Layer(width*0.2, {type:'input'})
	layers.push(inputLayer)
	const numFeatures = inputX.length >= 1 ? inputX[0].length : 0
	for (let i = 1; i <= numFeatures; i++) {
		inputLayer.createNeuron({value:i})
	}
	inputLayerExists = true
}

function mousePressed() {
	// Check neurons
	for (let layer of layers) {
		for (let neuron of layer.neuronList) {
			if (neuron.isMouseover()) {
				clickedObject = neuron
				return
			}
			
		}
	}

	// Check buttons
	for (let layer of layers) {
		if (layer.addButton.isMouseover()) {
			clickedObject = layer.addButton
			layer.addButton.onClick()
			return
		}
	}

	// Check layers
	for (let layer of layers) {
		if (layer.isMouseover()) {
			clickedObject = layer
			layer.onClick()
			return
		}	
	}
	

	// didnt click any object
	clickedObject = null
}

function mouseReleased() {
	clickedObject = null
}

function isMouseoverCircle(x, y, radius) {
	return (mouseX - x)**2 + (mouseY - y)**2 <= radius**2
}

function getNextRatio(ratio) {
	return (ratio < 0.9) ? 0.01 + ratio*1.2 : (ratio > 1) ? ratio*0.995 : 1
}

// ==================================================================
class Layer {
	constructor(x, options={}) {
		this.type = options.type || 'hidden'
		this.neuronList = []
		this.width = 100
		this.height = height
		this.position = createVector(x,0)
		this.color = color(0,200,250, 150)
		this.ratio = 0
		this.radius = 25
		this.addButton = new Button(this, this.position.x, this.height-30, this.radius)
	}

	createNeuron(options={}) {
		if (this.neuronList.length >= 6) {
			console.log("Layer::createNeuron() Cannot have more than 6 neurons on a layer.")
			return
		}
		let padding = 5
		let neuronHeight = (this.neuronList.length >= 1) ? (this.neuronList[this.neuronList.length-1].position.y + this.radius + padding) : this.height/2
		let neuron = new Neuron(this.position.x, neuronHeight, this.radius, options)
		this.moveNeurons(- this.radius - padding)
		this.neuronList.push(neuron)
	}

	moveNeurons(y) {
		for (let neuron of this.neuronList) {
			neuron.position.add(0, y)
		}
	}


	isMouseover() {
		return mouseX >= this.position.x - this.width/2 
			&& mouseX <= this.position.x + this.width/2
	}

	onClick() {

	}

	update() {
		const dx = (mouseIsPressed && clickedObject == this) ? (mouseX-prevMouseX) : 0
		this.position.add(dx, 0)

		for (let neuron of this.neuronList) {
			neuron.update(dx, 0)
			// if (neuron == clickedObject) {
			// 	neuron.position = createVector(mouseX, mouseY)
			// }
		}
		this.addButton.update(dx, 0)
	}

	draw() {
		const isEmpty = this.neuronList.length < 1
		const width_ = this.width * this.ratio
		this.ratio = getNextRatio(this.ratio)
		push()
		translate(this.position.x, this.position.y)
		// Rectangle
		fill(this.color)
		strokeWeight(this.isMouseover() ? 3 : 1)
		rect(-width_/2, 0, width_, this.height)
		// Anchor
		strokeWeight(1)
		fill('red')
		ellipse(0, 0, 10)
		// Text
		fill(0)
		if (this.ratio == 1) {
			text(("type: " + this.type), 10-this.width/2, 15)
		}
		pop()

		if (this.ratio == 1) {
			this.addButton.draw()
			for (let i = this.neuronList.length-1; i >= 0; i--) {
				this.neuronList[i].draw()
			}
		}
	}
}

// ==================================================================
class Button {
	constructor(layer, x, y, radius) {
		this.position = createVector(x,y)
		this.radius = radius
		this.layer = layer
		this.ratio = 0
	}

	onClick() {
		this.layer.createNeuron()
	}

	isMouseover() {
		return isMouseoverCircle(this.position.x, this.position.y, this.radius)
	}

	update(dx=0, dy=0) {
		this.position.add(dx,dy)
	}

	draw() {
		const isMouseover = isMouseoverCircle(this.position.x, this.position.y, this.radius)
		const radius = this.radius * this.ratio
		this.ratio = getNextRatio(this.ratio)

		push()
		translate(this.position)
		// Circle shadow
		noStroke()
		fill(0,150)
		ellipse(2,4, radius*2)
		// Circle
		fill(200)
		stroke(50)
		strokeWeight(isMouseover ? 3 : 1)
		ellipse(0,0, radius*2)
		// Text
		textAlign(CENTER,CENTER)
		textSize(radius*1.5)
		strokeWeight(1)
		fill(51)
		text("+", 0, radius/12.5)
		pop()
	}
}

// ==================================================================
class Neuron {
	constructor(x, y, radius, options={}) {
		this.position = createVector(x,y)
		this.radius = radius
		this.color = NEURON_COLOR
		this.ratio = 0
		this.value = options.value || Math.random().toFixed(2)
		
	}

	isMouseover() {
		return isMouseoverCircle(this.position.x, this.position.y, this.radius)
	}

	update(dx=0, dy=0) {
		this.position.add(dx, dy)
	}

	draw() {
		const isMouseover = this.isMouseover()
		const radius = this.radius*2 * this.ratio
		this.ratio = getNextRatio(this.ratio)
		
		push()
		translate(this.position)
		// Circle shadow
		noStroke()
		fill(0, 50)
		ellipse(2,4, radius)
		// Circle
		stroke(0)
		strokeWeight(isMouseover ? 2 : 0)
		fill(this.color)
		ellipse(0, 0, radius)
		pop()
		// Text
		
		if (this.ratio > 0.1) {
			push()
			translate(this.position)
			fill(0)
			textAlign(CENTER,CENTER)
			textSize(radius*0.3)
			strokeWeight(1)
			text(this.value, 0, 0)	
			pop()
		}
	}
}