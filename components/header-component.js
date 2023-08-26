import { goToPage, logout, user } from "../index.js";
import { ADD_POSTS_PAGE, AUTH_PAGE, POSTS_PAGE } from "../routes.js";

export function renderHeaderComponent({ element }) {//функция отвечает за рендер header а на странице в аргумент принимает объект по селектору
  element.innerHTML = `
  <div class="page-header">
      <h1 class="logo">instapro</h1>
      <button class="header-button add-or-login-button">
      ${//тут используется рернарный оператор для определения вида и назначения кнопки, если к этому времени переменная - user будет пуста, то рендер кнопки - Войти, если в переменной есть информация из localStorage, то в кнопке появляется div с кружочком и титлом - добавить пост
        user
          ? `<div title="Добавить пост" class="add-post-sign"></div>`
          : "Войти"
      }
      </button>
      ${//тут, если в user есть информация, то рендерится кнопка выйти, если нет, то не рендерится ничего
        user
          ? `<button title="${user.name}" class="header-button logout-button">Выйти</button>`
          : ""
      }  
  </div>
  
`;//После этого элемент меняется на один из вариантов

  element
    .querySelector(".add-or-login-button")//Если в итоге у нас отрендерился элемент add-or-login-button, то ищем его и навешиваем на него события:
    .addEventListener("click", () => {
      if (user) {
        goToPage(ADD_POSTS_PAGE);//если пользователь авторизован, то эта кнопка выглядит как "Добавить пост" то js, с помощью вфзова функции с аргументом ADD_POSTS_PAGE отрисовывает в add элемент страницу добавления поста
      } else {
        goToPage(AUTH_PAGE);
      }
    });

  element.querySelector(".logo").addEventListener("click", () => {
    goToPage(POSTS_PAGE);
  });

  element.querySelector(".logout-button")?.addEventListener("click", logout);

  return element;
}
