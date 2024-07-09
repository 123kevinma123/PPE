require('dotenv').config();

const express = require("express");
const cors = require('cors');
const axios = require('axios');
const puppeteer = require('puppeteer');
const pokemon = require("pokemontcgsdk");

const app = express();
app.use(cors());
app.use(express.json());

const apikey = process.env.APIKEY;
pokemon.configure({ apiKey: apikey });

console.log(`API Key: ${apikey}`); // Verify if API Key is loaded

const getOptions = () => {
  const options = {
    headers: {}
  };
  if (apikey) {
    options.headers['X-Api-Key'] = apikey;
    console.log('API Key in options:', apikey); // Log the API key for debugging
  } else {
    console.log('API key is missing!');
  }
  console.log('Options:', options); // Log the options object for debugging
  return options;
};

// Set up Axios interceptors to log response headers
axios.interceptors.response.use(response => {
  //console.log('Response Headers:', response.headers); // Log response headers
  return response;
}, error => {
  //console.log('Error Response Headers:', error.response ? error.response.headers : 'No response headers'); // Log error response headers
  return Promise.reject(error);
});

app.get("/", (req, res) => {
  res.send("hello world");
  console.log(`API Key: ${apikey}`);
  console.log("Hello World");
});

app.post("/search", async (req, res) => {
  try {
    //console.log("Received /search request"); // Log when /search is called
    const dataRec = JSON.stringify(req.body);
    const parseData = dataRec.replace(/ /g, "+");
    const parseData11 = parseData.substring(11);
    const parseData2 = parseData11.substring(0, parseData11.length - 2);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`https://www.pokellector.com/search?criteria=${parseData2}`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.cardresult', { timeout: 3000 });

    const results = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.cardresult'));
      const data = [];
      items.slice(0, 20).forEach(item => {
        const title = item.querySelector(".detail .name a").textContent.trim();
        const setNumber = item.querySelector(".detail .set a").textContent.trim();
        let parts = setNumber.split("#");
        parts[0] = parts[0].substring(0, parts[0].length - 1);
        data.push({ title, set: parts[0], number: parts[1] });
      });
      return data;
    });
    await browser.close();

    //console.log("Results from Puppeteer:", results); // Log the results

    // Access API
    const fetchPromises = [];
    const apiUrl = "http://localhost:1234/api";
    for (let i = 0; i < results.length; i++) {
      let index = results[i].title.indexOf("(");
      if (index === -1) {
        index = results[i].title.length + 1;
      }
      const nameOnly = results[i].title.substring(0, index).trim();
      const rarity = results[i].title.substring(index).trim();

      const queryParams = new URLSearchParams({
        name: nameOnly,
        set: results[i].set,
        number: results[i].number
      });
      const dynamicUrl = `${apiUrl}?${queryParams}`;

      fetchPromises.push(
        axios.get(dynamicUrl, getOptions())
          .then(response => response.data)
          .then(apiData => ({
            name: nameOnly,
            rarity: rarity,
            set: results[i].set,
            number: results[i].number,
            image: apiData
          }))
      );
    }

    const combinedResults = await Promise.all(fetchPromises);
    res.json(combinedResults);

  } catch (error) {
    console.error('Error fetching pokellector data:', error);
    res.status(500).json("No results Found!");
  }
});

// Directly calling the Pokémon API and logging response headers
app.get("/api", async (req, res) => {
  const nameTemp = req.query.name.trim();
  const name = `"${nameTemp}"`;
  let setTemp = req.query.set;
  setTemp = setTemp.substring(setTemp.indexOf('-') + 1);
  setTemp = setTemp.replace(/ -/g, "").trim();
  const set = `"${setTemp}"`;
  const number = req.query.number;

  let query = `name:${name}`;
  if (set.toLowerCase().includes("promos") || set.toLowerCase().includes("promo")) {
    query += ` number:${number}`;
  } else {
    query += ` set.name:${set}`;
    if (!/^[^0-9]/.test(number)) {
      query += ` number:${number}`;
    }
  }
  //console.log(query);

  const options = {
    headers: {
      'X-Api-Key': apikey
    },
    params: {
      q: query
    }
  };
  //console.log('Sending request to Pokémon TCG API with the following options:', options); // Log the request details
  try {
    const response = await axios.get('https://api.pokemontcg.io/v2/cards', options);
    //console.log('Pokémon TCG API Response Headers:', response.headers);

    const result = response.data.data;
    if (result && result.length > 0) {
      res.json(result[0].images.large);
    } else {
      res.json("");
    }
  } catch (error) {
    console.error('Error fetching Pokémon API data:', error.response ? error.response.data : error.message);
    console.error('Error Response Headers:', error.response ? error.response.headers : 'No response headers');
    res.status(500).json("Error fetching Pokémon API data");
  }
});

app.post("/api2", async (req, res) => {
  const { returnClicked } = req.body;
  let name = returnClicked[0];
  let set = returnClicked[2];
  let number = returnClicked[3];
  let query = `name:"${name}"` + ` set.name:"${set}"` + ` number:${number}`;
  //console.log(query);

  const options = {
    headers: {
      'X-Api-Key': apikey
    },
    params: {
      q: query
    }
  };
  //console.log('Sending request to Pokémon TCG API with the following options:', options); // Log the request details
  try {
    const response = await axios.get('https://api.pokemontcg.io/v2/cards', options);
    //console.log('Pokémon TCG API Response Headers:', response.headers);

    const result = response.data.data;
    if (result && result.length > 0) {
      res.json(result[0]);
      //console.log(result[0]);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error('Error fetching Pokémon API data:', error);
  }
});
app.post("/watch-count-search", async (req, res) => {
  try {
    //defining variables
    let half = 0;
    let median = 0;
    let low = 0;
    let high = 0;
    let avg = 0;
    let sum = 0;
    let tempURL = "";
    let statistics = {
      low,
      high,
      median,
      avg,
      tempURL,
    };
    const { returnClicked } = req.body;
    const name = returnClicked[0];
    const rarity = returnClicked[1];
    const set = returnClicked[2];
    const number = returnClicked[3];
    const PSAGrade = returnClicked[4];
    if (PSAGrade == null) {
      res.json({results: [], statistics });
      return;
    }
    const browser = await puppeteer.launch();

    const page = await browser.newPage();
    tempURL = `http://www.watchcount.com/completed.php?bkw=%22${name}%22+%22${number}%22+%22${PSAGrade}%22&bcat=0&bcts=&sfsb=Show+Me%21&csbin=all&cssrt=ts&bfw=1&bslr=&bnp=&bxp=#serp`
    await page.goto(tempURL);
    console.log(tempURL);

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
    //console.log(results);
    await browser.close();

    const processed_data = [];
    const onlyPrices = [];

    for (let i = 0; i < results.length; i++) {
      const resultStr = results[i].title.toString();
      if (resultStr.toLowerCase().includes(returnClicked[4].toLowerCase()) &&
        !resultStr.toLowerCase().includes("japanese")
      ) {
        processed_data.push(results[i]);
        const cleanedPriceString = results[i].price.replace(/[$,()USD]/g, ''); // Remove both $ and ,
        const priceNumber = Number(cleanedPriceString);
        onlyPrices.push(priceNumber);
      }
    }
    onlyPrices.sort((a, b) => a - b);
    //console.log(onlyPrices);
    //console.log(processed_data);
    half = Math.floor(onlyPrices.length / 2);
    median = onlyPrices[half];
    low = onlyPrices[0];
    high = onlyPrices[onlyPrices.length - 1];
    sum = 0;
    for (let i = 0; i < onlyPrices.length; i++) {
      sum += onlyPrices[i];
    }
    avg = sum / onlyPrices.length;
    statistics = {
      low,
      high,
      median,
      avg,
      tempURL,
    };

    res.json( {results: processed_data, statistics });
  } catch (error) {
    console.error('Error fetching watch count data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/ebay-search', async (req, res) => {
  try {
        //defining variables
        let half = 0;
        let median = 0;
        let low = 0;
        let high = 0;
        let avg = 0;
        let sum = 0;
        let tempURL = "";
        let statistics = {
          low,
          high,
          median,
          avg,
          tempURL,
        };
    const browser = await puppeteer.launch();

    const page = await browser.newPage();

    const { returnClicked } = req.body;

    const name = returnClicked[0];
    const rarity = returnClicked[1];
    const set = returnClicked[2];
    const number = returnClicked[3];
    const PSAGrade = returnClicked[4];
      if (PSAGrade == null) {
        res.json({results: [], statistics });
        return;
      }
    tempURL = `https://www.ebay.com/sch/i.html?_from=R40&_nkw=%22${returnClicked[0]}%22+%22${returnClicked[1]}%22+%22${returnClicked[3]}%22&_ipg=240`;
    await page.goto(tempURL);
    //console.log(name + rarity + set + number + PSAGrade + "hello world");
    console.log(tempURL);


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
    //console.log(results.length);
    const processed_data = [];
    const onlyPrices = [];

    //filter results here
    if (name != null) {

    for (let i = 2; i < results.length; i++) {
      const resultStr = results[i].title.toString();
      //console.log(resultStr);
      if (resultStr.toLowerCase().includes(returnClicked[4].toLowerCase()) &&
        !resultStr.toLowerCase().includes("japanese")
      ) {
        processed_data.push(results[i]);
        const cleanedPriceString = results[i].price.replace(/[$,]/g, ''); // Remove both $ and ,
        const priceNumber = Number(cleanedPriceString);
        onlyPrices.push(priceNumber);
        //console.log(results[i]);
      }
    }
    //console.log(processed_data);
    
    onlyPrices.sort((a, b) => a - b);
    //console.log(onlyPrices);
    half = Math.floor(onlyPrices.length / 2);
    median = onlyPrices[half];
    low = onlyPrices[0];
    high = onlyPrices[onlyPrices.length - 1];
    sum = 0;
    for (let i = 0; i < onlyPrices.length; i++) {
      sum += onlyPrices[i];
    }
    avg = sum / onlyPrices.length;
    /*console.log(median);
    console.log(high);
    console.log(low);
    console.log(avg);*/
  }
  statistics = {
    low,
    high,
    median,
    avg,
    tempURL,
  };
    console.log(tempURL);
    res.json( {results: processed_data, statistics });

  } catch (error) {
    console.error('Error fetching eBay data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(1234, () => {
  console.log("Server is running on port 1234");
});