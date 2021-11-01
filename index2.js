// Core modules
const http = require("http");
const fs = require("fs");
const url = require("url");

//third party modules
const slugify = require('slugify')


// our own modules
const replaceTemplate = require("./modules/replaceTemplate2.js");

//server



const tempOverview = fs.readFileSync(`${__dirname}/templates/overview-template.html`, "utf8");
const cardTemplate = fs.readFileSync(`${__dirname}/templates/card-template.html`, "utf8");
const productTemplate = fs.readFileSync(`${__dirname}/templates/product-template.html`, "utf8");

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf8");
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el)=>
slugify(el.productName, {lowercase: true})
)
// console.log (slugify("Fresh Avocados", {lower:true}))
console.log (slugs)
const server = http.createServer((req, res) => {
	const { query, pathname } = url.parse(req.url, true);


	//overview
	if (pathname === "/" || pathname == "/overview") {
		res.writeHead(200, { "Content-Type": "text/html" });

		const cardsHtml = dataObj.map(el => replaceTemplate(cardTemplate, el)).join("");
		const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
		// console.log(cardsHtml);

		res.end(output);
		//product
	} else if (pathname === "/product") {
		res.writeHead(200, { "Content-Type": "text/html" })
		const product = dataObj[query.id]
		const output = replaceTemplate(productTemplate, product)
		res.end(output);
		//API
	} else if (pathname === "/api") {
		res.writeHead(200, { "Content-Type": "application/json" });
		res.end(data);
	} else {
		//not found
		//headers always need to be set before the response- use hyphens too
		res.writeHead(404, { "Content-Type": "text/html", "My-Header": "Hello World" });
		res.end("<h1>Page not found!</h1>");
	}
});

server.listen(8000, "127.0.0.1", () => {
	console.log("listening on port 8000");
});
