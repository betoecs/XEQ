function setImage(imageElement, uploadInput, src = true)
{
    var file = uploadInput.files [0];

    if (! file)
        return;

    var fileReader = new FileReader();
    fileReader.onload = function()
    {
        if (src)
            imageElement.src = this.result;
        else
            imageElement.style.backgroundImage = "url(" + this.result + ")";
    };
    fileReader.readAsDataURL(file);
}
