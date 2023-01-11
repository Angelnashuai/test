/**
 * name: 微应用名称 - 具有唯一性
 * entry: 微应用入口 - 通过该地址加载微应用
 * container: 微应用挂载节点 - 微应用加载完成后将挂载在该节点上
 * activeRule: 微应用触发的路由规则 - 触发路由规则后将加载该微应用
 */
const apps = [
   {
      name: 'one',
      entry: 'https://localhost:8081',
      container: '#micro-container',
      activeRule: '/one',
      sandbox: {
         strictStyleIsolation: true, // 开启样式隔离
      },
      props: {},
   },
   {
      name: 'two',
      entry: 'https://localhost:8082',
      container: '#micro-container',
      activeRule: '/two',
      sandbox: {
         strictStyleIsolation: true, // 开启样式隔离
      },
      props: {},
   },
].map((app) => {
   const routerBase = app.activeRule;
   app.props = {
      routerBase, // 下发基础路由
   };
   return app;
});

export default apps;
