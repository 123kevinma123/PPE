const express = require("express");
const cors = require('cors');
const axios = require('axios');
const app = express();
const puppeteer = require('puppeteer');
app.use(cors());


app.get("/", (req, res) => {
    res.send("hello world");
});

app.get('/ebay-search', async (req, res) => {
    try {
        const browser = await puppeteer.launch();

        const page = await browser.newPage();

        await page.goto('https://www.ebay.com/sch/i.html?_nkw="cynthia"+"hidden+fates"+"sv82"+"psa+10"');
        
        await page.waitForSelector('.s-item');
        
        const results = await page.evaluate(() => {
            const items = document.querySelectorAll('.s-item');
            const data = [];
            items.forEach(item => {
                const title = item.querySelector('.s-item__title').textContent.trim();
                const price = item.querySelector('.s-item__price').textContent.trim();
                const url = item.querySelector('.s-item__link').href;
                data.push({ title, price, url });
            });
            return data;
        });
        await browser.close();
        const processed_data = [];
        for (let i = 1; i < results.length; i++) {
            const resultStr = results[i].title.toString();
            if (resultStr.toLowerCase().includes("psa 10") && 
                ! resultStr.toLowerCase().includes("japanese")
            ) {
                processed_data.push(results[i]);
            }
        }
        //dconsole.log(processed_data);
        res.json(processed_data);
    } catch (error) {
        console.error('Error fetching eBay data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

  
  app.listen(1234);