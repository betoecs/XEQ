var xeq =
{
	init: function()
	{
		document.getElementById('player-nick').innerHTML = sessionStorage.getItem('nick');
	},

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
