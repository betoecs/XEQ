function closeDialog(dialog_id)
{
	var dialog = document.getElementById(dialog_id + "-dialog");
	dialog.className += " hide-dialog";

	setTimeout(function()
	{
		dialog.className = dialog.className.replace("hide-dialog", "");
		document.getElementById(dialog_id + "-dialog-background").style.display = "none";
	}, 600);
}
