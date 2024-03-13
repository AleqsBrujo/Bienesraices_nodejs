/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/homeMap.js":
/*!***************************!*\
  !*** ./src/js/homeMap.js ***!
  \***************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function() {\r\n    const lat =  20.7492851;\r\n    const lng =  -103.4040704;\r\n    \r\n    let properties = []\r\n\r\n    const map = L.map('homeMap', {\r\n        center: [lat, lng],\r\n        zoom: 12,\r\n        dragging: false\r\n    });\r\n\r\n    let markers = new L.FeatureGroup().addTo(map)\r\n\r\n    //Filtro\r\n    const filters = {\r\n        category: \"\",\r\n        price: ''\r\n    }\r\n    \r\n    const categorySelect = document.querySelector('#categories')\r\n    const priceSelect = document.querySelector('#prices')\r\n    \r\n\r\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\r\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\r\n    }).addTo(map)\r\n\r\n\r\n    //Filtrando Categorias y Precios\r\n        categorySelect.addEventListener('change', e => {\r\n            filters.category = +e.target.value\r\n            filtrarPropiedades(filters.category)\r\n            \r\n            \r\n        })\r\n\r\n        priceSelect.addEventListener(\"change\", e => {\r\n            filters.price = +e.target.value\r\n            filtrarPropiedades(filters.price)\r\n            \r\n        })\r\n\r\n        \r\n        \r\n\r\n    const gettingProperties = async () => {\r\n        try {\r\n            const url = '/api/properties'\r\n            const resp = await fetch(url)\r\n            properties = await resp.json()\r\n            \r\n            showProperties(properties)\r\n            \r\n        } catch (error) {\r\n            console.log(error)\r\n        }\r\n\r\n\r\n    }\r\n\r\n    const showProperties = propertieDB => {\r\n\r\n        //Limpiar markers previos\r\n        markers.clearLayers()\r\n\r\n        propertieDB.forEach(propertie => {\r\n            const marker = new L.marker([propertie?.lat, propertie?.lng], {\r\n                autoPan: true\r\n            })\r\n            .addTo(map)\r\n            .bindPopup(`\r\n                <p class='text-black font-bold'>${propertie?.Category.name}</p>\r\n                <h1 class='text-xl font-extrabold uppercase my-2'>${propertie?.title}</h1>\r\n                <img src=\"/uploads/${propertie?.image}\" alt='Imagen de la propiedad ${propertie?.title}'/>\r\n                <p class='text-gray-600 font-bold text-center'>${propertie?.Price.name}</p>\r\n                <a href='/properties/${propertie.id}' class='bg-black block p-2 text-center font-bold uppercase rounded  '>Ver Propiedad</a>\r\n            `)\r\n\r\n            markers.addLayer(marker)\r\n        })\r\n        \r\n    }\r\n\r\n    const filtrarPropiedades = () => {\r\n        const result = properties.filter(categoriesFilter).filter(priceFilter)\r\n        \r\n        showProperties(result)\r\n    }\r\n\r\n    const categoriesFilter = prop => filters.category ? prop.CategoryId === filters.category : prop\r\n\r\n    const priceFilter = prop => filters.price ? prop.PriceId === filters.price : prop\r\n    \r\n    \r\n    gettingProperties()\r\n    \r\n\r\n\r\n\r\n})()\n\n//# sourceURL=webpack://bienesraices/./src/js/homeMap.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/homeMap.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;