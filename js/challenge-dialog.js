var challengeDialog =
{
    ////////////////////////////////////////
	// Shows the dialog. The first time
	////////////////////////////////////////
    show: function(gameName, friendName)
	{
        document.getElementById('challenge-dialog-background').style.display = "block";
        document.getElementById('challenge-dialog-text').innerHTML = friendName + ' challenges you to play ' + gameName + ' with him/her.'
    },

    onResponse: function(answer)
    {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function()
        {
            if (this.readyState != 4 || this.status != 200)
                return;

            var response = JSON.parse(this.responseText);
            if (response.status == 'success' && answer == 1)
            {
                xeq.setCurrentSection(Sections.Game);
                gameSection.init(response.game_id, false);
            }

            closeDialog('challenge');
        };
        xhr.open('GET', 'php/challenge.php?answer=' + answer);
        xhr.send();
    }
};
