import { renderHeaderComponent } from "./header-component.js";
import { replaceAllFunction } from "./replaceAll-function.js";
import { renderUploadImageComponent } from "./upload-image-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let imageUrl = "";
  const render = () => {
    // TODO: Реализовать страницу добавления поста
    const appHtml = `
    <div class="page-container">
    <div class="header-container">
<div class="page-header">
    <h1 class="logo">instapro</h1>
    <button class="header-button add-or-login-button">
    <div title="Добавить пост" class="add-post-sign"></div>
    </button>
    <button title="Админ" class="header-button logout-button">Выйти</button>  
    
</div>

</div>
    <div class="form">
      <h3 class="form-title">Добавить пост</h3>
      <div class="form-inputs">
        <div class="upload-image-container">
<div class="upload-image">

</div>
</div>
        <label>
          Опишите фотографию:
          <textarea class="input textarea" id="inputId" rows="4"></textarea>
          </label>
          <button class="button" id="add-button">Добавить</button>
      </div>
    </div>
  </div>
  `;

    appEl.innerHTML = appHtml;

    document.getElementById("add-button").addEventListener("click", () => {
      const postDiscrition = document.getElementById("inputId");
      const censoredDescription = replaceAllFunction(postDiscrition.value)
      onAddPostClick({
        description: censoredDescription,
        imageUrl: imageUrl,
      });
    });
  };

  render();

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  const uploadImageContainer = appEl.querySelector(".upload-image"); //если переменная isLoginMade - это лож, то js отрендерил элементы страници регистрации в нашем контейнере и появился элемент - upload-image-container для загрузки изображения пользователя, ищем его для того, чтобы использовать
  if (uploadImageContainer) {
    //если нашли, то вызываем ф-ю
    renderUploadImageComponent({
      //запустилась функция, которая отрисовывает картинку
      element: appEl.querySelector(".upload-image"), //!Это можно использовать в add-page
      onImageUrlChange(newImageUrl) {
        //функция объявляется в upload-image-component
        imageUrl = newImageUrl;
      },
    });
  }
}
