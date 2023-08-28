import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage } from "../index.js";
import { likeMaker } from "./add-like.js";

export function renderPostsPageComponent({ appEl, posts, token}) {
  const appPostsHtml = `
  <div class="page-container">
    <div class="header-container"></div>
    <ul id="ulContainerForPost" class="posts">
    </ul>
  </div>`;
  appEl.innerHTML = appPostsHtml;
  const ulContainer = document.getElementById("ulContainerForPost");
  // TODO: реализовать рендер постов из api
  const postsElementHtml = posts
    .map((post) => {
      console.log(post.isLiked);
      const likesLength = post.likes.length
      console.log(likesLength);
//asb4c4boc86gasb4c4boc86g37w3cc3bo3b83k4g37k3bk3cg3c03ck4k
      //Как метод map изменяет элементы массива, пока на выходе мы получаем пустой массив? так как на сервере нет информации, а мы будем втавлять информацию с сервера в разметку HTML, поэтому я вставил заглушку в виде базовой разметки в app, для того, чтобы ф-я нашла элементы из разметки.
      return `<li class="post">
  <div class="post-header" data-user-id="${post.user.id}">
      <img class="post-header__user-image" src="${post.user.imageUrl}">
      <p class="post-header__user-name">${post.user.name}</p>
  </div>
  <div class="post-image-container">
    <img class="post-image" src="${post.imageUrl}">
  </div>
  <div class="post-likes">
    <button data-post-id="${post.id}" class="like-button">
      <img src="${post.isLiked ? './assets/images/like-active.svg':'./assets/images/like-not-active.svg'}">
    </button>
    <p class="post-likes-text">
      Нравится: <strong>${likesLength === 0? 0 : `${post.likes.at(-1).name}${likesLength > 1? `и еще ${likesLength - 1}`: ''}` }</strong>
    </p>
  </div>
  <p class="post-text">
    <span class="user-name">${post.user.name}</span>
    ${post.description}
  </p>
  <p class="post-date">
    ${post.date}
  </p>
</li>`;
    })
    .join("");
    
  /**
  
   * 
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */
  ulContainer.innerHTML = postsElementHtml
  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }
likeMaker(posts, token, appEl)
}
