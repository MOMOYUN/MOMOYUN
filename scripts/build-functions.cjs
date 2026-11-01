const path=require('node:path');
const esbuild=require('../apps/miniapp/node_modules/esbuild');
esbuild.buildSync({entryPoints:[path.join(__dirname,'../cloudfunctions/event/handler.ts')],outfile:path.join(__dirname,'../cloudfunctions/event/index.js'),bundle:true,platform:'node',target:'node18',format:'cjs',external:['wx-server-sdk']});
