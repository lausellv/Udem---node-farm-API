// const url = require("url");
const http = require("http");
const fs = require("fs");

//server

const replaceTemplate = (temp, product) => {
	let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
	output = output.replace(/{%IMAGE%}/g, product.image);
	output = output.replace(/{%PRICE%}/g, product.price);
	output = output.replace(/{%QUANTITY%}/g, product.quantity);
	output = output.replace(/{%FROM%}/g, product.FROM);
	output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
	output = output.replace(/{%DESCRIPTION%}/g, product.description);
	output = output.replace(/{%ID%}/g, product.id);
	if (!product.organic) {
		output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
	}
	return output;
};

const tempOverview = fs.readFileSync(`${__dirname}/templates/overview-template.html`, "utf8");
const cardTemplate = fs.readFileSync(`${__dirname}/templates/card-template.html`, "utf8");
const productTemplate = fs.readFileSync(`${__dirname}/templates/product-template.html`, "utf8");

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
	const pathName = req.url;

	//overview
	if (pathName === "/" || pathName == "/overview") {
		res.writeHead(200, { "Content-Type": "text/html" });

		const cardsHtml = dataObj.map(el => replaceTemplate(cardTemplate, el)).join("");
const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
		console.log(cardsHtml);

		res.end(output);
		//product
	} else if (pathName === "/product") {
		res.end("this is the product page");
		//API
	} else if (pathName === "/api") {
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
