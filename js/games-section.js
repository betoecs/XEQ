var gamesSection =
{
	friendId: null,

	//////////////////////////////////////
	// Retrieves all the games of the platform
	// and creates graphic controller for each one
	//////////////////////////////////////
	getGames: function()
	{
		this.friendId =  null;
		var gamesArea = document.getElementById('games-area');
		while (gamesArea.hasChildNodes())
			gamesArea.removeChild(gamesArea.firstChild);

		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function()
		{
			if (this.readyState != 4 || this.status != 200)
				return;

			var response = JSON.parse(this.responseText);
			if (response.status != 'ok')
			{
				showToast('Something went wrong');
				return;
			}

			if (! response.games.length)
			{
				showToast("Sorry, we don't have games yet");
				return;
			}

			for (let i = 0; i < response.games.length; i++)
			{
				let game = response.games [i];
				let gameElement = gamesSection.createGameElement(gamesArea, game);
				gameElement.childNodes [1].className = 'scol9';

				let addIcon = document.createElement('span');
				addIcon.className = 'icon-button icon-plus scol1';
				addIcon.setAttribute('onclick', 'gamesSection.addToMyGames(' + game.id + ')');
				gameElement.insertBefore(addIcon, gameElement.childNodes [2]);
			}
		};
		xhr.open('GET', 'php/get-games.php');
		xhr.send();
	},

	//////////////////////////////////////
	// Retrieves the games of the player
	// and create the graphic elements for each one
	//////////////////////////////////////
	getMyGames: function()
	{
		var myGamesArea = document.getElementById('my-games-area');
		while (myGamesArea.hasChildNodes())
			myGamesArea.removeChild(myGamesArea.firstChild);

		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function()
		{
			if (this.readyState != 4 || this.status != 200)
				return;

			var response = JSON.parse(this.responseText);
			if (response.status != 'ok')
			{
				showToast('Something went wrong');
				return;
			}

			if (! response.games.length)
			{
				showToast("You don't have games yet");
				return;
			}

			for (let i = 0; i < response.games.length; i++)
			{
				let game = response.games [i];
				let gameElement = gamesSection.createGameElement(myGamesArea, game);

				let starsElement = document.createElement('span');
				starsElement.className = 'scol2';

				let starIcon = document.createElement('span');
				starIcon.className = 'scol6 icon-star';
				starsElement.appendChild(starIcon);

				let starCount = document.createElement('span');
				starCount.innerHTML = game.stars;
				starsElement.appendChild(starCount);

				gameElement.childNodes [1].className = 'scol8';
				gameElement.insertBefore(starsElement, gameElement.childNodes [2]);
			}
		};
		xhr.open('GET', 'php/get-my-games.php');
		xhr.send();
	},

	//////////////////////////////////////
	// Requests to the server to add the game
	// which corresponds to gameId param as
	// my game. Shows a toast when the server
	// responds to tell to the user if the
	// action was ok.
	//////////////////////////////////////
	addToMyGames: function(gameId)
	{
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function()
		{
			if (this.readyState != 4 || this.status != 200)
				return;

			var response = JSON.parse(this.responseText);
			if (response.status == 'ok')
				showToast('Game added to your games');
			else if (response.status != 'error')
				showToast('Game has been already added');
		}
		xhr.open('POST', 'php/add-to-my-games.php');
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.send('game_id=' + gameId);
	},

	//////////////////////////////////////
	// Creates the graphic controller for
	// a game and appends as child of parent element
	//////////////////////////////////////
	createGameElement: function(parentElement, game)
	{
		var gameElement = document.createElement('div');
		gameElement.className = 'scol12 player';

		var imageElement = document.createElement('img');
		imageElement.src = "assets/images/games/" + game.image;
		imageElement.className = 'scol1';
		gameElement.appendChild(imageElement);

		var nameElement = document.createElement('span');
		nameElement.innerHTML = game.name;
		nameElement.className = 'scol10';
		gameElement.appendChild(nameElement);

		var playButton = document.createElement('span');
		playButton.className = 'icon-button icon-play scol1';
		playButton.setAttribute('onclick', 'gamesSection.play(' + game.id + ')');
		gameElement.appendChild(playButton);

		parentElement.appendChild(gameElement);
		return gameElement;
	},

	play: function(gameId)
	{
		xeq.setCurrentSection(Sections.Matchmaking);
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function()
		{
			if (this.readyState != 4 || this.status != 200)
				return;

			var response = JSON.parse(this.responseText);
			if (response.status == 'joined')
			{
				xeq.setCurrentSection(Sections.Game);
				gameSection.init(gameId, false);
			}
			else
			{
				let intervalId = setInterval(function()
				{
					var xhr = new XMLHttpRequest();
					xhr.onreadystatechange = function()
					{
						if (this.readyState != 4 || this.status != 200)
							return;

						var response = JSON.parse(this.responseText);
						if (response.status == 'joined')
						{
							clearInterval(intervalId);
							xeq.setCurrentSection(Sections.Game);
							gameSection.init(gameId, true);
						}
					};
					xhr.open('GET', 'php/have-oponent.php?game_id=' + gameId);
					xhr.send();
				}, 1000);
			}
		}
		xhr.open('GET', 'php/join-match.php?game_id=' + gameId);
		xhr.send();
	}
};
