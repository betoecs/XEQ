function showToast(message)
{
	var toast = document.getElementById('toast');
	toast.innerHTML = message;
	toast.style.display = 'inline-block';
	toast.classList.add('get-in');
	setTimeout(function()
	{
		toast.classList.remove('get-in');
		toast.style.display = 'none';
	}, 2900);
}
