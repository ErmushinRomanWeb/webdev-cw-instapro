import { ru } from "date-fns/locale";
import { formatDistanceToNow } from "date-fns";
import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { goToPage } from "../index.js";
import { dislike, postLike } from "../api.js";

export function renderPostsUserPageComponent({ appEl, posts, token }) {
  const userPost = posts[0];
  const { user } = userPost;
  console.log(userPost);

  const appPostsHtml = `
  <div class="page-container">
    <div class="header-container"></div>
    <div class="posts-user-header">
    <img src="${user.imageUrl}" class="posts-user-header__user-image">
    <p class="posts-user-header__user-name">${user.name}</p>
</div>
    <ul id="ulContainerForPost" class="posts">
    </ul>
  </div>
`;

  appEl.innerHTML = appPostsHtml;
  const ulContainer = document.getElementById("ulContainerForPost");
  // TODO: реализовать рендер постов из api
  console.log(appEl.innerHTML);
  console.log("Актуальный список постов:", posts);
  const postsElementHtml = posts
    .map((post) => {
      const createDate = formatDistanceToNow(new Date(post.createdAt), {
        locale: ru,
      });
      const likesLength = post.likes.length;
      console.log(post.user.name);
      //asb4c4boc86gasb4c4boc86g37w3cc3bo3b83k4g37k3bk3cg3c03ck4k
      //Как метод map изменяет элементы массива, пока на выходе мы получаем пустой массив? так как на сервере нет информации, а мы будем втавлять информацию с сервера в разметку HTML, поэтому я вставил заглушку в виде базовой разметки в app, для того, чтобы ф-я нашла элементы из разметки.
      return `<li class="post">
  
  <div class="post-image-container">
    <img class="post-image" src="${post.imageUrl}">
  </div>
  <div class="post-likes">
    <button data-post-id="${post.id}" class="like-button">
      <img src="${
        post.isLiked
          ? "./assets/images/like-active.svg"
          : "./assets/images/like-not-active.svg"
      }">
    </button>
    <p class="post-likes-text">
      Нравится: <strong>${
        likesLength === 0
          ? 0
          : `${post.likes.at(-1).name}${
              likesLength > 1 ? `и еще ${likesLength - 1}` : ""
            }`
      }</strong>
    </p>
  </div>
  <p class="post-text">
    <span class="user-name">${post.user.name}</span>
    ${post.description}
  </p>
  <p class="post-date">
    ${createDate}
  </p>
</li>`;
    })
    .join("");
  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */
  ulContainer.innerHTML = postsElementHtml;

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
  const likeButtonElements = document.querySelectorAll(".like-button");

  likeButtonElements.forEach((likeButtonElement, index) => {
    likeButtonElement.addEventListener("click", (event) => {
      const post = posts[index];
      console.log(post);
      let { id } = post;
      console.log(id);
      let { isLiked } = post;
      console.log(isLiked);
      if (isLiked) {
        dislike({ token, id }).then((responseData) => {
          console.log(responseData.post.likes);
          posts[index].likes = responseData.post.likes;
          posts[index].isLiked = responseData.post.isLiked;
          renderPostsUserPageComponent({ appEl, posts, token });
        });
      } else {
        postLike({ token, id }).then((responseData) => {
          console.log(responseData.post.likes);
          posts[index].likes = responseData.post.likes;
          posts[index].isLiked = responseData.post.isLiked;
          renderPostsUserPageComponent({ appEl, posts, token });
        });
      }
    });
  });
}
