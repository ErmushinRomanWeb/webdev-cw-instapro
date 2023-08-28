import { dislike, postLike } from "../api.js";
import { renderApp } from "../index.js";
import { renderPostsPageComponent } from "./posts-page-component.js";

export function likeMaker(posts, token, appEl) {
  // const commentBlockElement = document.getElementById("comment-block")
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
          console.log(responseData.post.likes)
          posts[index].likes = responseData.post.likes;
          renderPostsPageComponent({
      appEl,
      posts,
      token,
    })
        });
      } else {
        postLike({ token, id }).then((responseData) => {
          console.log(responseData.post.likes)
          posts[index].likes = responseData.post.likes;
          renderPostsPageComponent({
      appEl,
      posts,
      token,
    })
        });
      }
    });
  });
}
