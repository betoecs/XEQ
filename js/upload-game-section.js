var uploadGameSection =
{
    show: function()
	{
		document.getElementById('upload-game-section').style.display = 'block';
		document.getElementById('games-section').style.display = 'none';
	},

    setImage: function(uploadInput)
    {
        setImage(document.getElementById('game-image'), uploadInput, false);
    },

    setJSFile: function(uploadInput)
    {
        document.getElementById('game-js-file-upload').placeholder = uploadInput.value;
    }
}
