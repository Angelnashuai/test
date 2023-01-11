// import 'whatwg-fetch';
// import 'custom-event-polyfill';
// import 'core-js/stable/promise';
// import 'core-js/stable/symbol';
// import 'core-js/stable/string/starts-with';
// import 'core-js/web/url';
import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import App from './App.vue';
import 'ant-design-vue/dist/antd.css';
import router from './router';
import store from './store';
import start from './micros';

import { message } from 'ant-design-vue';

import { setCustomResponse } from './utils/http';

const app = createApp(App);
app.use(Antd);
app.use(store);
app.use(router);

setCustomResponse(({ success, error, response }: any = {}) => {
   // if (response.data) {
   //   console.log(111, "成功");
   //   message.success('提交成功!')
   //   return false
   // }
   // if (success.weatherinfo.img1 === "n1.gif") {
   //   message.error("登录超时，请重新登录!");
   //   router.push("/login ");
   //   return false;
   // }
   return { success, error };
});

app.mount('#app');

start();
