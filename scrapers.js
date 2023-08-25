
const scrapeCategoty = async (browser, url) => {
    try {
        let page = await browser.newPage()
        console.log(">> mở tab mới...")
        await page.goto(url)
        console.log(">> truy cập đến trang " + url)
        await page.waitForSelector("#default")
        console.log(">> website đã load xong...")

        const dataCategory = await page.$$eval('#default> div.container-fluid> div.page_inner > div.row > aside.sidebar > div.side_categories > ul.nav > li > ul > li', (elements) => {
            let data = elements.map((element) => {
                return {
                    category: element.querySelector('a').innerText,
                    link: element.querySelector('a').href
                }
            })
            return data
        })
        await page.close()
        console.log('tab đã đóng')
        return dataCategory
    } catch (error) {
        console.log("lỗi ở scrape category " + error)
        return error
    }
}
const scraper = async (browser, url) => {
    try {
        let bookData = []
        const newPage = await browser.newPage()
        console.log('>> mở tab mới')
        await newPage.goto(url)
        console.log('>> truy cập đến trang ' + url)
        await newPage.waitForSelector('#default')
        console.log(">> website đã load xong...")

        // const category = await newPage.$eval('#default > div.container-fluid > div.page_inner > div.row > div.col-sm-8  > div.page-header > h1', (el) => {
        //     return el.innerText
        // })


        const linkDetail = await newPage.$$eval('#default > div.container-fluid> div.page_inner > div.row > div.col-sm-8 > section > div > ol.row > li ', (elements) => {
            let data = elements.map((element) => {
                return element.querySelector('article.product_pod > div.image_container > a').href
            })
            return data
        })

        const scrapeDetail = async (browser, linkDetail) => {
            try {
                const newPage = await browser.newPage();
                await newPage.goto(linkDetail)
                console.log('truy cập dến detail ' + linkDetail)
                await newPage.waitForSelector('#default')
                console.log('load xong page detail ')

                const tiltle = await newPage.$eval('#content_inner > article.product_page > div.row > div.col-sm-6 > h1', el => {
                    return el.innerText
                })
                const price = await newPage.$eval('#content_inner > article.product_page > div.row > div.col-sm-6 > p.price_color', el => {
                    return el.innerText
                })
                const available = await newPage.$eval('#content_inner > article.product_page > div.row > div.col-sm-6 > p.instock', el => {
                    return el?.innerText.match(/[0-9]+/)[0]
                })
                const img = await newPage.$eval('#product_gallery > div.thumbnail > div.carousel-inner > div.item > img', el => {
                    return el?.src
                })
                const description = await newPage.$eval('#content_inner > article.product_page > p', el => {
                    return el.innerText
                })
                const upc = await newPage.$eval('#content_inner > article.product_page > table > tbody > tr:first-child > td', el => {
                    return el.innerText
                })
                newPage.close()
                return data = {
                    tiltle: tiltle,
                    price: price,
                    available: available,
                    imageUrl: img,
                    bookDescription: description,
                    upc: upc
                }

            } catch (error) {
                console.log('lỗi ở scrape Detail ' + error)
            }
        }



        let i = 0;
        for (i; i < linkDetail.length; i++) {
            bookData.push(await scrapeDetail(browser, linkDetail[i]))

        }

        newPage.close()
        console.log('>>>>>>>>>đóng trang category')
        return bookData
    } catch (error) {
        console.log(' lỗi ở scraper ' + error)
    }
}

module.exports = { scrapeCategoty, scraper }