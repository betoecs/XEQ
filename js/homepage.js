var homepage =
{
	//////////////////////////////////////
	// Hides log in section and shows
	// sign in section
	//////////////////////////////////////
	showSignInSection: function()
	{
		document.getElementById('log-in-section').style.display = 'none';
		document.getElementById('sign-in-section').style.display = 'block';
	},

	//////////////////////////////////////
	// Hides sign in section and shows
	// log in section
	//////////////////////////////////////
	showLogInSection: function()
	{
		document.getElementById('sign-in-section').style.display = 'none';
		document.getElementById('log-in-section').style.display = 'block';
	},

	//////////////////////////////////////
	// Validates that both password fields
	// match. Return false if they don't match.
	//////////////////////////////////////
	validateSignInForm: function()
	{
		var signInForm = document.forms ['sign-in-form'];
		var passwordField = signInForm ['password'];
		var confirmPasswordField = signInForm ['confirm-password'];
		if (passwordField.value == confirmPasswordField.value)
			return true;

		confirmPasswordField.value = passwordField.value = '';
		passwordField.focus();
		console.log("Passwords don't match");
		return false;
	},

	//////////////////////////////////////
	// Requests server to sign in a new player.
	// Sends sign in form data to sign-in.php.
	// If the sign in process went ok, redirects
	// to xeq.html.
	//////////////////////////////////////
	signIn: function()
	{
		var signInForm = document.forms ['sign-in-form'];
		var formData = new FormData();

		formData.append('nick', signInForm ['nick'].value);
		formData.append('email', signInForm ['email'].value);
		formData.append('password', signInForm ['password'].value);

		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function()
		{
			if (this.readyState != 4 || this.status != 200)
				return;

			var response = JSON.parse(this.responseText);
			if (response.status == 'ok')
			{
				document.location.href = 'xeq.html';
				sessionStorage.setItem("nick", formData.get('nick'));
			}
			else
				console.log('Something went wrong');
		};
		xhr.open("POST", "php/sign-in.php");
		xhr.send(formData);
	},

	//////////////////////////////////////
	// Tries to log in with the log in form data.
	// If credentials are valid, redirects to
	// xeq.html.
	//////////////////////////////////////
	logIn: function()
	{
		var logInForm = document.forms ['log-in-form'];
		var formData = new FormData();

		formData.append('nick', logInForm ['log-in-nick'].value);
		formData.append('password', logInForm ['log-in-password'].value);

		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function()
		{
			if (this.readyState != 4 || this.status != 200)
				return;

			var response = JSON.parse(this.responseText);
			if (response.status == 'ok')
			{
				document.location.href = 'xeq.html';
				sessionStorage.setItem("nick", formData.get('nick'));
			}
			else
				console.log('Invalid data');
		}
		xhr.open("POST", "php/log-in.php");
		xhr.send(formData);
	}
};
