const search = document.querySelector('#search');
const options = document.querySelector('#options');
const wrapper = document.querySelector('.wrapper');

document.addEventListener('DOMContentLoaded', () => {
	input();
});

function input() {
	let timer;
	search.addEventListener('input', () => {
		clearTimeout(timer);

		if (search.value.includes(' ')) {
			search.value = '';
		} else if (search.value.trim() === '') {
			const noResult = document.querySelector('.list__item');
			if (noResult) {
				noResult.remove();
			}
		} else {
			timer = setTimeout(() => fetchRepos(search.value.trimStart()), 300);
		}

	});
}

async function fetchRepos(nameRepo) {
	try {
		options.innerHTML = '';
		const existingNoResult = document.querySelector('.list__item');
		const response = await fetch(`https://api.github.com/search/repositories?q=${nameRepo.trim()}&per_page=5`);
		const data = await response.json();

		if (existingNoResult) {
			existingNoResult.remove();
		}

		if (data.items && data.items.length) {
			showOptions(data.items);
		} else {
			const existingNoResult = document.querySelector('.list__item');
			const li = `<li class="list__item">No result</li>`;

			wrapper.insertAdjacentHTML('beforeend', li);

			if (existingNoResult) {
				existingNoResult.remove();
			}
		}

	} catch (e) {
		console.error(e);
	}
}


function showOptions(repos) {
	options.innerHTML = '';

	repos.forEach(({name, owner, stargazers_count}) => {
		const li = `<li data-repo='${name}' class='list__item'>${name}</li>`;
		options.insertAdjacentHTML('beforeend', li);

		const listItem = options.querySelector(`[data-repo='${name}']`);
		listItem.addEventListener('click', () => {
			addRepo(name, owner.login, stargazers_count);
			search.value = '';
			options.innerHTML = '';
		});
	});
}


function addRepo(name, url, starsCount) {
	const div = `<div class="item__repo">
							<div class="container">
								<div class="repo__name">Name: ${name} </div>
								<div class="repo__owner">Owner: <a href="${url}">${url}</a> </div>
								<div class="repo__stars">Stars: ${starsCount} </div>
							</div>
							<button onclick="removeRepo(this)" class="btn">X</button>
						</div>`;
	wrapper.insertAdjacentHTML('beforeend', div);
}


function removeRepo(btn) {
	btn.parentNode.remove();
	search.value = '';
}

