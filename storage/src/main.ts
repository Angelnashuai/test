import { createApp } from "vue";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";
import routes from "./router";
import store from "./store";
const { devServer, publicPath } = require("../vue.config");
// createApp(App).use(store).use(router).mount("#app");
// 新增微应用接入改造
// ------start-------
let router = null;
// 用于保存vue实例
let instance: any = {};
let history: any = {};

// 动态设置 webpack publicPath，防止资源加载出错
// eslint-disable-next-line no-undef
if ((window as any).__POWERED_BY_QIANKUN__) {
  // eslint-disable-next-line no-undef
  __webpack_public_path__ =
    process.env.NODE_ENV === "development"
      ? `//localhost:${devServer.port}${publicPath}`
      : (window as any).__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}

/**
 * 渲染函数
 * 两种情况：主应用生命周期钩子中运行 / 微应用单独启动时运行
 */
function render(props: any = {}) {
  console.log("子应用render的参数", props);
  // 接收主应用下发的base路由
  const { container, routerBase } = props;
  history = createWebHistory(
    (window as any).__POWERED_BY_QIANKUN__ ? routerBase : process.env.BASE_URL
  );
  console.log(999, container, routerBase);
  // eslint-disable-next-line camelcase,no-undef
  if ((window as any).__POWERED_BY_QIANKUN__) {
    props.onGlobalStateChange((state: any, prevState: any) => {
      // state: 变更后的状态; prev 变更前的状态
      console.log("通信状态发生改变：", state, prevState);
      // 这里监听到globalToken变化再更新store
      // store.commit("setToken", "123456");
    }, true);
  }

  // 路由实例
  router = createRouter({
    //模式为history时需要设置基础路径
    // eslint-disable-next-line camelcase,no-undef
    history,
    routes,
  });

  // 挂载应用
  instance = createApp(App);
  instance.use(store);
  instance.use(router);
  instance.mount(
    container ? container.querySelector("#micro-app") : "#micro-app"
  );
}
/**
* bootstrap 只会在微应用初始化的时候调用一次，
  下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
* 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
*/

export const bootstrap = async () => {
  console.log("VueMicroApp bootstraped");
};

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export const mount = (props: any = {}) =>
  Promise.resolve().then(() => {
    console.log("VueMicroApp mount", props);
    render(props);
  });
/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export const unmount = async () => {
  console.log("VueMicroApp unmount");
  // instance.$destroy();
  instance.unmount();
  instance._container.innerHTML = ""; // 子项目内存泄露问题
  instance = null;
  router = null;
  history.destroy();
};
// 独立运行时，直接挂载应用
// eslint-disable-next-line camelcase,no-undef
if (!(window as any).__POWERED_BY_QIANKUN__) {
  render();
}

// ------end-------
