document.addEventListener("DOMContentLoaded", () => {
	const electron = require("electron");
	const { ipcRenderer } = electron;

	let view = document.getElementById("view");

	ipcRenderer.invoke("get-url").then((url) => {
		view.src = url;
	});
});