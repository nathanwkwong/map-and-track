// vue.config.js


module.exports = {
  devServer: {
    port: 3050,
    // proxy: {
    //     '/socket.io': {
    //       target: 'http://localhost:3050/api',
    //       ws: true,
    //       changeOrigin: true
    //     },
    //      'sockjs-node': {
    //        target: 'http://localhost:3050/api',
    //        ws: false,
    //        changeOrigin: true
    //      },
    //  },
     disableHostCheck: true,
   }
};


