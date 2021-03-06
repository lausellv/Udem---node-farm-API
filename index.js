const fs = require("fs"), // enables interaction with the file system
	http = require("http"), // gives us networking capabilities such as building an http server
	url = require("url"),
	slugify = require("slugify"), // requiring a third party module dependency
	replaceTemplate = require("./modules/replaceTemplate");

///
////////////////////////////////////////
// FILES  fs module and the readFileSync() and readFile() (async) methods , writeFile() too
// blocking code  - synchronous code
// const hello = ' Hello World';
// console.log(hello);

// const textIn = fs.readFileSync('./txt/read-this.txt', 'utf-8');
// console.log(textIn);

fs.readFile("./txt/read-this.txt", "utf-8", (err, data) => {
	let textIn = data;
	console.log(`Output: ${textIn}`);
	fs.writeFile("./txt/final2.txt", `${textIn}`, "utf-8", err => {
		console.log("your file has been written 😀");
	});
});

// const textOut = `This is what we know about the avocado: ${textIn}.\n Created by Victor on ${Date.now()}`;
// // fs.writeFile('./text/output.txt', 'Hello', function (err) {
// //   if (err) throw err;
// //   console.log('File has been written!')
// // });

// fs.writeFileSync('./txt/output.txt', textOut);
//  fs.readFile('./txt/start.txt', 'utf-8', (err, data1)=> {
//        if (err) {
//               console.log ('Error! 🥴')
//        }
//       fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2)=> {
//                 console.log (data2);
//           fs.readFile('./txt/append.txt', 'utf-8', (err, data3)=> {
//                  console.log (data3);
//             // fs.writeFile('./txt/output.txt', `${data2} \n ${data3}`, (err, data4)=>{
//                   fs.writeFile('./txt/final.txt', `${data2} \n ${data3}`, 'utf-8', err => {
// console.log('your file has been written 🌮')
//                   });
//           });
//       });
// });
//  console.log('will read file');

//////////////////////////////////////
// SERVER  http module  using the createServer() method which takes a req and res

// we can do the sync version for each of the templates bc we are on the top level code (only executed once)

const tempOverview = fs.readFileSync(__dirname + "/templates/overview-template.html", "utf-8");
const tempCard = fs.readFileSync(`${__dirname}/templates/card-template.html`, "utf-8");
const tempProduct = fs.readFileSync(`${__dirname}/templates/product-template.html`, "utf-8");
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");

const dataObject = JSON.parse(data); // this an array of 5 objects

const slugs = dataObject.map(el => slugify(el.productName, { lower: true }));
// console.log(slugify('Fresh Avocado', {lower:true, replacement: ' '}));
console.log(slugs);

//SERVER
const server = http.createServer((req, res) => {

	const { query, pathname } = url.parse(req.url, true); // E6 object destructuring
	// OVERVIEW OR HOME PAGE
	if (pathname === "/" || pathname === "/overview") {
		// we can read the template overview outside since it's a constant
		// so we will do so in a function outside to simplify the code
		res.writeHead(200, { "content-type": "text.html" });

		// // res.end('<h1>This is the overview</h1>');

		const cardsHtml = dataObject.map(product => replaceTemplate(tempCard, product)).join(""); //join all the elements of the array into one string

		const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
		res.end(output);

		///PRODUCT PAGE
	} else if (pathname == "/product") {
		res.writeHead(200, { "Content-type": "text.html" });
		const product = dataObject[query.id];
		const output = replaceTemplate(tempProduct, product);
		res.end(output);
	}
	///API PAGE
	else if (pathname === "/api") {
		res.writeHead(200, {
			"Content-type": "application/json"
		});
		res.end(data);
	}
	///NOT FOUND
	else {
		res.writeHead(404, {
			"Content-type": "text/html",
			"My-own-header": "hello-world"
		});
		res.end("<h1>Page not found!</h1>");
	}
});

//127.0.0.1 - standard IP address : port
server.listen(8000, "127.0.0.1", () => {
	console.log("Listening to requests on port 8000");
});
