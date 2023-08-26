import { uploadImage } from "../api.js";

export function renderUploadImageComponent({ element, onImageUrlChange }) {//функция отвечает за добавление фотографии пользователя при рергистрации, аргументами принимает элемент по селектору и функцию onImageUrlChange
  let imageUrl = "";//переменная - контейнер для url, используется в разметке далее

  const render = () => {//функция отвечает за разметку элементов добавления на страницу фотографии нового пользователя, и этой кнопки
    element.innerHTML = `
  <div class="upload=image">
      ${
        imageUrl//если пока нет фото, то рендер кнопки - выберите фото, Интересно: инпут с типом file скрыт
          ? `
          <div class="file-upload-image-conrainer">
            <img class="file-upload-image" src="${imageUrl}">
            <button class="file-upload-remove-button button">Заменить фото</button>
          </div>
          `
          : `
            <label class="file-upload-label secondary-button">
                <input
                  type="file"
                  class="file-upload-input"
                  style="display:none"
                />
                Выберите фото
            </label>
          
      `
      }
  </div>
`;

    const fileInputElement = element.querySelector(".file-upload-input");

    fileInputElement?.addEventListener("change", () => {
      const file = fileInputElement.files[0];//files - один из ключей,значением которого является массив с файлами, 0 - это позиция файла в массиве
      if (file) {//если файл есть в массиве(загрузили)
        const lableEl = document.querySelector(".file-upload-label");
        lableEl.setAttribute("disabled", true);
        lableEl.textContent = "Загружаю файл...";
        uploadImage({ file }).then(({ fileUrl }) => {
          imageUrl = fileUrl;
          onImageUrlChange(imageUrl);
          render();
        });
      }
    });

    element
      .querySelector(".file-upload-remove-button")
      ?.addEventListener("click", () => {
        imageUrl = "";
        onImageUrlChange(imageUrl);
        render();
      });
  };

  render();
}
