const localPort = 2500;

const path = require("path");
const fs = require("fs").promises;
const electron = require("electron");
const localShortcut = require("electron-localshortcut");
const express = require("express");
const Store = require("electron-store");

const { app, BrowserWindow, screen, ipcMain } = electron;
const localExpress = express();
localExpress.listen(localPort, "localhost");

const store = new Store();

app.name = "PiP Browser";
app.requestSingleInstanceLock();

app.on("ready", () => {
	const { width, height } = screen.getPrimaryDisplay().workAreaSize;
	let screenWidth = width;
	let screenHeight = height;

	let windowWidth = empty(store.get("width")) ? 595 : store.get("width");
	let windowHeight = empty(store.get("height")) ? 335 : store.get("height");

	const localWindow = new BrowserWindow({
		width: windowWidth,
		height: windowHeight,
		resizable: false,
		frame: false,
		transparent: false,
		alwaysOnTop: false,
		x: screenWidth - windowWidth - 20,
		y: screenHeight - windowHeight - 20,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false
		}
	});

	localShortcut.register(localWindow, "Alt+S", () => {
		localWindow.webContents.send("toggle-menu");
	});

	localExpress.set("views", path.join(__dirname, "views"));
	localExpress.set("view engine", "ejs");
	localExpress.use("/assets", express.static(path.join(__dirname, "assets")));

	localWindow.loadURL("http://127.0.0.1:" + localPort);

	localExpress.get("/", (req, res) => {
		res.render("index");
	});

	ipcMain.handle("get-url", () => {
		empty(store.get("url")) ?? store.set("url", "");
		empty(store.get("background")) ?? store.set("background", true);
		localWindow.webContents.send("set-url", { url:store.get("url"), background:store.get("background") });
	});

	ipcMain.handle("get-screen", () => {
		localWindow.webContents.send("set-screen", { width:windowWidth, height:windowHeight });
	});

	ipcMain.on("set-url", (event, args) => {
		store.set("url", args.url);
		store.set("background", args.background);
	});

	ipcMain.on("set-screen", (event, args) => {
		windowWidth = args.width;
		windowHeight = args.height;

		localWindow.resizable = true;

		localWindow.setSize(windowWidth, windowHeight);
		localWindow.setPosition(screenWidth - windowWidth - 20, screenHeight - windowHeight - 20);

		localWindow.webContents.send("set-screen", { width:windowWidth, height:windowHeight });

		store.set("width", windowWidth);
		store.set("height", windowHeight);

		localWindow.resizable = false;
	});

	ipcMain.handle("toggle-always-on-top", () => {
		localWindow.isAlwaysOnTop() ? localWindow.setAlwaysOnTop(false) : localWindow.setAlwaysOnTop(true);
	});

	ipcMain.handle("quit", () => {
		app.quit();
	});
});

function empty(value) {
	if(typeof value === "object" && value !== null && Object.keys(value.length === 0)) {
		return true;
	}
	if(value === null || typeof value === "undefined" || value.toString().trim() === "") {
		return true;
	}
	return false;
}