var friendsSection =
{
	//////////////////////////////////////
	// Update friend requests and friends list
	//////////////////////////////////////
	update: function()
	{
		this.getFriendRequests();
		this.getFriends();
	},

	//////////////////////////////////////
	// Requests to the server for friend requests
	// and creates the graphic elements for
	// each one.
	//////////////////////////////////////
	getFriendRequests: function()
	{
		var friendRequestsArea = document.getElementById('friend-requests-area');
		while (friendRequestsArea.hasChildNodes())
			friendRequestsArea.removeChild(friendRequestsArea.firstChild);

		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function()
		{
			if (this.readyState != 4 || this.status != 200)
				return;

			let response = JSON.parse(this.responseText);
			if (response.status != 'ok')
			{
				showToast('Something went wrong');
				return;
			}

			for (let i = 0; i < response.requests.length; i++)
			{
				let request = response.requests [i];
				let requestElement = document.createElement('div');
				requestElement.setAttribute('data-id', request.id);
				requestElement.className = 'scol12';

				let playerNickElement = document.createElement('span');
				playerNickElement.innerHTML = request.nick + " wants to be your friend";
				playerNickElement.className = 'scol10';
				requestElement.appendChild(playerNickElement);

				let acceptRequestButton = document.createElement('span');
				acceptRequestButton.className = 'scol1 icon-check icon-button';
				acceptRequestButton.setAttribute('onclick', 'friendsSection.solveFriendRequest(\'' + JSON.stringify(request) + '\', true)');
				requestElement.appendChild(acceptRequestButton);

				let rejectRequestButton = document.createElement('span');
				rejectRequestButton.className = 'scol1 icon-trash icon-button';
				rejectRequestButton.setAttribute('onclick', 'friendsSection.solveFriendRequest(\'' + JSON.stringify(request) + '\', false)');
				requestElement.appendChild(rejectRequestButton);

				friendRequestsArea.appendChild(requestElement);
			}
		};
		xhr.open('GET', 'php/get-friend-requests.php');
		xhr.send();
	},

	//////////////////////////////////////
	// Accepts or rejects a friend request
	// according to the 'accepted' parameter.
	// If the request is accepted a new element
	// is added to the friends area.
	// Removes the graphic element of the request.
	//////////////////////////////////////
	solveFriendRequest: function(player, accepted)
	{
		player = JSON.parse(player);
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function()
		{
			if (this.readyState != 4 || this.status != 200)
				return;

			var friendRequestsArea = document.getElementById('friend-requests-area');
			for (let i = 0; i < friendRequestsArea.childNodes.length; i++)
			{
				let requestElement = friendRequestsArea.childNodes [i];
				if (requestElement.getAttribute('data-id') == player.id)
				{
					friendRequestsArea.removeChild(requestElement);
					break;
				}
			}

			if (accepted)
			{
				friendsSection.createFriendElement(document.getElementById('friends-area'), player);
				document.getElementById('no-friends-message').style.display = 'none';
				showToast('Friend accepted');
			}
			else
			{
				showToast('Request rejected');
			}
		};
		xhr.open("GET", "php/solve-friend-request.php?id=" + player.id + "&accepted=" + accepted);
		xhr.send();
	},

	//////////////////////////////////////
	// Retrieves the list of friends and creates
	// the graphic element for each one.
	// If there are no friends, shows the
	// no-friends-message.
	//////////////////////////////////////
	getFriends: function()
	{
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function()
		{
			if (this.readyState != 4 || this.status != 200)
				return;

			var response = JSON.parse(this.responseText);
			var friendsArea = document.getElementById('friends-area');
			while (friendsArea.hasChildNodes())
				friendsArea.removeChild(friendsArea.firstChild);

			if (response.status != 'ok')
			{
				showToast('Something went wrong');
				return;
			}

			friendsSection.friends = response.friends;
			if (! response.friends.length)
			{
				document.getElementById('no-friends-message').style.display = 'block';
				return;
			}

			document.getElementById('no-friends-message').style.display = 'none';
			for (let i = 0; i < response.friends.length; i++)
				friendsSection.createFriendElement(friendsArea, response.friends [i]);
		};
		xhr.open("GET", "php/get-friends.php");
		xhr.send();
	},

	//////////////////////////////////////
	// Creates the graphic element of a friend
	// according to the information of the parameter
	// 'friend' and adds it as a child of the
	// parameter 'parentElement'.
	//////////////////////////////////////
	createFriendElement: function(parentElement, friend)
	{
		var friendElement = document.createElement('div');
		friendElement.className = 'scol12 player';

		var friendImage = document.createElement('img');
		friendImage.className = 'scol1';
		friendImage.src = 'assets/images/' + friend.image;
		friendElement.appendChild(friendImage);

		var friendNickElement = document.createElement('span');
		friendNickElement.innerHTML = friend.nick;
		friendNickElement.className = 'scol10';
		friendElement.appendChild(friendNickElement);

		var onlineElement = document.createElement('span');
		onlineElement.className = 'scol1 icon-rss ' + ((friend.online) ? 'online' : 'offline');
		friendElement.appendChild(onlineElement);

		parentElement.appendChild(friendElement);
	},

	//////////////////////////////////////
	// Retrieves the basic information of the
	// players whose nick is like the parameter 'nick'.
	// It also creates the graphic element for each one.
	//////////////////////////////////////
	searchPlayer: function(nick)
	{
		var foundPlayersArea = document.getElementById('found-players-area');
		while (foundPlayersArea.hasChildNodes())
			foundPlayersArea.removeChild(foundPlayersArea.firstChild);

		if (! nick.length)
			return;

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

			for (let i = 0; i < response.players.length; i++)
			{
				let player = response.players [i];
				let playerElement = document.createElement('div');
				playerElement.className = 'scol12 player';

				let playerNickElement = document.createElement('span');
				playerNickElement.innerHTML = player.nick;
				playerNickElement.className = 'scol10';

				let inviteButton = document.createElement('button');
				inviteButton.innerHTML = 'Invite';
				inviteButton.className = 'scol2 text-button';
				inviteButton.setAttribute('onclick', 'friendsSection.sendFriendRequest(' + player.id + ')');

				playerElement.appendChild(playerNickElement);
				playerElement.appendChild(inviteButton);
				foundPlayersArea.appendChild(playerElement);
			}
		};
		xhr.open('GET', 'php/get-players.php?nick=' + nick);
		xhr.send();
	},

	//////////////////////////////////////
	// Sends the friend request to the player
	// with id equal to the 'playerId' parameter.
	//////////////////////////////////////
	sendFriendRequest: function(playerId)
	{
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function()
		{
			if (this.readyState != 4 || this.status != 200)
				return;

			var response = JSON.parse(this.responseText);
			if (response.status == 'ok')
				showToast('Request sent');
			else
				showToast(response.status);
		};
		xhr.open('GET', 'php/send-friend-request.php?to=' + playerId);
		xhr.send();
	}
};
