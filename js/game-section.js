var gameSection =
{
	Lose: 'You lose',
	Draw: 'Draw',
	Won:  'You won!!!',
	isPlayer1: null,

    init: function(gameId, isPlayer1)
    {
		this.isPlayer1 = isPlayer1;
        var gameSectionElement = document.getElementById('game-section');

        var gameTitleElement = document.createElement('h2');
        gameTitleElement.innerHTML = 'GAME!!';
        gameSectionElement.appendChild(gameTitleElement);

        var canvas = document.createElement('canvas');
        canvas.width = window.innerWidth - 30;
        canvas.height = canvas.width / 16 * 9;
        gameSectionElement.appendChild(canvas);

        var scriptElement = document.createElement('script');
        scriptElement.id = 'game-script';
        scriptElement.type = 'text/javascript';
        scriptElement.src = 'assets/js/' + gameId + '.js';
        document.head.appendChild(scriptElement);
        scriptElement.onload = function() { game.init(canvas, isPlayer1); };

        setInterval(function() { gameSection.retrieveOpponentCommand(); }, 1000);
    },

    close: function(result)
    {
        var gameSectionElement = document.getElementById('game-section');
        while (gameSectionElement.hasChildNodes())
            gameSectionElement.removeChild(gameSectionElement.firstChild);

        document.head.removeChild(document.getElementById('game-script'));

		this.isPlayer1 = null;
		gameSection.friendId = null;
		xeq.setCurrentSection(Sections.Games);
        showToast(result);
    },

    retrieveOpponentCommand: function()
    {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function()
        {
            if (this.readyState != 4 || this.status != 200)
                return;

            var response = JSON.parse(this.responseText);

            if (response.status == 'ok')
                game.onOpponentCommand(JSON.parse(response.command));
        }
        xhr.open('GET', 'php/retrieve-opponent-command.php');
        xhr.send();
    },

    postCommand: function(command)
    {
        var commandData = new FormData();
        commandData.append('command', JSON.stringify(command));

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function()
        {
            if (this.readyState != 4 || this.status != 200)
                return;

            var response = JSON.parse(this.responseText);

            if (response.status == 'ok')
                game.onCommandPosted(command);
        }
        xhr.open('POST', 'php/post-command.php');
        xhr.send(commandData);
    },

	leaveMatch: function(asynchronous = true, callback = null)
	{
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function()
		{
			if (this.readyState != 4 || this.status != 200)
				return;

			if (callback)
				callback();
		}
		xhr.open('GET', 'php/leave-match.php', asynchronous);
		xhr.send();
	}
};
