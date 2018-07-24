const Sections =
{
	Games:   'games',
	MyGames: 'my-games',
	Friends: 'friends',
	Profile: 'profile'
};

var xeq =
{
	currentSection: Sections.Profile,

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
		document.getElementById(this.currentSection + '-nav').classList.remove('selected-nav-div');

		this.currentSection = section;

		document.getElementById(this.currentSection + '-section').style.display = 'block';
		document.getElementById(this.currentSection + '-nav').classList.add('selected-nav-div');

		switch (this.currentSection)
		{
			case Sections.Friends:	friendsSection.update(); break;
			case Sections.Games:	gamesSection.getGames(); break;
			case Sections.MyGames:	gamesSection.getMyGames(); break;
		}
	},

	//////////////////////////////////////
	// Closes session and redirect to homepage.html
	//////////////////////////////////////
	log_out: function()
	{
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function()
		{
			if (this.readyState != 4 || this.status != 200)
				return;

			sessionStorage.removeItem('nick');
			document.location.href = 'homepage.html';
		};
		xhr.open("GET", "php/log-out.php");
		xhr.send();
	}
};

window.onload = function() { xeq.init(); };
