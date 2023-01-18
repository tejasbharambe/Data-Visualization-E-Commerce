# DSCI 554 Project
Team name: vizwiz-ALS
Team members:
- Lukas Stein <lukasste@usc.edu>
- Vinjit Regulagedda <sregulag@usc.edu>
- Amit Birajdar <abirajda@usc.edu>
- Navyada Koshatwar <koshatwa@usc.edu>
- Tejas Sujit Bharambe <tbharamb@usc.edu>

## Project summary (max 250 words)
This platform is created for the sales and marketing teams of the OLIST e-commerce portal. The purpose of this platform is to serve them with the essential information needed to drive business decisions that could generate higher revenues and, eventually, profits. The platform provides users with the ability to analyze the following:

- Orders on E-Commerce to analyze order trends, and growth MoM with an ability to deep-dive by the status of the orders and the day of the orders.
- Regional-level analysis of E-Commerce to analyze the number of orders and their price, delivery time, delay time, and freight value across regions of Brazil
- Payment type analysis to visualize the trends in payments bifurcated by payment type and number of installments
- The density of e-commerce across regions based on counts of cities, customers, and vendors plotted on a map with draggable elements to compare raw data against relative area
- A machine learning model with all the above-mentioned features to predict how the users would rate the unbought items which can be used by the sales and marketing team at Olist to improve their recommendation system for users and make an informed decision on how to leverage price reduction to boost ratings of their products


## Artifacts
- Demo: [Demo link](https://github.com/DSCI-554/project-vizwiz_als) and/or [dev set-up instructions](DEV_INSTRUCTIONS.md)
- Model performance notebooks: [MLPrediction.ipynb](https://github.com/DSCI-554/project-vizwiz_als/blob/master/MLPrediction.ipynb)
- Paper: [Overleaf read-only link](https://www.overleaf.com/project/6382bfbc87d785672405dec3) and [paper PDF](https://github.com/DSCI-554/project-vizwiz_als/blob/master/paper/VizWiz_ALS.pdf)
- Video: [YouTube link](https://youtu.be/x6UKjaNIbtQ)

## Contributions

### Demo
[Lukas Stein](mailto:lukasste@usc.edu):
- Implemented SVG clickable map that displays data about the selected region to compare seller and customer data between states to explore density of commerce by state.
- Implemented Leafleft slippy map using truesize library to create a draggable element for each Brazilian state, allowing area to overlay for comparison. Required data cleaning and manipulation from GeoJSON file.
- Converted HTML, CSS, and JS files to be used with Vue 2

[Vinjit Regulagedda](mailto:sregulag@usc.edu):
- Initiated a vue dashboard app with navigation, routing controlls and components (Nav bar and Projection area).
- Cleaned and prepared data for the exploratory data analysis.
- Visualized the number of payment types over the course of entire data.
- Visualized the types of payment installments over the course of entire data.
- Visualized the total payment income flow over the time.
- Managed the vue views, home , about pages.

[Amit Birajdar](mailto:abirajda@usc.edu):
- Cleaned, formatted and prepared orders data for exploratory analysis.
- Visualized order trends from end of 2016 to 2018.
- Visualized number of delivered orders based on Day of the Week and time of day.
- Explored the ratios between shipped, delivered and cancelled orders over time.
- Integrated these visualizations in a dashboard using vue.

[Tejas Sujit Bharambe](mailto:tbharamb@usc.edu):
- Initiated a plan with basic overview and visualizations that could be developed in our project over Figma and eventually divided up the work among team.
- Cleaned and formatted e-commerce around Brazil data for exploratory data analysis.
- Visualized number of orders per region.
- Visualized Price vs Number of Products vs Number of Cities across Regions in Brazil.
- Explored State Level Analysis for Difference in Estimated Delivery, Freight Value & Delivery Time.
- Integrated the visuals into dashboard using vue.

### Model performance analysis

[Navyada Koshatwar](mailto:koshatwa@usc.edu):
- Joined tables and extracted features to train model.
- Built multiple machine learning models to predict ratings for various categories of products depending on price.
- Created a visualization to make the output of the best model understandable and useable.

[Tejas Sujit Bharambe](mailto:tbharamb@usc.edu):

- Worked on the feature engineering of the model
- Helped in creating data set for the model

### Paper

[Lukas Stein](mailto:lukasste@usc.edu):

- Started the document for the paper and began outlining based on sample
- Contributed to the Introduction and Conculusion
- Contributed to sections that discuss the map and geoJSON data

[Vinjit Regulagedda](mailto:sregulag@usc.edu):

- Contributed to the Systems section
- Contributed to sections that discuss payment type analysis approach and data

[Navyada Koshatwar](mailto:koshatwa@usc.edu):

- Contributed to Data preprocessing section.
- Contributed to sections that discuss the ML model

[Tejas Sujit Bharambe](mailto:tbharamb@usc.edu):

- Contributed to the Introduction and Approach section
- Contributed to sections that discuss regional e-commerce analysis approach and data

[Amit Birajdar](mailto:abirajda@usc.edu):

- Contributed to the Related Works, Data and Conclusion sections of the paper.
- Contributed to sections that discuss the e-commerce analysis section

### Video

[Vinjit Regulagedda](mailto:sregulag@usc.edu):

- Recorded a video for the Home page, Payments analysis and About page.

[Navyada Koshatwar](mailto:koshatwa@usc.edu):

- Recorded a video for the machine learning model and demonstrating its use case.

[Tejas Sujit Bharambe](mailto:tbharamb@usc.edu):

- Recorded a video for the Regional analysis of orders.

[Amit Birajdar](mailto:abirajda@usc.edu):

- Recorded a video for the orders analysis.
- Edited, merged and uploaded the video to YouTube

[Lukas Stein](mailto:lukasste@usc.edu):

- Recorded a video for the geographical analysis.
