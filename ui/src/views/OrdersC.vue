<template>
    <div class="home">
        <div class="container-fluid">
        <div class="row">
          <div class="col-6" style="border-style:groove;">
          <LineChartOrders></LineChartOrders>
        </div>
        <div class="col-6" style="border-style:groove ;">
          <StackedBarChartOrders></StackedBarChartOrders>
        </div>
        </div>
        <div class="row">
          <div class="col-6" style="border-style:groove;">
          <MultipleBarChartOrders></MultipleBarChartOrders>
        </div>
        <div class="col-6" style="border-style:groove;">
          <StackedAreaChartOrders></StackedAreaChartOrders>
        </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  // @ is an alias to /src
  
  import LineChartOrders from "../components/Line_chart_orders.vue";
  import StackedBarChartOrders from "../components/StackedBarChart_orders.vue";
  import MultipleBarChartOrders from "../components/MultiBarChart_orders.vue";
  import StackedAreaChartOrders from "../components/StackedAreaChart_orders.vue";
  export default {
    name: 'OrdersC',
    components: {
      LineChartOrders,
      StackedBarChartOrders,
      MultipleBarChartOrders,
      StackedAreaChartOrders
    }
  }
  </script>