


const express = require("express");
const cors = require('cors');
const axios = require('axios');
const app = express();
const puppeteer = require('puppeteer');
app.use(cors());
const pokemon = require("pokemontcgsdk");
require('dotenv').config()
const apikey = process.env.APIKEY

pokemon.configure({apikey})

app.use(express.json());

app.get("/", (req, res) => {
    res.send("hello world");
});
app.post("/search", (req, res) => {
    const data = req.body;
    console.log(data);
    res.send('Data received successfully');
});
app.get("/api", (req, res) => {
    pokemon.card.find('base1-4')
    .then(card => {
        //console.log(card.name) // "Charizard"
    })
    pokemon.card.where({q: "name:charizard"})
    .then(result => {
        //console.log(result.data.length)
    })
    pokemon.card.all({q: 'set.name:"vivid voltage"' })
    .then(result => {
        const cardNames = result.map(card => card.name)
        console.log(result.length)
        res.json(cardNames)
    })
    pokemon.set.all({q: 'name:"vivid voltage"', orderBy: "-set.releaseDate"})
    .then((result) => {
        const cardNames = result.map(card => card.name)
        //console.log(result.length)
        //res.json(cardNames)
    })
})

app.get("/watch-count-search", async (req, res) => {
    try {
        const browser = await puppeteer.launch();

        const page = await browser.newPage();
        await page.goto('http://www.watchcount.com/completed.php?bkw=%22cynthia%22+%22sv82%22+%22psa10%22&bcat=0&bcts=&sfsb=Show+Me%21&csbin=all&cssrt=ts&bfw=1&bslr=&bnp=&bxp=#serp');

        await page.waitForSelector(".serptablecell2-adv");
        
        const results = await page.evaluate(() => {
            const items = document.querySelectorAll(".serptablecell2-adv");
            const data = [];
            items.forEach(item => {
                const title = item.querySelector(".valtitle.lovewrap.padr4 > span > a").textContent.trim();
                const endTime = item.querySelector(".splittablecell1 .bhserp-dim2").textContent.trim();
                const price = item.querySelector(".splittablecell1 .bhserp-new1").textContent.trim();
                const url = item.querySelector(".underlinedlinks").href;
                data.push({ title, endTime, price, url });
            });
            return data;
        });
        await browser.close();
        const processed_data = [];
        for (let i = 0; i < results.length; i++) {
            const resultStr = results[i].title.toString();
            if (resultStr.toLowerCase().includes("psa 10") && 
                ! resultStr.toLowerCase().includes("japanese")
            ) {
                processed_data.push(results[i]);
            }
        }
        //console.log(processed_data.length);
        res.json(processed_data);
    } catch (error) {
        console.error('Error fetching watch count data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/ebay-search', async (req, res) => {
    try {
        const browser = await puppeteer.launch();

        const page = await browser.newPage();

        await page.goto('https://www.ebay.com/sch/i.html?_from=R40&_nkw=%22cynthia%22+%22sv82%22+&_sacat=0&_ipg=240');
        
        await page.waitForSelector('.s-item');
        
        const results = await page.evaluate(() => {
            const items = document.querySelectorAll('.s-item');
            const data = [];
            items.forEach(item => {
                const title = item.querySelector(".s-item__title").textContent.trim();
                const price = item.querySelector(".s-item__price").textContent.trim();
                const url = item.querySelector(".s-item__link").href;
                data.push({ title, price, url });
            });
            return data;
        });
        await browser.close();
        console.log(results.length);
        const processed_data = [];
        //filter results here 
        for (let i = 1; i < results.length; i++) {
            const resultStr = results[i].title.toString();
            if (resultStr.toLowerCase().includes("psa 10") && 
                ! resultStr.toLowerCase().includes("japanese")
            ) {
                processed_data.push(results[i]);
            }
        }
        console.log(processed_data.length);
        res.json(processed_data);
    } catch (error) {
        console.error('Error fetching eBay data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

  
  app.listen(1234);