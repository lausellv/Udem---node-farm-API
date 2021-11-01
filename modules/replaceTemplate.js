// in this case this is a named fucntion. If you have several functions in a module , it's bes to name them. 
let replaceTemplate = (temp, product)=>{
	let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);  // we don't use the quotes and used instead regular {palceholder}/g for global
output=output.replace(/{%IMAGE%}/g, product.image);
output=output.replace(/{%PRICE%}/g, product.price);
output=output.replace("{%ORIGIN%}", product.from);
output=output.replace("{%NUTRIENTS%}", product.nutrients);
output=output.replace("{%QUANTITY%}", product.quantity);
output=output.replace("{%DESCRIPTION%}", product.description);
output=output.replace("{%ID%}", product.id);
if(!product.organic){ output=output.replace("{%NOT_ORGANIC%}", "not-organic");}
return output;
}

module.exports = replaceTemplate;

