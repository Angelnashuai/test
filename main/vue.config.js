module.exports = {
  // css: {
  //   extract: true,
  //   sourceMap: false,
  //   loaderOptions: {
  //     css: {},
  //     less: {},
  //   },
  //   requirModuleExtension: false,
  // },
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
  devServer: {
    port: 8080,
    https: true,
    proxy: {
      "/weather": {
        target: "http://www.weather.com.cn/", //API服务器的地址
        ws: true, //代理websockets
        changeOrigin: true, // 虚拟的站点需要更管origin
        pathRewrite: {
          // 路径改写规则
          "^/weather": "", // 以/proxy/为开头的改写为''
        },
      },
    },
  },
  // transpileDependencies: [/[/\\]node_modules[/\\](.+?)?@vue(.*)[/\\]shared/]
};
