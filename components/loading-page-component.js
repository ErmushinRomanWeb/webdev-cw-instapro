import { renderHeaderComponent } from "./header-component.js";

export function renderLoadingPageComponent({ appEl, user, goToPage }) {//функция рендерит разметку, которая отвечает за процесс зкагрузки страницы, реализована посредствам 3 дивов, которые поочередно меняют свой размер.
  const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                <div class="loading-page">
                  <div class="loader"><div></div><div></div><div></div></div>
                </div>
              </div>`;

  appEl.innerHTML = appHtml;//как только данные с сервера получены, вызывается функция renderHeaderComponent, которая рендерит header страницы

  renderHeaderComponent({
    user,
    element: document.querySelector(".header-container"),
    goToPage,
  });
}
