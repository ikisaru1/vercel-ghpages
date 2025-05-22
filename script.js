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
  pagination.className = 'pagination';

  function createButton(text, page, isActive = false) {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.className = 'page';
    if (isActive) btn.classList.add('active');
    btn.addEventListener('click', () => {
      currentPage = page;
      loadData();
    });
    return btn;
  }

  // Prev button
  if (currentPage > 1) {
    const prev = document.createElement('button');
    prev.className = 'prev';
    prev.innerHTML = '‹';
    prev.addEventListener('click', () => {
      currentPage--;
      loadData();
    });
    pagination.appendChild(prev);
  }

  // Main logic
  let maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage < maxPagesToShow - 1) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  if (startPage > 1) {
    pagination.appendChild(createButton(1, 1, currentPage === 1));
    if (startPage > 2) {
      const dots = document.createElement('span');
      dots.className = 'dots';
      dots.textContent = '...';
      pagination.appendChild(dots);
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pagination.appendChild(createButton(i, i, currentPage === i));
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      const dots = document.createElement('span');
      dots.className = 'dots';
      dots.textContent = '...';
      pagination.appendChild(dots);
    }
    pagination.appendChild(createButton(totalPages, totalPages, currentPage === totalPages));
  }

  // Next button
  if (currentPage < totalPages) {
    const next = document.createElement('button');
    next.className = 'next';
    next.innerHTML = '›';
    next.addEventListener('click', () => {
      currentPage++;
      loadData();
    });
    pagination.appendChild(next);
  }
}
