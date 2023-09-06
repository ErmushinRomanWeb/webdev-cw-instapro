import { loginUser, registerUser } from "../api.js";
import { renderHeaderComponent } from "./header-component.js";
import { replaceAllFunction } from "./replaceAll-function.js";
import { renderUploadImageComponent } from "./upload-image-component.js";

export function renderAuthPageComponent({ appEl, setUser }) {//функция отвечает за страницу авторизации
  let isLoginMode = true;
  let imageUrl = "";

  const renderForm = () => {
    const appHtml = `
      <div class="page-container">
          <div class="header-container"></div>
          <div class="form">
              <h3 class="form-title">
                ${
                  isLoginMode
                    ? "Вход в&nbsp;Instapro"
                    : "Регистрация в&nbsp;Instapro"
                }
                </h3>
              <div class="form-inputs">
    
                  ${//если не loginMode то добавляем в дерево input с именем
                    //!ИНСАЙТ: ТУТ МЫ НЕ ПЕРЕРЕНДЕРИВАЕМ СТРАНИЦУ, КАК ДЕЛАЛИ ЭТО В ДЗ, А ПРОСТО ИЗМЕНЯЕМ НЕКОТОРЫЕ ЭЛЕМЕНТЫ, ПРИЧЕМ, ДЕЛАЕМ ЭТО ПОТОМУ, ЧТО ФОРМЫ СХОЖИ ПО СТРОЕНИЮ
                    !isLoginMode
                      ? `
                      <div class="upload-image-container"></div>
                      <input type="text" id="name-input" class="input" placeholder="Имя" />
                      `
                      : ""
                  }
                  
                  <input type="text" id="login-input" class="input" placeholder="Логин" />
                  <input type="password" id="password-input" class="input" placeholder="Пароль" />
                  
                  <div class="form-error"></div>
                  
                  <button class="button" id="login-button">${
                    isLoginMode ? "Войти" : "Зарегистрироваться"
                  }</button>
              </div>
            
              <div class="form-footer">
                <p class="form-footer-title">
                  ${isLoginMode ? "Нет аккаунта?" : "Уже есть аккаунт?"}
                  <button class="link-button" id="toggle-button">
                    ${isLoginMode ? "Зарегистрироваться." : "Войти."}
                  </button>
                </p> 
               
              </div>
          </div>
      </div>    
`;

    appEl.innerHTML = appHtml;//присваеваем аргументу, который является app контейнером значение appHtml и отрисовывается страница логинства, по умолчанию

    // Не вызываем перерендер, чтобы не сбрасывалась заполненная форма
    // Точечно обновляем кусочек дом дерева
    const setError = (message) => {//функция отвечает за добавление текстового контента в div form-error при неудачной авторизации
      console.log(message);
      appEl.querySelector(".form-error").textContent = message;
    };

    renderHeaderComponent({
      element: document.querySelector(".header-container"),//вызываем функцию и аргументом ставим ключ -  element и значение - элемент по селектору
    });

    const uploadImageContainer = appEl.querySelector(".upload-image-container");//если переменная isLoginMade - это лож, то js отрендерил элементы страници регистрации в нашем контейнере и появился элемент - upload-image-container для загрузки изображения пользователя, ищем его для того, чтобы использовать

    if (uploadImageContainer) {//если нашли, то вызываем ф-ю 
      renderUploadImageComponent({//запустилась функция, которая отрисовывает картинку
        element: appEl.querySelector(".upload-image-container"),//!Это можно использовать в add-page
        onImageUrlChange(newImageUrl) { //функция объявляется в upload-image-component
          imageUrl = newImageUrl;
        },
      });
    }

    document.getElementById("login-button").addEventListener("click", () => {
      setError("");

      if (isLoginMode) {
        const login = document.getElementById("login-input").value;
        const password = document.getElementById("password-input").value;

        if (!login) {
          alert("Введите логин");
          return;
        }

        if (!password) {
          alert("Введите пароль");
          return;
        }

        loginUser({
          login: login,
          password: password,
        })
          .then((user) => {
            setUser(user.user);
          })
          .catch((error) => {
            console.warn(error);
            setError(error.message);
          });
      } else {
        const login = replaceAllFunction(document.getElementById("login-input").value);
        const name = replaceAllFunction(document.getElementById("name-input").value);
        const password = replaceAllFunction(document.getElementById("password-input").value);

        if (!name) {
          alert("Введите имя");
          return;
        }
        if (!login) {
          alert("Введите логин");
          return;
        }

        if (!password) {
          alert("Введите пароль");
          return;
        }

        if (!imageUrl) {
          alert("Не выбрана фотография");
          return;
        }

        registerUser({
          login: login,
          password: password,
          name: name,
          imageUrl,
        })
          .then((user) => {
            setUser(user.user);
          })
          .catch((error) => {
            console.warn(error);
            setError(error.message);
          });
      }
    });

    document.getElementById("toggle-button").addEventListener("click", () => {
      isLoginMode = !isLoginMode;
      renderForm();
    });
  };

  renderForm();
}
