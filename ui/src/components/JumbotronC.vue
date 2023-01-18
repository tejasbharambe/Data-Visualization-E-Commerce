<template >
    <div>
    <div class="jumbotron">
    

</div>
<div class="container-fluid">
<div class="row justify-content-left">
        <div class="col">
            <div class="ml-2">
        <h1 class="rt">viz-wiz-ALS</h1>
   </div>
        </div>

</div>
</div>
</div>
</template>
<script>
export default {
    name:"JumbotronC"
}
</script>
<style >
    .jumbotron{
        background-image:url('../assets/purchases.jpg');
  height:300px;
  background-repeat: 2;
  background-size:contain;
}

  h1.rt {
    font-family: sans-serif;
  font-size: 87px;
  padding: 20px 10px;
  text-align: center;
  text-transform: uppercase;
  text-rendering: optimizeLegibility;
    color: #2c2c2c;
    background: transparent;
    letter-spacing: .05em;
    text-shadow: 
      4px 4px 0px #d5d5d5, 
      7px 7px 0px rgba(247, 0, 0, 0.2);
  }

</style>