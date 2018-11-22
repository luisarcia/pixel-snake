const canvas		= $('#canvas')[0];
const ctx 			= canvas.getContext('2d');
let width 			= $( canvas ).width();
let height 			= $( canvas ).height();
let direction 		= 'right';
let prevPosition 	= direction;
const time 			= 60;
const block 		= 20;
const blocksX		= width / block;
const blocksY		= height / block;
const key 			= { 65: 'left', 83 : 'down', 68: 'right', 87 :'up', 32:'space' }
let snake 			= [ {x:4, y:10}, {x:3, y:10}, {x:2, y:10}, {x:1, y:10} ];
let score			= 0;
let apple;
let appleImg		= new Image();
let loop;
appleImg.src 		= 'images/apple.png';

function draw( snake ) {
	for (var i = 0; i < snake.length; i++) {
		var x = snake[i].x * block;
		var y = snake[i].y * block;

		ctx.fillStyle 	= 'white';
		ctx.strokeStyle = 'rgba(74, 20, 140, 0.5)';
		ctx.lineWidth 	= 4;
		roundRect(ctx, x,  y,  block, block, 6, true, true);

	}
	ctx.drawImage(appleImg, apple.x * block, apple.y * block, block, block);
}

function start() {
	newApple();
	controls();

	loop = setInterval(function() {
		refreshFrame();
		move();
		eat();
		crashBorders();
		draw( snake );
	}, time);
}

function restart() {
	
	clear();
	start();
}

function clear() {
	refreshFrame();
	direction 		= 'right';
	prevPosition 	= 'right';
	snake 			= [ {x:4, y:10}, {x:3, y:10}, {x:2, y:10}, {x:1, y:10} ];
	score			= 0;
	$('.score span:nth-child(1), .score-gameover span:nth-child(1)').text( 0 );
}

function gameOver() {
	clearInterval(loop);
	s_crash.play();

	setTimeout(function() {
		$('#gameover').show();
		$('.score-gameover span:nth-child(1)').text( score );
	}, 500);
	
}

function controls() {
	$( window ).keydown(function(e) {
		e.preventDefault();

		direction = key[e.keyCode];
		
		setDirection(direction);
	});
}

function move() {
	snake.pop();

	var snakeX = snake[0].x;
	var snakeY = snake[0].y;

	switch( prevPosition ) {
		case 'right':
			snakeX += 1;
			break;
		case 'left':
			snakeX -= 1;
			break;
		case 'up':
			snakeY -= 1;
 			break;
		case 'down':
			snakeY += 1;
			break;    
	}

	let nextPosition = {
		x: snakeX,
		y: snakeY
	}

	crashMe( nextPosition, snake );

	snake.unshift( nextPosition );
}

function setDirection( direction ) {
	switch( direction ) {
		case 'left':
			if( prevPosition !== 'right') prevPosition = direction;
        break;
		case 'right':
			if( prevPosition !== 'left') prevPosition = direction;
		break;
		case 'up':
			if( prevPosition !== 'down') prevPosition = direction;
       	break;
		case 'down':
			if( prevPosition !== 'up') prevPosition = direction;
		break;
	}
}

function eat() {
	if( snake[0].x == apple.x && snake[0].y == apple.y ) {
		s_eat.play();

		var newBlock = {
			x: snake[0].x,
			y: snake[0].y
		}

		snake.push( newBlock );

		newApple();
		score += 1

		$('.score span:nth-child(1)').text( score );
		$('.score span:nth-child(2) img').addClass('ani-zoom');
		$('.score span:nth-child(2) img').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
			$(this).removeClass('ani-zoom')
		});
	}
}

function newApple() {
	var x = Math.floor( Math.random() * blocksX )
	var y = Math.floor( Math.random() * blocksY )

	var newApple = {x: x, y: y};

	apple = {
		x : Math.floor( Math.random() * blocksX ),
		y : Math.floor( Math.random() * blocksY )
	};
}

function crashBorders() {	
	if( snake[0].x < 0 || snake[0].x == blocksX || snake[0].y < 0 || snake[0].y == blocksY ) {
		gameOver();
	}
		
	return false;
}

function crashMe( newBlock, current ) {
	for (var i = 0; i < current.length; i++) {
		if( newBlock.x == current[i].x && newBlock.y == current[i].y ) {
			gameOver();
		}
	}

	return false;
}

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
	if (typeof stroke == 'undefined') stroke = true;
	if (typeof radius === 'undefined') radius = 5;

	if (typeof radius === 'number') {
		radius = {tl: radius, tr: radius, br: radius, bl: radius};
	} else {
		var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};

		for (var side in defaultRadius) {
			radius[side] = radius[side] || defaultRadius[side];
		}
	}

	ctx.beginPath();
	ctx.moveTo(x + radius.tl, y);
	ctx.lineTo(x + width - radius.tr, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
	ctx.lineTo(x + width, y + height - radius.br);
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
	ctx.lineTo(x + radius.bl, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
	ctx.lineTo(x, y + radius.tl);
	ctx.quadraticCurveTo(x, y, x + radius.tl, y);
	ctx.closePath();
		
	if (fill) ctx.fill();
	if (stroke) ctx.stroke();
}

function refreshFrame() {
	ctx.clearRect(0, 0, width, height);
}

$('#start-btn').click(function() {
	$('#start, #gameover').hide();
	start();
})

$('#restart-btn').click(function() {
	$('#start, #gameover').hide();
	restart();
})

$('#home-btn').click(function() {
	$('#gameover').hide();
	$('#start').show();
	clear();
	
})