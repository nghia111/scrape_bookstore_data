const startBrowser = require('./browser.js')
const scrapeController = require("./scrapeController.js")

let browser = startBrowser()
scrapeController(browser)
