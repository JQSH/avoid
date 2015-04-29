
BasicGame.Game = function (game) {
};

BasicGame.Game.prototype = {

    create: function () {
    	
    	// Set physics
    	this.game.physics.startSystem(Phaser.Physics.ARCADE);
    	
    	// Prevent page from moving
        this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
        this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.UP]);
        this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.DOWN]);
    	
    	// Game settings
    	this.bgColourChange(); // Set random background colour
    	this.second = 0; // Initiate time tracker
    	this.gameOver = false; // Game is starting, and not over
    	
    	// Display level information
    	this.currentScore = this.game.add.text(40, 40, "0", { font: "40px Helvetica", fill:
        "#ffffff" }); // Add score text
        this.currentScore.anchor.set(0.5); // Center text anchor point
        this.currentScore.alpha = 0.7 // Make text transparent
        this.score = 0; // Initialise score
    	
    	// Square settings
        this.squares = this.game.add.group(); // Create enemy square group
        this.squares.enableBody = true; // Add physics to future group members
    	this.squares.createMultiple(10, 'square'); // Create 10 squares (hidden off-screen)
    	this.lvlScale = 0.5; // Set initial square size
    	this.lvlAlpha = 0.7; // Set square transparency
    	this.lvlVelocity = 100; // Set square velocity
    	
    	// Player settings
        this.player = this.add.sprite(this.game.world.width / 2, this.game.world.height / 2, 'square'); // Add and position player to center
        this.player.tint = 0x111111; // Set player colour
        this.player.alpha = 0.6; // Set player transparency
        this.playerScale = 0.5; // Set initial player scale
        this.player.scale.set(this.playerScale,this.playerScale); // Set initial player size
        this.game.physics.arcade.enable(this.player); // Add physics to player
        this.player.body.collideWorldBounds = true; // Prevent player from exiting map
        this.player.anchor.setTo(0.5,0.5); // Center player anchor
        this.playerSpeed = 150; // Set initial player speed
        this.playerFull = false; // Player is hungry
        
        //this.emitter = this.game.add.emitter(0, 0, 200);
   		//this.emitter.makeParticles('tiny');
   		//this.emitter.setAlpha(0.1, 0.6);
   		//this.emitter.minRotation = 0;
   		//this.emitter.maxRotation = 0;
    	//this.emitter.gravity = 150;
    	//this.emitter.bounce.setTo(0.5, 0.5);
        
        
        // Food settings
        this.food = this.game.add.group(); // Create food group
        this.food.enableBody = true; // Add physics to future group member
        this.food.createMultiple(1, 'square'); // Create 1 piece of food (hidden off-screen)
        this.yummy; // Create global yummy variable (individual food member)
        this.foodSpawn(); // Call food spawning function
        this.nom = 0; // No food has been eaten yet
        
        // Input controls
		cursors = this.game.input.keyboard.createCursorKeys(); // Shorten input code
		
		// Game timer
        this.timer = this.game.time.events.loop(1000, this.gameEvents, this); // 1000ms = 1 second

    },
    
    bgColourChange: function () { // Background randomiser
    	var rand = Math.floor(Math.random() * 10); // Pick a number, 0-9
    	switch (rand) {
    				case 0:
    						return this.game.stage.backgroundColor = "FF0040";
    						break; // Red
    				case 1:
    						return this.game.stage.backgroundColor = "FF00BF";
    						break; // Pink
    				case 2:
    						return this.game.stage.backgroundColor = "8000FF";
    						break; // Purple
    				case 3:
    						return this.game.stage.backgroundColor = "0080FF";
    						break; // Blue
    				case 4:
    						return this.game.stage.backgroundColor = "01DFD7";
    						break; // Cyan
    				case 5:
    						return this.game.stage.backgroundColor = "80FF00";
    						break; // Green
    				case 6:
    						return this.game.stage.backgroundColor = "BFFF00";
    						break; // Lime green
    				case 7:
    						return this.game.stage.backgroundColor = "D7DF01";
    						break; // Yellow
    				case 8:
    						return this.game.stage.backgroundColor = "FFBF00";
    						break; // Gold
    				default:
    						return this.game.stage.backgroundColor = "0080FF";
    						// Blue
    			}
    },
    
    playerControls: function () { // Player control handler
    	if (cursors.left.isDown) {
    		this.player.body.velocity.x = -this.playerSpeed; // Left
    	}
    	if (cursors.right.isDown) {
    		this.player.body.velocity.x = this.playerSpeed; // Right
    	}
    	if (cursors.up.isDown) {
    		this.player.body.velocity.y = -this.playerSpeed; // Up
    	}
    	if (cursors.down.isDown) {
    		this.player.body.velocity.y = this.playerSpeed; // Down
    	}
    },
    
    gameEvents: function () { // Game event loop
    	if (!this.gameOver) { // If game is not over, run code
    		this.second += 1; // Add a 'second' each time function is called
    	
    		if (this.second % 5 === 0 && this.second !== 0) { // Do this every 5 'seconds'
    			this.lvlScale += 0.025; // Increase enemy size
    			if (this.lvlAlpha < 0.7) { // Stop code at desired transparency
    			this.lvlAlpha += 0.025; // Make enemies more opaque over time
    			}
    			this.lvlVelocity += 10; // Increase enemy velocity over time
    			this.timer.delay -= 5; // Speed up game loop
    			this.playerSpeed += 10; // Increase player speed over time
    			this.bgColourChange(); // Change bg colour
    		
    		}
    		
    		// Square member settings
    	
    		var square = this.squares.getFirstDead(); // Get first square
    		square.reset(this.dWidth(),this.dHeight()); // Randomly place it on screen
    		square.scale.setTo(this.lvlScale + Math.floor(Math.random() * 1),this.lvlScale + Math.floor(Math.random() * 1)); // (inactive) Set random scale
    		square.alpha = this.lvlAlpha; // Set transparency
    	
    		if (square.x < this.player.x) { // If square is left of player
    			square.body.velocity.x = this.lvlVelocity; // Move right
    		}
    		else if (square.x > this.player.x) { // If square is right of player
    			square.body.velocity.x = -this.lvlVelocity; // Move left
    		}
    		if (square.y < this.player.y) { // If square is below player
    			square.body.velocity.y = this.lvlVelocity; // Move up
    		}
    		else if (square.y > this.player.y) { // If square is above player
    			square.body.velocity.y = -this.lvlVelocity; // Move down
    		}
    	
   			square.checkWorldBounds = true; // Did square exit map?
   			square.outOfBoundsKill = true; // If yes, then 'kill' it
    	}
    },
    
    dWidth: function () { // Randomised square width position
    	var random = Math.floor(Math.random() * 2); // Pick a number 0-1
    	
    	if (random === 0) { // If 0
    		return 0 + Math.floor(Math.random() * 300); // Set left of screen
    	}
    	else if (random === 1) { // If 1
    		return this.game.world.width - Math.floor(Math.random() * 300); // Set right of screen
    	}
    },
    
    dHeight: function () { // Randomised square height position
    	var random = Math.floor(Math.random() * 2); // Pick a number 0-1
    	
    	if (random === 0) { // If 0
    		return 0 + Math.floor(Math.random() * 100); // Set top of screen
    	}
    	else if (random === 1) { // If 1
    		return this.game.world.height - Math.floor(Math.random() * 100); // Set bottom
    	}
    },
    
    foodSpawn: function () { // Food member settings
		this.yummy = this.food.getFirstDead(); // Select food
		this.yummy.tint = 0xFFDFDF; // Give it a pink tint
		this.yummy.alpha = 0.9; // Add some transparency
		this.yummy.scale.set(0.25,0.25); // Set size to 1/4 of square.png
		this.yummy.anchor.set(0.5); // Center anchor
		this.yummy.body.collideWorldBounds = true; // Prevent food from spawning outside map
		this.yummy.reset(this.game.world.randomX, this.game.world.randomY); // Set position
	},
	
	eat: function () { // Each time food is eaten
		this.score += 1; // Add 1 to score
		this.currentScore.text = this.score; // Update score text
		this.nom += 1; // Add 1 to nom streak
		if (this.nom === 7) { // If player reaches 7 noms
			this.playerFull = true; // Set player to full
		}
		this.yummy.reset(this.game.world.randomX, this.game.world.randomY); // Reset food position
		this.playerScale += 0.125; // Increase player scale by 1/8th
		this.player.scale.set(this.playerScale,this.playerScale); // Update player size
	},
	
	playerRage: function () { // (inactive) If player is full, squares die instead of player
		this.squares.remove(); // Kill square
	},
	
	playerHungry: function () { // Reset player hunger
		this.playerFull = false; // Player is no longer full
		this.nom = 0; // Nom streak reset to 0
		this.player.alpha = 0.6; // Reset player transparency
		this.playerScale = 0.5; // Reset player scale
		this.player.scale.set(this.playerScale,this.playerScale); // Update player size
	},
	
	submitScore: function (username, score) {
		
		var http = new XMLHttpRequest();
		var url = "setScore.php";
		var params = username+score;
		http.open("POST", url, true);

		//Send the proper header information along with the request
		http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		http.setRequestHeader("Content-length", params.length);
		http.setRequestHeader("Connection", "close");

		http.onreadystatechange = function() {//Call a function when the state changes.
   		 if(http.readyState == 4 && http.status == 200) {
     		   alert(http.responseText);
    		}
		}
		http.send(params);
		
},
		
    // UPDATE	

    update: function () {
    	
    	//this.emitter.x = this.yummy.x;
   		//this.emitter.y = this.yummy.y;
    	//this.emitter.start(true, 200, null, 1);
    	
    	// Prevent player from drifting into space
    	this.player.body.velocity.x = 0;
    	this.player.body.velocity.y = 0;
    	
    	// Restart button
    	this.playerControls();
    	if (this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
    		this.restartGame();
    	}
    	if (this.game.input.keyboard.isDown(Phaser.Keyboard.P)) {
    		this.playerFull = true;
    	}
    	
    	// Run code if player is hungry
    	if (!this.playerFull) {
    	this.game.physics.arcade.overlap(this.player, this.squares, this.gameOverScreen, null,
        this); // If player hits square, call gameOverScreen function
    	}
    	
        this.game.physics.arcade.overlap(this.player, this.food, this.eat, null,
        this); // When player 'eats' food, call this.eat function
        
        // Run code when player is full
        if (this.playerFull) {
        	this.game.physics.arcade.overlap(this.player, this.squares, this.playerRage, null,
        this); // Player can walk through squares without dying
        	if (this.second % 2 === 0 && this.player.alpha > 0.1) { // Every 2 seconds
        		this.player.alpha -= 0.1; // Flash player transparency to indicate invulnerability
       	 	}
        	else {
        		this.player.alpha = 0.6;
        	}
        // After 10 seconds have passed, make player Hungry again
        this.game.time.events.add(10000, this.playerHungry, this); 
        }

    },
    
    // RESTART
    
    restartGame: function () {
    this.state.start('Game'); // Reset game
    },
    
    // GAME OVER

    gameOverScreen: function () {
    	//this.submitScore("test",this.score);
    	this.gameOver = true; // Set game over
    	this.player.kill(); // Remove player from screen
    	this.squares.removeAll(); // Remove all squares
    	this.food.removeAll(); // Remove food
    	if (this.score > localStorage.getItem("highscore")) {
                localStorage.setItem("highscore", this.score);
        }
    	this.finalScore = this.game.add.text(this.game.world.width / 2 , this.game.height / 2, "" + this.score, { font: "60px Helvetica", fill:
    "#ffffff" }); // Display final score
    	this.finalScore.text = "Score: " + this.score; // Update final score text
    	this.finalScore.anchor.set(0.5); // Center final score
    	this.info = this.game.add.text(this.finalScore.x, this.finalScore.y + 50, "Press [Enter] to restart", { font: "21px Helvetica", fill:
    "#ffffff" }); // Add restart game information
    	this.info.anchor.set(0.5); // Center game information
    	this.highScore = this.game.add.text(this.info.x, this.info.y + 50, "High Score: " + localStorage.getItem("highscore"), { font: "30px Helvetica", fill:
    "#ffffff" });
    	this.highScore.anchor.set(0.5);
    	this.currentScore.text = ""; // Clear current score text
    }

};
