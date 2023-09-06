//данный модуль содержит в себе функции, которые помогают сохранять, брать и изменять данные в localStorage

export function saveUserToLocalStorage(user) {//данная функция сохраняет данные пользователя в localStorage в формате - ключ, значение
  window.localStorage.setItem("user", JSON.stringify(user));//тут используется метод добавления данных в объект localStorage, аргументом функция будет принимать объект с данными пользователя, превращенный в стрку посредствам метода JSON.stringify
}

export function getUserFromLocalStorage(user) {// данная функция отвечает за возврат данных из localStorage преобразовывая строку в первоначальный вид с помощью метода JSON.parse
  try {
    return JSON.parse(window.localStorage.getItem("user"));//получаем данные из localStorage
  } catch (error) {
    return null;
  }
}

export function removeUserFromLocalStorage(user) {//данная функция удаляет из localStorage ключ и добавляет другой, используется для изменения и обновления информации.
  window.localStorage.removeItem("user");
}
