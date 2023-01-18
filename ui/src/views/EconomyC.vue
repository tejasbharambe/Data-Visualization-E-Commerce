<template>

  <div class="home">
    <!-- 3.2 E-commerce Order Analysis -->


    <!-- <div class="row">
      <div class="col"> -->
    <br />
    <h2 class="mt-2">1. Number of Orders Per Region</h2><br />
    <!-- <h6> The plot here shows the total number of orders in the region</h6> -->
    <div class="card p-3">
      <tj_line_order_count_chart></tj_line_order_count_chart>
    </div>


    <br /><br /><br />
    <h2 class="mt-2">2. Price vs Number of Products vs Number of Cities</h2><br />
    <!-- <h6> Purpose of this plot</h6> -->
    <div class="card p-3">
      <Scatter_tj></Scatter_tj>
    </div>
    <!-- </div> -->

    <br /><br /><br />
    <h2 class="mt-2">3. State Level Analysis for Difference in Estimated Delivery, Freight Value (BRL) & Delivery Time
    </h2>
    <br />
    <!-- <h6> Purpose of this plot</h6> -->
    <div class="card p-3">
      <Bar_Chart_Tj></Bar_Chart_Tj>
    </div>

  </div>

  <!-- </div> -->
</template>
  
<script>
// @ is an alias to /src
import Bar_Chart_Tj from '@/components/tj_bar_states.vue';
import tj_line_order_count_chart from '@/components/tj_line_order_count.vue';
// import Line_Chart_Sales_tj from '@/components/tj_line_order_sales.vue';
import Scatter_tj from '@/components/tj_scatter.vue';

export default {
  name: 'EconomyC',
  components: {
    Bar_Chart_Tj,
    tj_line_order_count_chart,
    // Line_Chart_Sales_tj,
    Scatter_tj
  }
}
</script>