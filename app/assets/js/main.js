document.addEventListener("DOMContentLoaded", () => {
	const electron = require("electron");
	const { ipcRenderer } = electron;

	let body = document.body;
	let menu = document.getElementById("menu");
	let settings = document.getElementById("settings");

	let buttonShowMenu = document.getElementById("button-show-menu");
	let buttonHideMenu = document.getElementById("button-hide-menu");
	let buttonSettings = document.getElementById("button-settings");
	let buttonCloseSettings = document.getElementById("button-close-settings");
	let buttonSetURL = document.getElementById("button-set-url");
	let buttonAlwaysOnTop = document.getElementById("button-always-on-top");
	let buttonQuit = document.getElementById("button-quit");

	getURL();

	buttonShowMenu.addEventListener("click", () => {
		toggleMenu();
	});

	buttonHideMenu.addEventListener("click", () => {
		toggleMenu();
	});

	buttonSettings.addEventListener("click", () => {
		toggleMenu();
		toggleSettings();
	});

	buttonCloseSettings.addEventListener("click", () => {
		toggleSettings();
	});

	buttonSetURL.addEventListener("click", () => {
		let url = document.getElementById("input-url").value;
		loadURL(url);

		if(!empty(url)) {
			ipcRenderer.send("set-url", url);
		}
	});

	buttonAlwaysOnTop.addEventListener("click", () => {
		ipcRenderer.invoke("toggle-always-on-top");
	});

	buttonQuit.addEventListener("click", () => {
		ipcRenderer.invoke("quit");
	});

	ipcRenderer.on("toggle-menu", () => {
		toggleMenu();
	});

	ipcRenderer.on("set-url", (event, url) => {
		loadURL(url);
	});

	function getURL() {
		ipcRenderer.invoke("get-url");
	}

	function loadURL(url) {
		if(!empty(url)) {
			let frames = document.getElementsByTagName("iframe");
			for(let i = 0; i < frames.length; i++) {
				frames[i].remove();
			}

			let frame = document.createElement("iframe");
			frame.src = url;
			frame.id = "view";
			frame.scrolling = "no";
			frame.frameBorder = "0";

			body.appendChild(frame);
			document.getElementById("input-url").value = url;
		}
	}

	function toggleMenu() {
		if(menu.classList.contains("hidden")) {
			menu.classList.remove("hidden");
		} else {
			menu.classList.add("hidden");
		}
	}

	function toggleSettings() {
		if(settings.classList.contains("hidden")) {
			settings.classList.remove("hidden");
		} else {
			settings.classList.add("hidden");
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