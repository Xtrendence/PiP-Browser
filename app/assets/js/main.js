document.addEventListener("DOMContentLoaded", () => {
	const electron = require("electron");
	const { ipcRenderer } = electron;

	let body = document.body;
	let menu = document.getElementById("menu");
	let view = document.getElementById("view");

	let buttonShowMenu = document.getElementById("button-show-menu");
	let buttonHideMenu = document.getElementById("button-hide-menu");
	let buttonSettings = document.getElementById("button-settings");
	let buttonAlwaysOnTop = document.getElementById("button-always-on-top");
	let buttonQuit = document.getElementById("button-quit");

	buttonShowMenu.addEventListener("click", () => {
		toggleMenu();
	});

	buttonHideMenu.addEventListener("click", () => {
		toggleMenu();
	});

	buttonSettings.addEventListener("click", () => {

	});

	buttonAlwaysOnTop.addEventListener("click", () => {
		ipcRenderer.invoke("toggle-always-on-top");
	});

	buttonQuit.addEventListener("click", () => {
		ipcRenderer.invoke("quit");
	});

	ipcRenderer.invoke("get-url").then((url) => {
		if(!empty(url)) {
			view.src = url;
		}
	});

	ipcRenderer.on("toggle-menu", () => {
		toggleMenu();
	});

	function toggleMenu() {
		if(menu.classList.contains("hidden")) {
			menu.classList.remove("hidden");
		} else {
			menu.classList.add("hidden");
		}
	}

	function empty(value) {
		if(typeof value === "object" && value !== null && Object.keys(value.length === 0)) {
			return true;
		}
		if(value === null || typeof value === "undefined" || value.toString().trim() === "") {
			return true;
		}
		return false;
	}
});