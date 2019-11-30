let neurons = []
let layer = null
let selectedNeuron = null

function setup() {
	createCanvas(640, 480)
	neurons.push(new Neuron())
	layer = new Layer()
}

function draw() {
	background(51)
	layer.update()
	for (let neuron of neurons) {
		if (neuron == selectedNeuron) {
			neuron.position = createVector(mouseX, mouseY)
		}
		neuron.update()
	}

	// Draw phase
	layer.draw()
	for (let neuron of neurons) {
		neuron.draw()
	}

}

function mousePressed() {
	for (let neuron of neurons) {
		if (neuron.isMouseover()) {
			selectedNeuron = neuron
		}
		break
	}
}

function mouseReleased() {
	selectedNeuron = null
}

function isMouseoverCircle(x, y, radius) {
	return (mouseX - x)**2 + (mouseY - y)**2 <= radius**2
}

class Button {
	constructor(x,y) {
		this.position = createVector(x,y)
		this.radius = 25
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

class Layer {
	constructor() {
		this.neurons = []


		this.width = 100
		this.height = height
		this.position = createVector(width/2,0)
		this.color = color(0,200,250, 150)

		this.addButton = new Button(this.position.x, this.height/2)
	}

	isEmpty() {
		return this.neurons.length < 1
	}

	isMouseover() {
		return mouseX >= this.position.x - this.width/2 
			&& mouseX <= this.position.x + this.width/2
	}

	update() {
		
	}

	draw() {
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
		text(("empty? " + this.isEmpty()), 10-this.width/2, 15)
		pop()

		this.addButton.draw()
	}
}

class Neuron {
	constructor() {
		this.position = createVector(150,200)
		this.radius = 25
		this.color = 'green'
	}

	isMouseover() {
		return dist(mouseX, mouseY, this.position.x, this.position.y) <= this.radius
	}

	isPressed() {
		return false
	}

	toggle() {

	}

	update() {
		if (this.isMouseover()) {
			this.color = 'orange'
		} else {
			this.color = 'lightyellow'
		}
	}

	draw() {
		push()
		fill(this.color)
		ellipse(this.position.x, this.position.y, this.radius*2)
		pop()
	}
}