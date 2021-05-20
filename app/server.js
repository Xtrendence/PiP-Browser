const localPort = 2500;

const path = require("path");
const fs = require("fs").promises;
const electron = require("electron");
const express = require("express");
const Store = require("electron-store");

const { app, BrowserWindow, screen, ipcMain } = electron;
const localExpress = express();
localExpress.listen(localPort, "localhost");

const store = new Store();

app.requestSingleInstanceLock();

app.on("ready", () => {
	let windowWidth = 595;
	let windowHeight = 335;

	const localWindow = new BrowserWindow({
		width: windowWidth,
		height: windowHeight,
		resizable: true,
		frame: false,
		transparent: false,
		x: 1920 - windowWidth - 20,
		y: 1080 - windowHeight - 20 - 40,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false
		}
	});

	localExpress.set("views", path.join(__dirname, "views"));
	localExpress.set("view engine", "ejs");
	localExpress.use("/assets", express.static(path.join(__dirname, "assets")));

	localWindow.loadURL("http://127.0.0.1:" + localPort);

	localExpress.get("/", (req, res) => {
		res.render("index");
	});

	ipcMain.handle("get-url", () => {
		return "https://www.xtrendence.com";
	});
});