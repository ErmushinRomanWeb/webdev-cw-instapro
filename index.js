import { getPosts, postLike, postPosts } from "./api.js";
import { renderAddPostPageComponent } from "./components/add-post-page-component.js";
import { renderAuthPageComponent } from "./components/auth-page-component.js";
import { renderPostsUserPageComponent } from "./components/post-user-page-component.js";
import {
  ADD_POSTS_PAGE,
  AUTH_PAGE,
  LOADING_PAGE,
  POSTS_PAGE,
  USER_POSTS_PAGE,
} from "./routes.js";
import { renderPostsPageComponent } from "./components/posts-page-component.js";
import { renderLoadingPageComponent } from "./components/loading-page-component.js";
import {
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
  saveUserToLocalStorage,
} from "./helpers.js";
import { renderUploadImageComponent } from "./components/upload-image-component.js";

export let user = getUserFromLocalStorage(); //данная переменная принимает значение возвращенное функцией getUserFromLocalStorage(helpers.js), которая возвращает значение из localStorage
export let page = null; //Эта переменная будет принимать значение одной из переменных навигации и в зависимости от того, на какой странице находится пользователь, она будет менятся, при рендере страниц в нее будет добавляться значение страници и, в зависимости от того, какое значение внутри переменной будут происходить определенные действия
export let posts = []; //данная переменная будет вмещать в себя массив с постами, которые будут загружаться из API

const getToken = () => {
  //данная функция вытаскивает из объекта user токен,  если объект содержит в себе информацию
  const token = user ? `Bearer ${user.token}` : undefined;
  return token; //возврощаеттся значение токена
};


export const logout = () => {
  //данная функция отвечает за выход из учетной записи в ней запускается функция removeUserFromLocalStorage(helpersk.js), запускается в renderHeaderComponent, при клике на кнопку
  user = null;
  removeUserFromLocalStorage();
  goToPage(POSTS_PAGE);
};

/**
 * Включает страницу приложения
 */
export const goToPage = (newPage, data) => {
  //ТОЧКА ВХОДА В ПРИЛОЖЕНИЕДанная функция осуществляет навигацию по сайту, она принимает в себя аргуметнт, которым при вызове мы делаем одну из переменных навигации(routes.js) и при вызове функции, с указанием аргумента, js отрисовывает страницу, которой совпадает аргумент.
  if (
    [
      POSTS_PAGE,
      AUTH_PAGE,
      ADD_POSTS_PAGE,
      USER_POSTS_PAGE,
      LOADING_PAGE,
    ].includes(newPage) // тут newPage имеет значение переменной той страници, на которой находится и посредствам метода includes мы определяем правда ли то, что аргумент, который попал в функцию при вызове является одним из переменных навигации, если правда, то:
  ) {
    if (newPage === ADD_POSTS_PAGE) {
      page = user ? ADD_POSTS_PAGE : AUTH_PAGE; //если user имеет данные, то переменной page присваивается значение ADD_POSTS_PAGE
      return renderApp();
    }

    if (newPage === POSTS_PAGE) {
      //тут должен быть рендер постов из апи
      page = LOADING_PAGE; //Загрузка, пок не получим данные с сервера
      renderApp();

      return getPosts({ token: getToken() })
        .then((newPosts) => {
          page = POSTS_PAGE;
          posts = newPosts;
          renderApp();
        })
        .catch((error) => {
          console.error(error);
          goToPage(POSTS_PAGE);
        });
    }

    if (newPage === USER_POSTS_PAGE) {//Если пользователь находится на странице 
      page = LOADING_PAGE;
      renderApp();
      return setTimeout(() => {
        posts = posts.filter((post) => {
          if (post.user.id === data.userId) {
            return post;
          }
          page = USER_POSTS_PAGE;
        });
        console.log(posts);
        renderApp();
      }, 700);
      // TODO: реализовать получение постов юзера из API
    }
    page = newPage;
    renderApp();
    return;
  }

  throw new Error("страницы не существует");
};

//НАЧАЛО РЕНДЕРА
export const renderApp = () => {
  //рендерит в app разметку тела сайта учитывая определенные условия
  const appEl = document.getElementById("app");
  if (page === LOADING_PAGE) {
    //
    return renderLoadingPageComponent({
      appEl,
      user,
      goToPage,
    });
  }

  if (page === AUTH_PAGE) {
    return renderAuthPageComponent({
      appEl,
      setUser: (newUser) => {
        user = newUser;
        saveUserToLocalStorage(user);
        goToPage(POSTS_PAGE);
      },
      user,
      goToPage,
    });
  }

  if (page === ADD_POSTS_PAGE) {
    return renderAddPostPageComponent({
      appEl,
      onAddPostClick({ description, imageUrl }) {
        //! РАЗОБРАТЬСЯ В ВЫЗОВЕ ЭТОЙ ФУНКЦИЯ
        console.log("Добавляю пост...", { description, imageUrl });
        postPosts({
          token: getToken(),
          description,
          imageUrl,
        });

        goToPage(POSTS_PAGE);
      },
    });
  }

  if (page === POSTS_PAGE) {
    // console.log(getToken());
    return renderPostsPageComponent({
      appEl,
      posts,
      token: getToken(),
    });
  }

  if (page === USER_POSTS_PAGE) {
    // TODO: реализовать страницу фотографию пользвателя
    // setTimeout(() => {
    // goToPage(POSTS_PAGE)}, 3000)
    // appEl.innerHTML = "Здесь будет страница фотографий пользователя";
    // return;
    return renderPostsUserPageComponent({
      appEl,
      posts,
      token: getToken(),
    });
  }
}; //КОНЕЦ РЕНДЕРА

goToPage(POSTS_PAGE); //ВХОДНАЯ ТОЧКА, постоянно принимает аргументом одну из навигационных переменных
