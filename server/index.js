


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

app.post("/search", async (req, res) => {
    try {
        const dataRec = JSON.stringify(req.body)
        const parseData = dataRec.replace(/ /g, "+");
        const parseData11 = parseData.substring(11);
        const parseData2 = parseData11.substring(0, parseData11.length - 2);
        const browser = await puppeteer.launch();
        console.log(parseData)
        const page = await browser.newPage();
        await page.goto(`https://www.pokellector.com/search?criteria=${parseData2}`,{ waitUntil: 'domcontentloaded' });

        await page.waitForSelector('.cardresult', { timeout: 3000 });
        
        const results = await page.evaluate(() => {
            const items = Array.from(document.querySelectorAll('.cardresult'));
            const data = [];
            items.slice(0, 20).forEach(item => {
                const title = item.querySelector(".detail .name a").textContent.trim();
                const setNumber = item.querySelector(".detail .set a").textContent.trim();
                let parts = setNumber.split("#");
                parts[0] = parts[0].substring(0, parts[0].length - 1);
                data.push({ title, set: parts[0], number: parts[1]});
            });
            return data;
        });
        await browser.close();
        
        //access API
        const fetchPromises = [];
        const apiUrl = "http://localhost:1234/api";
        for (let i = 0; i < results.length; i++) {
            let index = results[i].title.indexOf("(");
            if (index == -1) {
                index = results[i].title.length + 1;
            }
            const nameOnly = results[i].title.substring(0, index).trim();
            const rarity = results[i].title.substring(index, results[i].length). trim();
            
            
            const queryParams = new URLSearchParams({
                name: nameOnly,
                set: results[i].set,
                number: results[i].number
            });
            const dynamicUrl = `${apiUrl}?${queryParams}`;
            fetch(dynamicUrl)
            fetchPromises.push(
                fetch(dynamicUrl)
                .then(response => response.json())
                .then(apiData => {
                    // Return the processed data
                    return {
                        name: nameOnly,
                        rarity: rarity,
                        set: results[i].set,
                        number: results[i].number,
                        image: apiData
                    };
                })
            );
        }
        Promise.all(fetchPromises)
            .then(results => {
            // Send the combined JSON response
            res.json(results);
            //console.log('Combined API data:', results);
        })
       
    } catch (error) {
        console.error('Error fetching pokellector data:', error);
        res.json("No results Found!");
        console.log("hello world!" + JSON.stringify(req.body));
    }
});

//call pokemon api
app.get("/api", (req, res) => {
    
    //trim search queries
    let nameTemp = req.query.name.trim();
    const name = '"' + nameTemp + '"';
    let setTemp = req.query.set;
    setTemp = setTemp.substring(setTemp.indexOf('-') + 1);
    setTemp = setTemp.replace(/ -/g, "").trim();
    const set = '"' + setTemp + '"';
    const number = req.query.number;

    //pokemon.card.all({q: `name:"Charizard" set.name:"Origin Trainer Gallery" number:TG03` })

    //edge case where Promos is present, cannot search by set
    let regex = /^[^0-9]/;
    let promise;
    if (set.toLowerCase().includes("promos") || set.toLowerCase().includes("promo")) {
        promise = pokemon.card.all({q: `name:${name} number:${number}` })
    } else {
        //edge case where TG03, missing the 0
        if (!regex.test(number)) {
            promise = pokemon.card.all({q: `name:${name} set.name:${set} number:${number}` })
        } else {
            promise = pokemon.card.all({q: `name:${name} set.name:${set}` })
        }
    }
    promise.then(result => {
        if (result && result.length > 0) {
            res.json(result[0].images.large);
        } else {
            //case if there are no results from API
            res.json("");
        }
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