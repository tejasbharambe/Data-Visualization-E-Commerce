<template>
  <div class="home">
    <JumbotronC></JumbotronC>
    <div class="container">
      This website is created for the sales and marketing team at Olist, a Brazilian e-commerce portal. The purpose of this platform is
    to serve them with the essential information needed to drive business decisions that could generate higher revenues
    and, eventually, profits. The platform provides users with the ability to analyze the following:
    <ul class="heading-list">
      <li>
        <h3 class="heading">Orders on E-Commerce:</h3>
        <ul>
          <li>Visualize the number of orders based on their status like delivered shipped, canceled</li>
          <li>Visualize the trend of the number of orders from 09/2016 to 10/2018</li>
          <li>Order frequency like orders by day of the week and further deep-dive into orders by the time of the day</li>
        </ul>
      </li>
      <li>
        <h3 class="heading">Regional-level analysis of the E-Commerce</h3>
        <ul>
          <li>Visualize the trend of total orders received across regions of Brazil</li>
          <li>Envision the number of products bought in each state of the region and how they are related to the average price of
          the products across all the states of the regionss</li>
          <li>
            Analyze differences in estimated delivery, freight value, and delivery time for products across all the states of
          the regions
          </li>
        </ul>
      </li>
      <li>
        <h3 class="heading">Payment type analysis</h3>
        <ul>
          <li>
            Analyze the ratio between different modes of payment for the orders
          </li>
          <li>Distribution of the payment installments from 1 to up to 24 installments</li>
          <li> Evolution of the payment types from Jan 2017 to Aug 2018</li>
        </ul>
      </li>
      <li>
        <h3 class="heading">Map</h3>
        <ul>
          <li>Visualize the number of customers per province/state in Brazil</li>
          <li>
            Visualize the number of sellers per province/state in Brazil
          </li>
          <li>
            Getting idea of relative orders and customers per region to concentrate more on the e-commerce range
          </li>
        </ul>
      </li>
      <li>
        <h3 class="heading">Machine Learning Model</h3>
        We have combined all the above-mentioned features to predict how the users would rate the items they have not bought
    yet. This would enable the regional directors to have accurate recommendations to the users. The features that we
    have explored include -
        <ul>
          <li>
            We have performed the data cleaning and data preprocessing techniques like so and so before training the model
          </li>
          <li>We have used the XGBRegressor model to predict the user rating for the items with an RMSE score of so and so.</li>
        </ul>

    
    
      </li>
    </ul>
    
    
    


    <div class="card">
    <h3>About Data:</h3>
    This is a Brazilian ecommerce public dataset of orders made at Olist Store. The dataset has information of 100k
    orders from 2016 to 2018 made at multiple marketplaces in Brazil. Its features allows viewing an order from multiple
    dimensions: from order status, price, payment and freight performance to customer location, product attributes and
    finally reviews written by customers. We also released a geolocation dataset that relates Brazilian zip codes to
    lat/lng coordinates.
    </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import JumbotronC from '@/components/JumbotronC.vue';
export default {
  name: 'HomeC',
  components: {
    JumbotronC
  }
}
</script>
<style>
  .container{
    max-width: 2000px;
    align-items: flex-start;
    text-align: left;
    padding: -1% 3% -1% 3%;

  }
  .heading-list{
    list-style: none;
  }

</style>