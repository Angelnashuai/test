<template>
  <div id="nav">
    主菜单
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/one/">Child Home</router-link> |
    <router-link to="/one/about">Child about</router-link> |
    <router-link to="/two/">Two Home</router-link> |
    <router-link to="/two/about">Two about</router-link>
  </div>
  <div class="router-view">
    <router-view />
    <!-- 新添加，微应用的容器 -->
    <div id="micro-container"></div>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
