const express = require('express');
const app = express();
const cors = require('cors')
const {Builder, Browser, By, Key, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fsp = require('fs').promises;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : true}));


app.get("/", (req, res) => {
    res.send("<h1>Hello Node</h1>")
})

app.get("/line", async (req, res) => {
    const options = new chrome.Options();
    
    options.addArguments(["--headless"])
    options.addArguments(["--no-sandbox"])
    options.addArguments(["--disable-dev-shm-usage"])
    const driver = await new Builder()
        .forBrowser(Browser.CHROME)
        .setChromeOptions(options)
        .build();
    
    await driver.get("https://hiosha.osha.gov.tw/content/info/heat1.aspx")
    
    await driver.manage().window().maximize();
    await driver.sleep(500)
    await driver.findElement(By.id('ContentPlaceHolder1_txtAddress')).clear();
    await driver.findElement(By.id('ContentPlaceHolder1_txtAddress')).sendKeys("台北市內湖區")
    await driver.findElement(By.className('btn-success')).click()
        
    await driver.sleep(1000);    
    await driver.executeScript("window.scrollTo(0,0);");   
    const chart = driver.findElement(By.id("parent_bg"));    
    await driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center', inline: 'nearest'})", chart)
    await driver.sleep(2000)  
    const image = await chart.takeScreenshot();    
    await fsp.writeFile("chart.png", image, 'base64')
    await driver.quit();
    res.send("ok")
})

app.listen(3000, () => {
    console.log("Server is running")
})