import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
const files = {'/':['index.html','text/html'], '/index.html':['index.html','text/html'], '/app.mjs':['app.mjs','text/javascript'], '/geometry.mjs':['geometry.mjs','text/javascript'], '/style.css':['style.css','text/css'], '/README.md':['README.md','text/plain']};
const server=createServer(async(req,res)=>{const item=files[new URL(req.url,'http://localhost').pathname]; if(!item){res.writeHead(404);return res.end('Not found');}try{const body=await readFile(new URL(item[0],import.meta.url));res.writeHead(200,{'Content-Type':item[1]+'; charset=utf-8','Cache-Control':'no-store'});res.end(body);}catch{res.writeHead(500);res.end('Cannot read file');}});
server.listen(0,'127.0.0.1',()=>console.log(`Open http://127.0.0.1:${server.address().port}/ (Ctrl+C to stop)`));
