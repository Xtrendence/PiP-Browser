document.addEventListener("DOMContentLoaded", () => {
	const electron = require("electron");
	const { ipcRenderer } = electron;

	let body = document.body;
	let menu = document.getElementById("menu");
	let settings = document.getElementById("settings");

	let buttonShowMenu = document.getElementById("button-show-menu");
	let buttonHideMenu = document.getElementById("button-hide-menu");
	let buttonDrag = document.getElementById("button-drag");
	let buttonSettings = document.getElementById("button-settings");
	let buttonCloseSettings = document.getElementById("button-close-settings");
	let buttonSetURL = document.getElementById("button-set-url");
	let buttonSetBackground = document.getElementById("button-set-background");
	let buttonSetSize = document.getElementById("button-set-size");
	let buttonResetSize = document.getElementById("button-reset-size");
	let buttonAlwaysOnTop = document.getElementById("button-always-on-top");
	let buttonQuit = document.getElementById("button-quit");

	getURL();
	getScreen();

	buttonShowMenu.addEventListener("click", () => {
		toggleMenu();
	});

	buttonHideMenu.addEventListener("click", () => {
		toggleMenu();
	});

	buttonSettings.addEventListener("click", () => {
		toggleSettings();
	});

	buttonCloseSettings.addEventListener("click", () => {
		toggleSettings();
	});

	buttonSetURL.addEventListener("click", () => {
		let url = document.getElementById("input-url").value;
		loadURL(url, false);

		ipcRenderer.send("set-url", { url:url, background:false });
	});

	buttonSetBackground.addEventListener("click", () => {
		let url = document.getElementById("input-url").value;
		loadURL(url, true);

		ipcRenderer.send("set-url", { url:url, background:true });
	});

	buttonSetSize.addEventListener("click", () => {
		try {
			let width = parseInt(document.getElementById("input-width").value);
			let height = parseInt(document.getElementById("input-height").value);

			if(!empty(width) && !empty(height) && !isNaN(width) && !isNaN(height)) {
				ipcRenderer.send("set-screen", { width:width, height:height });
			}
		} catch(e) {
			console.trace(e);
		}
	});

	buttonResetSize.addEventListener("click", () => {
		ipcRenderer.send("set-screen", { width:595, height:335 });
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

	ipcRenderer.on("set-url", (event, response) => {
		loadURL(response.url, response.background);
	});

	ipcRenderer.on("set-screen", (event, screen) => {
		let frame = document.getElementsByTagName("iframe")[0];
		if(!empty(frame)) {
			frame.width = screen.width + "px";
			frame.height = screen.height + "px";
		}

		document.getElementById("input-width").value = screen.width;
		document.getElementById("input-height").value = screen.height;
	});

	function getURL() {
		ipcRenderer.invoke("get-url");
	}

	function getScreen() {
		ipcRenderer.invoke("get-screen");
	}

	function loadURL(url, background) {
		let frames = document.getElementsByTagName("iframe");
		for(let i = 0; i < frames.length; i++) {
			frames[i].remove();
		}

		let images = document.getElementsByClassName("background");
		for(let i = 0; i < images.length; i++) {
			images[i].remove();
		}

		if(background) {
			let image = document.createElement("img");
			image.src = url;
			image.id = "background";
			image.classList.add("background");
			image.addEventListener("error", () => {
				image.remove();
			});

			body.appendChild(image);
		} else {
			let frame = document.createElement("iframe");
			frame.src = url;
			frame.id = "view";
			frame.scrolling = "no";
			frame.frameBorder = "0";

			body.appendChild(frame);
		}
		
		document.getElementById("input-url").value = url;
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
			buttonDrag.classList.remove("draggable");
			settings.classList.remove("hidden");
		} else {
			buttonDrag.classList.add("draggable");
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