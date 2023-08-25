const scrapers = require('./scrapers.js')
const fs = require('fs')
const scrapeController = async (browserInstance) => {
    let url = "https://books.toscrape.com/"
    let browser = await browserInstance
    let categorys = await scrapers.scrapeCategoty(browser, url)
    let i = 0
    let data = {}
    for (i; i < categorys.length; i++) {
        data[categorys[i].category] = await scrapers.scraper(browser, categorys[i].link)
    }
    console.log(data)
    browser.close()
    console.log('đã cào xong. Đóng web')


    fs.writeFile('data.json', JSON.stringify(data), error => {
        if (error) {
            console.log('lỗi khi ghi file ' + error)
            return
        }
        console.log('thêm dữ liệu vào file thành công')
    })
}

module.exports = scrapeController