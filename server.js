import express from 'express';
import {createServer } from 'node:http';
import {dirname, join } from 'node:path';
import {fileURLToPath} from 'node:url';
import { Server } from 'socket.io';
//import { jwt } from 'jsonwebtoken';
import { registerSocketHandlers} from './socketHandler.js';
import { validateAndSanitizeImage} from './validateImage.js';
import * as esbuild  from 'esbuild';

const app = express();
const server = createServer(app);
const __dirname = dirname(fileURLToPath(import.meta.url));
const io = new Server(server, {
    connectionStateRecovery: {
        maxDisconnectionDuration: 2*60*100,
        skipMiddlewares:false
    }
});
const ctx = await esbuild.context({
    entryPoints: ['src/start.js'],
    alias: {
        'root': join( __dirname, 'src'),
    },
    bundle: true,
    outfile: 'public/bundle.js',
    sourcemap: true,
});

await ctx.watch();
const port = 4200;
app.use(express.json({limit: '5mb'}));
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
registerSocketHandlers(io);

app.get('/' , (req,res) => {
    res.sendFile(join (__dirname, 'login.html'));
});

app.post('/login', (req,res)=> {
  //  console.log('Received form data:', req.body)
})

app.post('/api/upload', 
    validateAndSanitizeImage ,
    (req, res)=> {
    const {filename, size, mimetype } = req.sanitizedImage;
    res.json({
        fileName:filename,
        size:size, 
        mimetype: mimetype
    })
})

app.get('/home', (req,res) => {
    res.sendFile(join (__dirname, 'index.html'));
})

server.listen(port,'0.0.0.0' ,()=> {
    console.log(`Server running on port${port}`);
})
