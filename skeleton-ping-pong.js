/* Code partially with courtesy of Kushagra Agarwal 
  http://cssdeck.com/labs/ping-pong-game-tutorial-with-html5-canvas-and-sounds */

// RequestAnimFrame: a browser API for getting smooth animations
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame    || 
		window.oRequestAnimationFrame      || 
		window.msRequestAnimationFrame     ||  
		function( callback ){
			return window.setTimeout(callback, 1000 / 60);
		};
})();

window.cancelRequestAnimFrame = ( function() {
	return window.cancelAnimationFrame          ||
		window.webkitCancelRequestAnimationFrame    ||
		window.mozCancelRequestAnimationFrame       ||
		window.oCancelRequestAnimationFrame     ||
		window.msCancelRequestAnimationFrame        ||
		clearTimeout
} )();


// Initialize canvas and required variables
var canvas = document.getElementById("canvas"),
		ctx = canvas.getContext("2d"), // Create canvas context
		width = window.innerWidth, // Window's width
		height = window.innerHeight, // Window's height
		particles = [], // Array containing particles
		ball = {}, // Ball object

		/* TODO 1: Initialize variables topPaddle, bottomPaddle,
		 		   paddleSpeed, points, playerMode, and over
		topPaddle: object to track top paddle position, initialize to object with no attributes
		bottomPaddle: object to track bottom paddle position, initialize to object with no attributes
		paddleSpeed: initialize to initial paddle speed 25
		points = 0: Variable to store points, initialize to 0 
		over: flag varialbe, changed when the game is over, initialize to 0 (game not over)
		playerMode: indicator variable for single player or two players, initialize to 0 (two players) */

		paddles = [2], // Array containing two paddles
		fps = 60, // Max FPS (frames per second)
		particlesCount = 20, // Number of sparks when ball strikes the paddle
		flag = 0, // Flag variable which is changed on collision
		particlePos = {}, // Object to contain the position of collision 
		multipler = 1, // Varialbe to control the direction of sparks
		startBtn = {}, // Start button object
		restartBtn = {}, // Restart button object
		init, // variable to initialize animation
		paddleHit;

canvas.addEventListener("mousedown", btnClick, true);

// TODO 2: Add a document keyboard event listener that uses the method: trackKeyboard

// Initialize the collision sound
collision = document.getElementById("collide");

// Set the canvas's height and width to full screen
canvas.width = width;
canvas.height = height;

// Function to paint canvas
function paintCanvas() {
	/* TODO 3: Paint the canvas "black" and 
		and fill the canvas rectangle to canvas.width 
		and canvas.height */
}

// Function for creating paddles
function Paddle(pos) {
	// Height and width
	this.h = 5;
	this.w = 150;
	
	// Paddle's position
	this.x = width/2 - this.w/2;
	this.y = (pos == "top") ? 0 : height - this.h;

	topPaddle.x = width/2 - this.w/2;
	bottomPaddle.x = width/2 - this.w/2;
}

// Push two new paddles into the paddles[] array
paddles.push(new Paddle("bottom"));
paddles.push(new Paddle("top"));

// Ball object
ball = {
	x: 50,
	y: 50, 
	r: 5,
	c: "white",
	vx: 4,
	vy: 8,
	
	// Function for drawing ball on canvas
	draw: function() {
		ctx.beginPath();
		ctx.fillStyle = this.c;
		ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
		ctx.fill();
	}
};


// Single Player Button object]
singlePlayerBtn = {
	w: 150,
	h: 50,
	x: width/3.5 - 50,
	y: height/2 - 25,
	
	draw: function() {
		ctx.strokeStyle = "white";
		ctx.lineWidth = "2";
		ctx.strokeRect(this.x, this.y, this.w, this.h);
		
		ctx.font = "18px Arial, sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStlye = "white";
		ctx.fillText("Two Players", this.x + 70, this.y + 20 );
	}
};

//Two player button
twoPlayerBtn = {
	w: 150,
	h: 50,
	x: width/1.5 - 50,
	y: height/2 - 25,
	
	draw: function() {
		ctx.strokeStyle = "white";
		ctx.lineWidth = "2";
		ctx.strokeRect(this.x, this.y, this.w, this.h);
		
		ctx.font = "18px Arial, sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStlye = "white";
		ctx.fillText("Single Player", this.x + 70, this.y + 20 );
	}
};


// Function for creating particles object
function createParticles(x, y, m) {
	this.x = x || 0;
	this.y = y || 0;
	
	this.radius = 1.2;
	
	this.vx = -1.5 + Math.random()*3;
	this.vy = m * Math.random()*1.5;
}

// Draw everything on canvas
function draw() {
	paintCanvas();
	for(var i = 0; i < paddles.length; i++) {
		p = paddles[i];
		
		ctx.fillStyle = "white";
		ctx.fillRect(p.x, p.y, p.w, p.h);
	}
	
	ball.draw();
	update();
}

// Function to increase speed after every 5 points
function increaseSpd() {
	if(points % 10 == 0) {
		if(Math.abs(ball.vx) < 15) {
			ball.vx += (ball.vx < 0) ? -1 : 1;
			ball.vy += (ball.vy < 0) ? -2 : 2;
		}
		paddleSpeed /= 1.2;
	}
}

// Track keyboard presses
function trackKeyboard(e) {
    var key = e.which;

    if(key == "74") bottomPaddle.x = "left"; //bottom paddle go left
    /* TODO 5: Implement the rest of the track keyboard method 
        key mappings: "76": l, "65": a, "68": d */
}

// Function to update positions, score and everything.
// Basically, the main game logic is defined here
function update() {
	// Update scores
	updateScore(); 

	// Move the ball
	ball.x += ball.vx;
	ball.y += ball.vy;
	
	// Collision with paddles
	p1 = paddles[1];
	p2 = paddles[2];

	if (over < 1) {
		// Move the paddles on key press
		if (bottomPaddle.x == "left" ) {
			var newBPos =  p1.x - p.w/paddleSpeed;
			if (newBPos > 0) {
				p1.x = newBPos;
			} else {
				p1.x = 0;
			}
		} else if (bottomPaddle.x == "right" ) {
			var newBPos = p1.x + p.w/paddleSpeed;
			if (newBPos < canvas.width-150) {
				p1.x = newBPos;
			} else {
				p1.x = canvas.width-150;
			}
		}

		/* TODO 6: Implement the update paddle if/else if statements for topPaddle
					This is very similar to the if/else if statements for bottomPaddle */

		if (playerMode > 0) {
			/* TODO 7 (CHALLENGE) Implement the methods for finding predictedX that
				will allow the computer to predict the position that the ball will hit
				the wall. */
			var predictedX;

			if (p2.x + p2.w/2 > predictedX) {
				topPaddle.x = "left";
			} else if (p2.x - p2.w < predictedX) {
				topPaddle.x = "right";
			}
		}
	}
	
	// If the ball strikes with paddles,
	// invert the y-velocity vector of ball,
	// increment the points, play the collision sound,
	// save collision's position so that sparks can be
	// emitted from that position, set the flag variable,
	// and change the multiplier
	if(collides(ball, p1)) {
		collideAction(ball, p1);
	}
	
	
	else if(collides(ball, p2)) {
		collideAction(ball, p2);
	} 
	
	else {
		// Collide with walls, If the ball hits the top/bottom,
		// walls, run gameOver() function
		if(ball.y + ball.r > height) {
			ball.y = height - ball.r;
			gameOver();
		} 
		
		else if(ball.y < 0) {
			ball.y = ball.r;
			gameOver();
		}
		
		// If ball strikes the vertical walls, invert the 
		// x-velocity vector of ball
		if(ball.x + ball.r > width) {
			ball.vx = -ball.vx;
			ball.x = width - ball.r;
		}
		
		else if(ball.x -ball.r < 0) {
			ball.vx = -ball.vx;
			ball.x = ball.r;
		}
	}
	
	
	
	// If flag is set, push the particles
	if(flag == 1) { 
		for(var k = 0; k < particlesCount; k++) {
			particles.push(new createParticles(particlePos.x, particlePos.y, multiplier));
		}
	}	
	
	// Emit particles/sparks
	emitParticles();
	
	// reset flag
	flag = 0;
}

//Function to check collision between ball and one of
//the paddles
function collides(b, p) {
	if(b.x + ball.r >= p.x && b.x - ball.r <=p.x + p.w) {
		if(b.y >= (p.y - p.h) && p.y > 0){
			paddleHit = 1;
			return true;
		}
		
		else if(b.y <= p.h && p.y == 0) {
			paddleHit = 2;
			return true;
		}
		
		else return false;
	}
}

//Do this when collides == true
function collideAction(ball, p) {
	ball.vy = -ball.vy;
	
	if(paddleHit == 1) {
		ball.y = p.y - p.h;
		particlePos.y = ball.y + ball.r;
		multiplier = -1;	
	}
	
	else if(paddleHit == 2) {
		ball.y = p.h + ball.r;
		particlePos.y = ball.y - ball.r;
		multiplier = 1;	
	}
	
	points++;
	increaseSpd();
	
	if(collision) {
		if(points > 0) 
			collision.pause();
		
		collision.currentTime = 0;
		collision.play();
	}
	
	particlePos.x = ball.x;
	flag = 1;
}

// Function for emitting particles
function emitParticles() { 
	for(var j = 0; j < particles.length; j++) {
		par = particles[j];
		
		ctx.beginPath(); 
		ctx.fillStyle = "white";
		if (par.radius > 0) {
			ctx.arc(par.x, par.y, par.radius, 0, Math.PI*2, false);
		}
		ctx.fill();	 
		
		par.x += par.vx; 
		par.y += par.vy; 
		
		// Reduce radius so that the particles die after a few seconds
		par.radius = Math.max(par.radius - 0.05, 0.0); 
		
	} 
}

// Function for updating score
function updateScore() {
	ctx.fillStlye = "white";
	ctx.font = "16px Arial, sans-serif";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Score: " + points, 20, 20 );
}

// Function to run when the game overs
function gameOver() {
	ctx.fillStlye = "white";
	ctx.font = "20px Arial, sans-serif";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText("In Single Player Mode, use keys 'j' and 'l' to move the bottom paddle. In two player mode, use keys 'a' and 'd' to also move top paddle.", width/2, height/4 + 25 );

	ctx.fillStlye = "white";
	ctx.font = "20px Arial, sans-serif";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText("Game Over - You scored "+points+" points!", width/2, height/2 + 25 );
	
	// Stop the Animation
	cancelRequestAnimFrame(init);
	
	// Set the over flag
	over = 1;
	
	// Show the restart button
	singlePlayerBtn.draw();
	twoPlayerBtn.draw();
}

// Function for running the whole animation
function animloop() {
	init = requestAnimFrame(animloop);
	draw();
}

// Function to execute at startup
function startScreen() {
	draw();

	ctx.fillStlye = "white";
	ctx.font = "20px Arial, sans-serif";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText("In Single Player Mode, use keys 'j' and 'l' to move the bottom paddle. In two player mode, use keys 'a' and 'd' to also move top paddle.", width/2, height/4 + 25 );

	singlePlayerBtn.draw();
	twoPlayerBtn.draw();
}

// On button click
function btnClick(e) {
	
	// Variables for storing mouse position on click
	var mx = e.pageX, my = e.pageY;

	// If the game is over
	if(over == 1) {
		ball.x = 0;
		ball.y = 20;
		points = 0;
		ball.vx = 4;
		ball.vy = 8;
		paddles = [2];
		paddles.push(new Paddle("bottom"));
		paddles.push(new Paddle("top"));
		paddleSpeed = 25;
		over = 0;
	}
	
	// Click single player button
	if(mx >= singlePlayerBtn.x && mx <= singlePlayerBtn.x + singlePlayerBtn.w) {
		playerMode = 0;
		animloop();
	// Click the two players button
	} else if(mx >= twoPlayerBtn.x && mx <= twoPlayerBtn.x + twoPlayerBtn.w) {
		playerMode = 1;
		animloop();
	}
}

// Show the start screen
startScreen();