// let neurons = []
let layer = null
let pressedObject = null
let prevMouseX = 0
let prevMouseY = 0


function setup() {
	createCanvas(640, 480)
	// neurons.push(new Neuron())
	layer = new Layer()
	
}

function draw() {
	background(51)
	layer.update()
	for (let neuron of layer.neuronList) {
		if (neuron == pressedObject) {
			neuron.position = createVector(mouseX, mouseY)
		}
		neuron.update()
	}

	// Draw phase
	layer.draw()
	// for (let neuron of layer.neuronList) {
	// 	neuron.draw()
	// }
	
	//console.log("diff: " + (mouseX-prevMouseX) + ", " + (mouseY-prevMouseY))
	afterDraw()
}

function afterDraw() {
	prevMouseX = mouseX
	prevMouseY = mouseY
}

function mousePressed() {
	for (let neuron of layer.neuronList) {
		if (neuron.isMouseover()) {
			pressedObject = neuron
			return
		}
		
	}

	if (layer.addButton.isMouseover()) {
		pressedObject = layer.addButton
		layer.addButton.onClick()
		return
	}

	if (layer.isMouseover()) {
		pressedObject = layer
		return
	}

	pressedObject = null
}

function mouseReleased() {
	pressedObject = null
}

function isMouseoverCircle(x, y, radius) {
	return (mouseX - x)**2 + (mouseY - y)**2 <= radius**2
}

class Layer {
	constructor() {
		this.neuronList = []
		this.width = 100
		this.height = height
		this.position = createVector(width/2,0)
		this.color = color(0,200,250, 150)
		this.addButton = new Button(this, this.position.x, this.height/2)

	}

	createNeuron() {
		let neuron = new Neuron()
		this.neuronList.push(neuron)
	}


	isMouseover() {
		return mouseX >= this.position.x - this.width/2 
			&& mouseX <= this.position.x + this.width/2
	}

	update() {
		const dx = (mouseIsPressed && pressedObject == this && this.isMouseover()) ? (mouseX-prevMouseX) : 0
		this.position.add(dx, 0)

		for (let neuron of this.neuronList) {
			neuron.update(dx, 0)
		}
		this.addButton.update(dx, 0)
	}

	draw() {
		const isEmpty = this.neuronList.length < 1
		push()
		translate(this.position.x, this.position.y)
		// Rectangle
		fill(this.color)
		strokeWeight(this.isMouseover() ? 3 : 1)
		rect(-this.width/2, 0, this.width, this.height)
		// Anchor
		strokeWeight(1)
		fill('red')
		ellipse(0, 0, 10)
		// Text
		fill(0)
		text(("empty? " + isEmpty), 10-this.width/2, 15)
		pop()

		this.addButton.draw()
		for (let neuron of this.neuronList) {
			neuron.draw()
		}
	}
}

class Button {
	constructor(layer, x, y) {
		this.position = createVector(x,y)
		this.radius = 25
		this.layer = layer
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
		push()
		translate(this.position)
		strokeWeight(isMouseover ? 3 : 1)
		ellipse(0,0, this.radius*2)
		textAlign(CENTER,CENTER)
		textSize(this.radius*1.5)
		strokeWeight(1)
		text("+", 0, this.radius/12.5)
		pop()
	}
}

class Neuron {
	constructor() {
		this.position = createVector(150,200)
		this.radius = 25
		this.color = 'green'
	}

	isMouseover() {
		return isMouseoverCircle(this.position.x, this.position.y, this.radius)
	}

	update(dx=0, dy=0) {
		this.position.add(dx,dy)
	}

	draw() {
		push()
		fill(this.color)
		ellipse(this.position.x, this.position.y, this.radius*2)
		pop()
	}
}