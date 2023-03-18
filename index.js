/*const Stream = require('node-rtsp-stream');
const fastify = require('fastify')({ logger: true });
stream = new Stream({
    name: 'name',
    streamUrl: 'rtsp://admin:team1556th@192.168.31.205:554/onvif1',
    wsPort: 9999,
    ffmpegOptions: { // options ffmpeg flags
      '-stats': '', // an option with no neccessary value uses a blank string
      '-r': 30 // options with required values specify the value after the key
    }
  })

fastify.get('/', async (request, reply) => {
    reply.send(stream);
})

fastify.listen(3000, (err, address) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    fastify.log.info(`server listening on ${address}`);
});*/

// const NodeMediaServer = require('node-media-server');

// const config = {
//     logType: 3, // 3 - Log everything (debug)
//     rtmp: {
//         port: 1935,
//         chunk_size: 120000,
//         gop_cache: true,
//         ping: 60,
//         ping_timeout: 120
//     },
//     http: {
//         port: 8000,
//         allow_origin: '*'
//     },
//     relay: {
//         ffmpeg: '/usr/bin/ffmpeg',
//         tasks: [
//             {
//                 app: 'cctv',
//                 mode: 'static',
//                 edge: 'rtsp://192.168.200.1:554',
//                 name: 'uterum',
//                 rtsp_transport : 'tcp' //['udp', 'tcp', 'udp_multicast', 'http']
//             },
// //             {
// //                 app: 'cctv',
// //                 mode: 'static',
// //                 edge: 'rtsp://admin:team1556th@192.168.31.205:554/onvif2',
// //                 name: 'tertwo',
// //                 rtsp_transport : 'udp' //['udp', 'tcp', 'udp_multicast', 'http']
// //             }
//         ]
//     }
// };

// var nms = new NodeMediaServer(config)
// nms.run();

/*const streams = [
    {
      name: "Test",
      url: `rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov`,
      videoOpts: "-s 240x160 -b:v 1000k -r 30" // Any additional video options for FFMPEG
    }
  ];
   
  const StreamManager = require("rtsp-over-http")({
    app: require("express")(),
    wss: require("ws").Server,
    port: 3000, // The port your Express app is listening on
    streams
  });*/

const express = require('express');
const app = express();

const { proxy, scriptUrl } = require('rtsp-relay')(app);

const handler = proxy({
  url: `rtsp://192.168.200.1:554`,
  // if your RTSP stream need credentials, include them in the URL as above
  verbose: false,
});

// the endpoint our RTSP uses
app.ws('/api/stream', handler);

// this is an example html page to view the stream
app.get('/', (req, res) =>
  res.send(`
  <canvas id='canvas'></canvas>

  <script src='${scriptUrl}'></script>
  <script>
    loadPlayer({
      url: 'ws://' + location.host + '/api/stream',
      canvas: document.getElementById('canvas')
    });
  </script>
`),
);

app.listen(1935);
