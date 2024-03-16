document.getElementById('xButton').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('profileContainer').style.display = 'none';
});

document.getElementById('profileButton').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('profileContainer').style.display = 'block';
});