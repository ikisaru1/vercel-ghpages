let currentType = 'posts';  // тип данных: posts / albums / etc
let currentPage = 1;         // страница
const limit = 8; 

document.addEventListener('DOMContentLoaded', () => {
      loadData();

      document.getElementById('menu').addEventListener('click', (e) => {
        const link = e.target.closest('a'); // ищем <a>
        if (link) {
        document.querySelectorAll('#menu a').forEach(a => a.classList.remove('active'));
        link.classList.add('active');
        currentType = link.dataset.type;
        currentPage = 1;
        loadData();
        }
      });
    });

function loadData() {
    showLoader();
  
    fetch(`https://jsonplaceholder.typicode.com/${currentType}?_page=${currentPage}&_limit=${limit}`)
      .then(res => {
        const total = res.headers.get('x-total-count');
        return res.json().then(data => ({ data, total }));
      })
      .then(({ data, total }) => {
        renderData(currentType, data);
        renderPagination(total);
      })
      .catch(error => {
        console.error('Ошибка при загрузке данных:', error);
      });
  }
  function renderData(type, items) {
    const content = document.getElementById('content');
    content.innerHTML = '';
  
    if (type === 'posts') {
      items.forEach(post => {
        const div = document.createElement('div');
        div.classList.add('post-card');
        div.innerHTML = `
          <h3><a href="post.html?id=${post.id}">${post.title}</a></h3>
          <p>${post.body}</p>
        `;
        content.appendChild(div);
      });
    } else if (type === 'albums') {
      items.forEach(album => {
        const div = document.createElement('div');
        div.innerHTML = `<strong>Album:</strong> ${album.title}`
        content.appendChild(div);
      });
    } else if (type === 'photos') {
      items.forEach(photo => {
        const div = document.createElement('div');
        div.innerHTML = `<img src ='${photo.thumbnailUrl}' alt="${photo.title}"/> <p>${photo.title}</p>`;
        content.appendChild(div); 
      });
    } else if (type === 'todos') {
      items.forEach(todo => {
        const div = document.createElement('div');
        div.innerHTML = `<input type="checkbox" ${todo.completed ? 'checked' : ''} disabled> ${todo.title}`;
        content.appendChild(div);
      });
    } else if (type === 'users') {
      items.forEach(user => {
        const div = document.createElement('div');
        div.innerHTML = `<strong>${user.name}</strong> (${user.email})<br>${user.address.city}`;
        content.appendChild(div);
      });
    }
  }
  

  function showLoader() {
    const content = document.getElementById('content');
    content.innerHTML = '<p>loading...</p>';
  }
  
  function renderPagination(totalCount) {
    const totalPages = Math.ceil(totalCount / limit);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
  
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.textContent = i;
      btn.disabled = i === currentPage;
      btn.addEventListener('click', () => {
        currentPage = i;
        loadData();
      });
      pagination.appendChild(btn);
    }
  }
  
  