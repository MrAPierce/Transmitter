Node.js RC Transmitter
======================

Based off the function of a regular radio transmitter. Built for raspberrypi 256, client was surface pro IE10 (all I had available) so touch on other devices may not function as expected.

![Alt text](/screen.jpg?raw=true "Node.JS Transmitter")

Raspberry pi serves website and client connects back to raspberry pi via websocket connection. Data is send 50 time a second, sent via websocket as Uint16Array(16) via a webworker.

UI updating is handled by utilizing requestAnimationFrame which produces smooth movement of ui controls and feedback.


### Hardware: 
	Raspberry PI,
	Adafruit 16 Ch I2C Servo Controller
	
### Server:
	Node.js
	Adafruit 16 Ch - Driver (found on npm)

### Client
	Surface Pro 1

### Installing / Setup
Install node.js on raspberry pi, deploy site to pi, run server.js via node.
	

### Features
	General UI
		Control Positioning
		Control Styling
		Touch Feedback
		Mixing Feedback
		Fast Update

	Joystick Control
		End Points
		Exponential Range
		Centring
		Mixing

	ServoSlave Control
		Input Mixing
		Output Mixing

	Position Switch
		Dynamic Button Switch
		Vert/Hor Layout
		

### Left to do
	
	Controls
		Servoslave convert from min,center,max to percentage
	Server
		install spi module, download mcp3008.js
	Interface
		Data rate etc interface, change data rate
		IOS touch event
		Drag and drop controls from controls intrface
		Add more style options
	Future
		Track view Editor for Recording of movements, tweaking of movements
		Camera Stream
		Port to UI to Knockoutjs





