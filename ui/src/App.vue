<template>

  <div class="flex" id="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
        <a href="#" class="navbar-brand">viz-wiz-ALS</a>
        <button type="button" class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarCollapse">
            <div class="navbar-nav mx-auto">
              <router-link to="/" class="nav-item nav-link">Home</router-link>
      <router-link to="/about" class="nav-item nav-link">About</router-link> 
      <router-link to="/orders" class="nav-item nav-link">Orders</router-link> 
      <router-link to="/economy" class="nav-item nav-link">Economy</router-link>
      <router-link to="/payments" class="nav-item nav-link">Payments</router-link> 
      <router-link to="/mapbox" class="nav-item nav-link">Map based Analysis</router-link>
      <!-- <router-link to="/3.5" class="nav-item nav-link">ML Model</router-link>  -->
            </div>
        </div>
    </div>
</nav>
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}


</style>
