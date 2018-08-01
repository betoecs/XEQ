const CardType =
{
	Empty: 	0,
	Cat: 	1,
	Mouse:	2
};

var game =
{
	isPlayer1: false,
	itsTurn: false,
	canvas: null,
	grid: [],

	init: function(canvas, isPlayer1)
	{
		this.isPlayer1 = isPlayer1;
		this.itsTurn = isPlayer1;

		this.canvas = canvas;
		canvas.addEventListener('click', function(event) { game.onclick(event); });

		var context = canvas.getContext('2d');

		// Draw the grid
		context.beginPath();
		context.moveTo(.33 * canvas.width, 0);
		context.lineTo(.33 * canvas.width, canvas.height);
		context.stroke();

		context.beginPath();
		context.moveTo(.66 * canvas.width, 0);
		context.lineTo(.66 * canvas.width, canvas.height);
		context.stroke();

		context.beginPath();
		context.moveTo(0, .33 * canvas.height);
		context.lineTo(canvas.width, .33 * canvas.height);
		context.stroke();

		context.beginPath();
		context.moveTo(0, .66 * canvas.height);
		context.lineTo(canvas.width, .66 * canvas.height);
		context.stroke();

		for (let i = 0; i < 9; i++)
			this.grid [i] = CardType.Emtpy;

		context.strokeStyle = 'red';
	},

	onclick: function(event)
	{
		if (! this.itsTurn)
			return;

		var x = event.pageX - this.canvas.offsetLeft, y = event.pageY - this.canvas.offsetTop;

		var squareColumn = 1;
		if (x < this.canvas.width * 0.33)
			squareColumn = 0;
		else if (x > this.canvas.width * 0.66)
			squareColumn = 2;

		var squareRow = 1;
		if (y < this.canvas.height * 0.33)
			squareRow = 0;
		else if (y > this.canvas.height * 0.66)
			squareRow = 2;

		// Verify square is empty
		if (this.grid [squareRow * 3 + squareColumn] != CardType.Emtpy)
			return;

		this.itsTurn = false;
		gameSection.postCommand({type: 'movement', column: squareColumn, row: squareRow});
	},

	drawCard: function(column, row, cardType)
	{
		var context = this.canvas.getContext('2d');
		var x = (column * 0.33 + 0.16) * this.canvas.width;
		var y = (row * 0.33 + 0.16) * this.canvas.height;
		var lineLength = this.canvas.height * 0.1;

		if (cardType == CardType.Cat)
		{
			context.beginPath();
			context.moveTo(x - lineLength * 0.5, y - lineLength * 0.5);
			context.lineTo(x + lineLength * 0.5, y + lineLength * 0.5);
			context.stroke();

			context.beginPath();
			context.moveTo(x + lineLength * 0.5, y - lineLength * 0.5);
			context.lineTo(x - lineLength * 0.5, y + lineLength * 0.5);
			context.stroke();
		}
		else
		{
			context.beginPath();
			context.arc(x, y, lineLength, 0, 2 * Math.PI);
			context.stroke();
		}
	},

	setSquare: function(column, row, cardType)
	{
		this.grid [row * 3 + column] = cardType;
		this.drawCard(column, row, cardType);
	},

	onOpponentCommand: function(command)
	{
		if (command.type == 'opponent-win')
		{
			gameSection.close(true);
			return;
		}

		var opponentCard = (this.isPlayer1) ? CardType.Mouse : CardType.Cat;
		this.setSquare(command.column, command.row, opponentCard);
		
		// Verify if the opponent has won
		var opponentWon = true;
		for (var column = 0; column < 3; column++)
		{
			if (this.grid [command.row * 3 + column] != opponentCard)
			{
				opponentWon = false;
				break;
			}
		}

		if (opponentWon)
		{
			gameSection.postCommand({type: 'opponent-win'});
			return;
		}

		opponentWon = true;
		for (var row = 0; row < 3; row++)
		{
			if (this.grid [row * 3 + command.column] != opponentCard)
			{
				opponentWon = false;
				break;
			}
		}

		if (opponentWon)
		{
			gameSection.postCommand({type: 'opponent-win'});
			return;
		}

		opponentWon = true;
		for (var i = 0; i < 3; i++)
		{
			if (this.grid [i * 3 + i] != opponentCard)
			{
				opponentWon = false;
				break;
			}
		}

		if (opponentWon)
		{
			gameSection.postCommand({type: 'opponent-win'});
			return;
		}

		opponentWon = true;
		for (var i = 0; i < 3; i++)
		{
			if (this.grid [i * 3 + 2 - i] != opponentCard)
			{
				opponentWon = false;
				break;
			}
		}

		if (opponentWon)
		{
			gameSection.postCommand({type: 'opponent-win'});
			return;
		}
		
		this.itsTurn = true;
	},

	onCommandPosted: function(command)
	{	
		if (command.type == 'opponent-win')
			gameSection.close(false);
		else
			this.setSquare(command.column, command.row, (this.isPlayer1) ? CardType.Cat : CardType.Mouse);
	}
};

