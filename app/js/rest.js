;
let myApp = (function () {

	/*Переменные*/
	let vueInstance,
		table = document.getElementById('table-cars'),//
		curentElem = null,
		parentCurentElem = null,
		dropElem = null,
		indexCurent = null,
		indexAfterFirst = null,
		indexAfterSecond = null,
		dataLS = getLS();

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
			el: '#cars',
			data: {
				cars: data.items,
				count: data.count,
				nextItem: data.count + 1
			}
		});
	}

	/*Функция получения данных из LS*/
	function getLS() {
		if (localStorage.allCars) {
			return JSON.parse(localStorage.allCars);
		} else {
			return {
				count: 0,
				items: []
			};
		}
	}

	/*Функция сохранения данных в LS*/
	function saveLS() {
		localStorage.allCars = JSON.stringify(dataLS);
	}

	/*Функция добавления строки данных*/
	function addItem() {
		let newCar = {},
			place = document.getElementById('new-car--place'),
			marka = document.getElementById('new-car--marka'),
			model = document.getElementById('new-car--model'),
			color = document.getElementById('new-car--color'),
			number = document.getElementById('new-car--number');
		if (place.value && marka.value && model.value && color.value && number.value) {
			newCar.place = place.value;
			newCar.marka = marka.value;
			newCar.model = model.value;
			newCar.color = color.value;
			newCar.number = number.value;

			place.value = "";
			marka.value = "";
			model.value = "";
			color.value = "";
			number.value = "";
		} else {
			return alert("Заполните все поля.");
		}
		dataLS.count = dataLS.count + 1;
		dataLS.items.push(newCar);
		saveLS();
	}

	/*Функция удаления строки данных*/
	function dellItem(event) {
		let delIndex = event.target.getAttribute('data-index');
		dataLS.count = dataLS.count - 1;
		dataLS.items.splice(delIndex, 1);
		saveLS();
	}

	/*Функция редактирования строки данных*/
	function editInput(event) {
		let indexDataLS = event.target.getAttribute('data-index'),
			editData = event.target.closest('tr').getElementsByTagName('input');

		dataLS.items[indexDataLS].place = editData[0].value;
		dataLS.items[indexDataLS].marka = editData[1].value;
		dataLS.items[indexDataLS].model = editData[2].value;
		dataLS.items[indexDataLS].color = editData[3].value;
		dataLS.items[indexDataLS].number = editData[4].value;

		event.target.previousElementSibling.classList.toggle('hide');
		event.target.classList.toggle('hide');
		saveLS();
	}

	/*Функция обработки полей редактирования*/
	function editEnter(event) {
		let itemIndex = event.target.getAttribute('data-index'),
			itemProp = event.target.getAttribute('data-input'),
			newValue = event.target.value,
			delButton = event.target.closest('tr').lastElementChild.firstElementChild,
			editButton = event.target.closest('tr').lastElementChild.lastElementChild;

		if (dataLS.items[itemIndex][itemProp] !== newValue) {
			delButton.classList.add('hide');
			editButton.classList.remove('hide');
		} else {
			delButton.classList.toggle('hide');
			editButton.classList.toggle('hide');
		}
	}

	/*Функция обнуления данных Drag & Drop*/
	function setNull() {
		indexCurent = null;
		indexAfterFirst = null;
		indexAfterSecond = null;
		table.classList.remove('drag');
		if (curentElem && parentCurentElem) {
			curentElem.classList.remove('drag');
			parentCurentElem.classList.remove('cadetblurBG');
			parentCurentElem = null;
		}
		if (dropElem) dropElem.classList.remove('orangeBG');
	}

	/*Функция отслеживания нажатия и удержания левой клавиши мыши*/
	function mouseDown(event) {
		if (event.target.classList.contains('table__row-item--id-drag')) {
			indexCurent = event.target.getAttribute('data-index');
			curentElem = event.target;
			parentCurentElem = event.target.parentElement;
			curentElem.classList.add('drag');
			parentCurentElem.classList.add('cadetblurBG');
		}
	}

	/*Функция отслеживания перетаскивания элемента*/
	function mouseMove(event) {
		event.preventDefault();
		if (indexCurent) {
			table.classList.add('drag');
			getSpace(event);
			if (indexCurent != indexAfterSecond) dropBG();
		}
	}

	/*Функция определения пространства над которым отпустили левую кнопку мыши*/
	function getSpace(event) {
		indexAfterSecond = document.elementFromPoint(event.clientX, event.clientY).getAttribute('data-index');
	}

	/*Функция перекрашивания BG принимающего элемента*/
	function dropBG() {
		if (indexAfterFirst != indexAfterSecond) {
			if (dropElem) dropElem.classList.remove('orangeBG');
			dropElem = document.querySelector('tr[data-index="' + indexAfterSecond + '"]');
			if (dropElem) dropElem.classList.add('orangeBG');
			indexAfterFirst = indexAfterSecond;
		}
	}

	/*Функция переформировка данных LS*/
	function drop() {
		dataLS.items.splice(indexAfterSecond, 0, dragElem = dataLS.items.splice(indexCurent, 1)[0]);
		saveLS();
		setNull();
	}

	/*Функция отслеживания отпускания левой клавиши мыши и запуска соответствующего действия*/
	function whereMouseUp(event) {
		event.preventDefault();
		if (event.target.classList.contains('table__row-item-button--add')) {
			addItem();
		} else if (event.target.classList.contains('table__row-item-button--del')) {
			dellItem(event);
		} else if (event.target.classList.contains('table__row-item-button--edit')) {
			editInput(event);
		} else if (indexCurent && indexAfterSecond && event.target.classList.contains('table__row-item--id-drag')) {
			drop(event);
		} else {
			setNull();
		}
	}

	/*Функция отслеживания событий*/
	function events() {
		document.addEventListener('mouseup', whereMouseUp);
		document.addEventListener('mousedown', mouseDown);
		document.addEventListener('mousemove', mouseMove);
		document.addEventListener('input', function (event) {
			if (event.target.closest('tr').id != 'table__row--add-car') {
				editEnter(event);
			}
		});
	}

	/*Функция инициализации модуля*/
	function initApp() {
		pageReady().then(function () {//Жду полной загрузки страницы
			vueInit(dataLS);
			events();
		})
	}

	return {
		init: initApp
	}
})();

myApp.init();