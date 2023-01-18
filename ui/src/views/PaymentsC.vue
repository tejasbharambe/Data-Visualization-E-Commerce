<template>
    <div class="home">
        <h1 class="heading-1">Analysis on Payments</h1>
        <div class="container-fluid">
          <div class="row">
            <div class="col">
              <div class="card p-3">
              <DonutChartPayC></DonutChartPayC>
            </div>
            </div>
            <div class="col">
              <div class="card p-3">
              <BarChartPayC></BarChartPayC>
            </div>
            </div>
          </div>
          <div class="row ml-3">
            <div class="card p-3">
            <LineChartPayC></LineChartPayC></div>
          </div>

        </div>
    </div>
  </template>
  
  <script>
  // @ is an alias to /src
import LineChartPayC from "../components/LineChartPayC";
import DonutChartPayC from "../components/DonutChartPayC";
import BarChartPayC from "../components/BarChartPayC.vue";
  
  export default {


    name: 'PaymentsC',
    components: {
    DonutChartPayC,
    LineChartPayC,
    BarChartPayC
}
  }
  </script>