document.addEventListener('DOMContentLoaded', () => {
  const postId = new URLSearchParams(window.location.search).get('id');
  const content = document.getElementById('post-content');
  const commentsContainer = document.getElementById('comments-container');
  const toggleBtn = document.getElementById('load-comments');
  let commentsVisible = false;

  // Загружаем пост
  fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
    .then(res => res.json())
    .then(post => {
      content.innerHTML = `
        <h2>${post.title}</h2>
        <p>${post.body}</p>
      `;
    });

  // Обработка кнопки
  toggleBtn.addEventListener('click', () => {
    if (commentsVisible) {
      commentsContainer.innerHTML = '';
      toggleBtn.textContent = 'Показать комментарии';
      commentsVisible = false;
    } else {
      commentsContainer.innerHTML = '<p>Загрузка комментариев...</p>';
      fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
        .then(res => res.json())
        .then(comments => {
          commentsContainer.innerHTML = '';
          comments.forEach(comment => {
            const div = document.createElement('div');
            div.classList.add('comment');
            div.innerHTML = `
              <strong>${comment.name} (${comment.email})</strong>
              <p>${comment.body}</p>
            `;
            commentsContainer.appendChild(div);
          });
          toggleBtn.textContent = 'Hide comments';
          commentsVisible = true;
        });
    }
  });
});
