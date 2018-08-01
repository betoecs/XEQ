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
		showToast("Passwords don't match");
		return false;
	},

	//////////////////////////////////////
	// Compare the text entered in the "Nick" field when losing the focus (blur) with a user registered in the bd
	//////////////////////////////////////
	verifyNick: function()
	{
		var nick = document.getElementById('nick');
		if (! nick.value)
			return;

		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function()
		{
			if (xhr.readyState!=4 || xhr.status!=200)
				return;

			var response = JSON.parse(xhr.responseText);
			if(response.resultado>0)
			{
				showToast("That nick is already used");
				nick.value = '';
				nick.focus();
			}
		}
		xhr.open('GET', 'php/verify-nick.php?nick='+nick.value);
		xhr.send();
	},

	//////////////////////////////////////
	// Verify that you have an e-mail structure in that field.
	// if it is valid, it accepts it, if it does not erase it,
	// in the same way when it is out of focus.
	//////////////////////////////////////
	verifyEmail: function()
	{
		var email = document.getElementById('email');
		if (! email.value)
			return;

		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange=function()
		{
		  if (xhr.readyState!=4 || xhr.status!=200)
				return;

	  	var response = JSON.parse(xhr.responseText);
			console.log(response);
 	   	if(response.resultado>0)
		 	{
  	 		showToast("That email is already used");
 	   		email.value = '';
				email.focus();
	  	}
		}
		xhr.open('GET', 'php/verify-email.php?email='+email.value);
		xhr.send();
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
				showToast('Something went wrong');
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
			{
				logInForm.reset();
				logInForm ['log-in-nick'].focus();
				showToast('Invalid data');
			}
		}
		xhr.open("POST", "php/log-in.php");
		xhr.send(formData);
	}
};
