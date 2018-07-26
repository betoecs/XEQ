var uploadGameSection =
{
    clean: function()
    {
        document.getElementById('game-name').value = "";
        document.getElementById('game-js-file').value = "";
    },

    setImage: function(uploadInput)
    {
        setImage(document.getElementById('game-image'), uploadInput, false);
    },

    setJSFile: function(uploadInput)
    {
        document.getElementById('game-js-file').placeholder = uploadInput.files [0].name;
    },

    validateInformation: function()
    {
        var image = document.getElementById('game-image-upload-input');
        var jsFile = document.getElementById('game-js-file-upload-input');

        if (image.value == "" || jsFile.value == "")
            return false;

        return true;
    },

    uploadGame: function()
    {
        var formData = new FormData();

        formData.append("name", document.getElementById('game-name').value);
        formData.append("image", document.getElementById("game-image-upload-input").files [0]);
        formData.append("js-file", document.getElementById("game-js-file-upload-input").files [0]);

        var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function()
		{
			if (this.readyState != 4 || this.status != 200)
				return;

            var response = JSON.parse(this.responseText);
            if (response.status == "ok")
				xeq.setCurrentSection(Sections.Games);
            else
                uploadGameSection.clean();
		}
		xmlhttp.open("POST", "php/upload-game.php");
		xmlhttp.send(formData);
    }
};
