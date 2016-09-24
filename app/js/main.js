;
let myApp = (function () {

	/*Переменные*/
	let dataVK,
		vueInstance;

	/*Проверка полной загрузки страницы*/
	function pageReady() {
		return new Promise(function (resolve) {
			if (document.readyState == 'complete') {
				resolve();
			} else {
				window.onload = resolve;
			}
		})
	}

	/*Функция инициализации модуля VUE.js*/
	function vueInit(data) {
		vueInstance = new Vue({
			el: '#friends',
			data: {
				friends: data.items,
				count: data.count
			}
		});
	}

	/*Функция подключения к SDK VK.COM*/
	function connectVK() {
		return new Promise(function (resolve, reject) {
			VK.init({
				apiId: 5632072
			});
			let cbLogin = function (response) {
				if (response.session) {
					resolve(response);
				} else {
					reject(new Error('Отмена авторизации!'));
				}
			};
			VK.Auth.login(cbLogin, 2);
		})
	}

	/*Функция получения списка друзей пользователя из VK.COM*/
	function getFriends() {
		return new Promise(function (resolve, reject) {
			VK.Api.call('friends.get', {'fields': 'bdate, city', v: 5.53}, function (answer) {
				if (answer.error) {
					reject(new Error('error'));
				} else {
					dataVK = answer.response;
					resolve(answer.response);
				}
			})
		})
	}

	/*Функция инициализации модуля*/
	function initApp() {
		pageReady().then(function () {//Жду полной загрузки страницы
			return connectVK();//Подключаюсь к SDK VK.COM
		}).then(function () {
			return getFriends();//Получаю список друзей пользователя из VK.COM
		}).then(function () {
			vueInit(dataVK);
		})
	}

	return {
		init: initApp
	}
})
();

myApp.init();