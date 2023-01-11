/**
 * 主应用管理微应用配置
 */
import {
  registerMicroApps,
  addGlobalUncaughtErrorHandler,
  start,
  initGlobalState,
} from "qiankun"; // 微应用注册信息
import apps from "./app";

const state = {};
//主项目与子项目交互用的参数，子项目与主项目都可以修改此参数
const actions = initGlobalState(state);

export { actions };

registerMicroApps(apps, {
  beforeLoad: (app) => {
    // 加载微应用前，加载进度条
    // NProgress.start();
    console.log("before load", app.name);
    return Promise.resolve();
  },
  afterMount: (app) => {
    // 加载微应用前，进度条加载完成
    // NProgress.done();
    console.log("after mount", app.name);
    return Promise.resolve();
  },
});

// setDefaultMountApp(apps[0].activeRule)

addGlobalUncaughtErrorHandler((event: any) => {
  console.error(event);
  const { message: msg } = event;
  if (msg && msg.includes("died in status LOADING_SOURCE_CODE")) {
    console.error("微应用加载失败，请检查应用是否可运行");
  }
});
export default start;
