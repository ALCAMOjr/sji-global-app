import puppeteer from 'puppeteer';
import cheerio from 'cheerio';

const username = process.env.TRIBUNAL_USERNAME;
const password = process.env.TRIBUNAL_PASSWORD;
const loginUrl = process.env.TRIBUNAL_URL;

async function initializeBrowser() {
    const browser = await puppeteer.launch({
        headless: true, 
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        defaultViewport: null,
    });
    const page = await browser.newPage();
    await page.goto(loginUrl);
    await page.waitForSelector('#UserName');
    await page.type('#UserName', username);
    await page.type('#Password', password);
    await page.click('#Usuario_btnSesion');
    await page.waitForNavigation();

    return { browser, page };
}

async function fillExpTribunalA(page, url) {
    let navigated = false;
    let attempts = 0;
    while (!navigated && attempts < 3) {
        try {
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
            navigated = true;
        } catch (error) {
            attempts++;
            if (attempts >= 3) {
                throw new Error(`No se pudo navegar a la URL: ${url} después de 3 intentos.`);
            }
        }
    }

    try {
        await page.click('#plus');
    } catch (error) {
        throw new Error('Error al hacer clic en el botón plus', error);
    }

    try {
        await page.waitForSelector('.show-hide-content.slidingDiv', { timeout: 60000 }); 
    } catch (error) {
        throw new Error('Error esperando al contenido expandido', error);
    }

    const expandedContent = await page.content();
    const $expanded = cheerio.load(expandedContent);

    const juzgado = $expanded('#ContentPlaceHolderPrincipal_lblJuzgado').text().trim();
    const juicio = $expanded('#ContentPlaceHolderPrincipal_lblJuicio').text().trim();
    const ubicacion = $expanded('#ContentPlaceHolderPrincipal_lblUbicacion').text().trim();
    const partes = $expanded('#ContentPlaceHolderPrincipal_lblPartes').text().trim();
    const expediente = $expanded('#ContentPlaceHolderPrincipal_lblExpediente').text().trim();

    return { juzgado, juicio, ubicacion, partes, expediente };
}

export { initializeBrowser, fillExpTribunalA };
