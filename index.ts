import puppeteer, { Page, Browser, executablePath } from 'puppeteer'
import puppeteerExtra from 'puppeteer-extra'
import stealth from 'puppeteer-extra-plugin-stealth'
import readlineSync from 'readline-sync'


(async () => {

    interface SearchOptions {
        [key: string]: string;
    }

    // Define the search options object
    const searchOptions: SearchOptions = {
        google: 'https://google.com',
        nike: 'https://www.nike.com'
    };

    let first_question = readlineSync.question('Which site would you like to search? ');


    const setupPuppeteer = async (): Promise<{ browser: Browser, page: Page, siteUrl: string }> => {
        puppeteerExtra.use(stealth());
        const browser = await puppeteer.launch({ headless: false, executablePath: executablePath(), product: "chrome" });
        const page = await browser.newPage();
        // Enable JavaScript execution
        await page.setJavaScriptEnabled(true);

        const site = new URL(`https://${first_question}.com`).toString() 

        return { browser, page, siteUrl: site };
    };

    const performNikeSearch = async (searchInputSelector = 'input#VisualSearchInput'): Promise<any | undefined> => {

        const { page, browser, siteUrl } = await setupPuppeteer();

        let search_input = readlineSync.question('What would you like to search for? ');

        try {
            console.log('going right here', siteUrl)

            await page.goto(siteUrl)

            await page.locator(searchInputSelector).click()

            await page.type(searchInputSelector, search_input)

            await page.keyboard.press('Enter');

            await page.waitForNavigation();

            const options: any[] = await page.$$eval('div > figure', options => {
                return options.map(option => {
                    let link = option.innerHTML.match(/href="([^"]*)"/)
                    let price = option.innerHTML.match(/<div class="product-card__price"[\s\S]*?>\$([\d.]+)/i)
                    let nameOfProduct = option.innerHTML.match(/aria-label="([^"]*)"/)?.at(1)

                    return {
                        link: link?.at(1),
                        price: `$${price?.at(1)}`,
                        name: nameOfProduct
                    };
                });
            });
            console.log('page', JSON.stringify(options));

        } catch (error) {
            console.error(`Error: ${error}`)
        } finally {
            await new Promise(resolve => setTimeout(resolve, 5000));
            await browser.close()
        }

    }

    const googleSearch = async (searchInputSelector = 'textarea[aria-label="Search"]'): Promise<any | undefined> => {

        const { page, browser, siteUrl } = await setupPuppeteer()


        let search_input = readlineSync.question('What would you like to search for? ');
        let search_input2 = readlineSync.question('What company or brand would you like to search for?');


        try {
            await page.goto(siteUrl ?? '')

            // use inurl: Search for pages with a particular word in the URL. 
            await page.type(searchInputSelector, `${search_input} intitle:${search_input} inurl:${search_input2}`)

            await page.keyboard.press('Enter')

            await page.locator("span ::-p-text(Shopping)").click()

            await page.waitForNavigation()

            const options: any[] = await page.$$eval('* > div:nth-child(9) > div:nth-child(2) > div', options => {

                const mapOFOptions = options.map(option => {
                    const { innerText, innerHTML } = option as HTMLElement

                    const parser = new DOMParser()
                    const doc: Document = parser.parseFromString(innerHTML, 'text/html')

                    // Remove <style> and <img> tags
                    doc.querySelectorAll('style, img').forEach(el => el.remove())

                    // Remove inline styles
                    doc.querySelectorAll('[style]').forEach(el => el.removeAttribute('style'))

                    // Extract hrefs from <a> tags
                    const links = Array.from(doc.querySelectorAll('a'))

                    const hrefs: (string | null)[] = links.map(link => {
                        const href = link.getAttribute('href');
                        if (href) {
                            if (href.includes('nike') || href.includes('shoe')) {
                                return href
                            }
                        }
                        return null
                    });





                    // Combine innerText and hrefs
                    const combinedText = `${innerText}\n${hrefs.join('\n')}`;

                    // Serialize the document back into a string
                    const cleanInnerHTML = doc.documentElement.outerHTML;

                    return {
                        combinedText: combinedText,
                        innerHTML: cleanInnerHTML
                    };
                })

                return mapOFOptions
            });
            // console.log('page', options)
            return options
        } catch (error) {
            console.error(`Error: ${error}`)
        } finally {
            await new Promise(resolve => setTimeout(resolve, 5000));
            await browser.close()
        }
    }



    if (searchOptions.hasOwnProperty(first_question)) {
        switch (first_question) {
            case 'google':
                await googleSearch(searchOptions['google'])
                break
            case 'nike':
                await performNikeSearch()
                break
            default:
                console.log("Invalid search option")
                break
        }
    } else {
        console.log("There was an error with the search option you provided. Please try again with a valid option.");
    }
})();





