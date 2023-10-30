const API_BASE = 'https://api.github.com';

function check() {
    if(window.event.keyCode == 13) fetchGitHubUser();
}

function fetchGitHubUser() {
    const username = document.getElementById('github-username').value;
    fetch(`${API_BASE}/users/${username}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayProfile(data);
            fetchRepos(username);
        })
        .catch(error => {
            console.error('There was a problem fetching the user data:', error);
        });
    const viewButton = document.querySelector('.viewProfile');
    viewButton.addEventListener('click', goToViewProfile);
}

function goToViewProfile() {
    const username = document.getElementById('github-username').value;
    window.location.href = `https://github.com/${username}`
}

function displayProfile(data) {
    document.getElementById('profile-image').src = data.avatar_url;
    document.getElementById('publicRepos').textContent = `Public Repos: ${data.public_repos}`;
    document.getElementById('publicGists').textContent = `Public Gists: ${data.public_gists}`;
    document.getElementById('followers').textContent = `Followers: ${data.followers}`;
    document.getElementById('following').textContent = `Following: ${data.following}`;
    document.getElementById('company').textContent = `Company: ${data.company || 'null'}`;
    document.getElementById('website').textContent = `Website/Blog: ${data.blog}`;
    document.getElementById('location').textContent = `Location: ${data.location}`;
    document.getElementById('member-since').textContent = `Member Since: ${data.created_at}`;
}

function fetchRepos(username) {
    fetch(`https://api.github.com/users/${username}/repos`)
        .then(response => response.json())
        .then(data => {
            displayRepos(data);

            document.querySelector('.latestRepos').style.display = 'block';
            document.querySelector('.infoSubWrapper').style.display = 'block';
        })
        .catch(error => {
            console.error('Error fetching repos:', error);
        });
}
function displayRepos(repos) {
    const reposList = document.getElementById('repos');

    reposList.innerHTML = '';

    repos.slice(0, 5).forEach(repo => {
        const repoItem = document.createElement('div');
        repoItem.classList.add('repo-item');
        repoItem.innerHTML = `
            <div class="latestReposWrapper">
            <a href="${repo.html_url}" target="_blank" class="repo-name">${repo.name}</a>
            <div class="repoSubWrapper">
                    <span class="stars">Stars: ${repo.stargazers_count}</span>
                    <span class="watchers">Watchers: ${repo.watchers_count}</span>
                    <span class="forks">Forks: ${repo.forks}</span>
                </div>
            </div>
      `;
        reposList.appendChild(repoItem);
    });
}