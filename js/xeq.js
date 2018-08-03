const Sections =
{
	Games:   'games',
	MyGames: 'my-games',
	Friends: 'friends',
	Matchmaking: 'matchmaking',
	Game: 'game',
	UploadGame: 'upload-game'
};

var xeq =
{
	currentSection: Sections.Games,

	//////////////////////////////////////
	// Sets the player's nick in the header
	//////////////////////////////////////
	init: function()
	{
		document.getElementById('player-nick').innerHTML = sessionStorage.getItem('nick');
		this.setCurrentSection(Sections.Games);
	},

	//////////////////////////////////////
	// Changes the main content of the page
	// and change the tab indicator.
	//////////////////////////////////////
	setCurrentSection: function(section)
	{
		document.getElementById(this.currentSection + '-section').style.display = 'none';
		var currentSectionNav = document.getElementById(this.currentSection + '-nav');
		if (currentSectionNav)
			currentSectionNav.classList.remove('selected-nav-div');

		this.currentSection = section;

		document.getElementById(this.currentSection + '-section').style.display = 'block';
		currentSectionNav = document.getElementById(this.currentSection + '-nav');
		if (currentSectionNav)
			currentSectionNav.classList.add('selected-nav-div');

		if (this.currentSection != Sections.Game)
			gameSection.leaveMatch();

		switch (this.currentSection)
		{
			case Sections.Friends:	friendsSection.update(); break;
			case Sections.Games:	gamesSection.getGames(); break;
			case Sections.MyGames:	gamesSection.getMyGames(); break;
		}
	},

	//////////////////////////////////////
	// Closes session and redirect to homepage.html.
	// asynchronous param indicates if the
	// ajax must be asynchronous
	//////////////////////////////////////
	logOut: function(asynchronous = true)
	{
		gameSection.leaveMatch(asynchronous, function()
		{
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function()
			{
				if (this.readyState != 4 || this.status != 200)
					return;

				sessionStorage.removeItem('nick');
				document.location.href = 'homepage.html';
			};
			xhr.open("GET", "php/log-out.php", asynchronous);
			xhr.send();
		});
	}
};

window.onload = function()
{
	xeq.init();
	setInterval(function()
	{
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function()
		{
			if (this.readyState != 4 || this.status != 200)
				return;

				var response = JSON.parse(this.responseText);
				if (response.status == 'new challenge')
					challengeDialog.show(response.game_name, response.friend_name);
		};
		xhr.open("GET", "php/have-challenges.php");
		xhr.send();
	}, 5000);
};

window.onunload = function() { xeq.logOut(false); };
