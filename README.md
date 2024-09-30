# 🌍 Discovering the Most Sustainable Nations in the 21st Century

## Overview
This project analyzes global sustainable energy trends to identify the most sustainable nations from 2000 to 2020 using D3.js. By using interactive visualizations, the project highlights the relationship between renewable energy adoption, energy consumption, and economic growth across different regions. Two comprehensive dashboards provide insights into country-specific trends and global sustainability metrics, making it a valuable tool for understanding the impact of sustainable energy on environmental and socio-economic factors. The project consists of two distinct but interconnected dashboards, with navigation through an arrow button on the top right corner of the dashboards. 

## Dataset Overview
The dataset used for this project is `sustainable_energy.csv` from Kaggle, which provides information on sustainable energy adoption and energy metrics across different countries from 2000 to 2020. The data has been meticulously cleaned and processed to ensure consistency and accuracy.
    

## Key Visualizations
**Dashboard 1: Global Sustainable Energy Overview**
1. **Bubble Chart:**
      - Displays renewable electricity generating capacity per capita vs. access to electricity.
      - Animated over time, showing trends in energy development.
2. **Comparative Bar Chart:**
      - Highlights the top 5 countries with the highest and lowest renewable energy shares.
3. **Line Chart:**
      - Shows the change in renewable electricity generating capacity per capita over the years.
4. **Vertical Bar Chart:**
      - Visualizes primary energy consumption per capita, revealing stability and minor fluctuations.
5. **Scatter Plot:**
      - Explores the correlation between GDP per capita and access to electricity, highlighting disparities in energy access and economic prosperity.

**Dashboard 2: Country-Specific Energy Profiles**
1. **Interactive Map:**
      - Allows users to select a country and view its energy statistics, such as renewable energy share, energy consumption, and electricity access.
2. **Stacked Area Chart:**
      - Shows the mix of energy sources (fossil fuels, nuclear, and renewables) for each country over time.
3. **Comparative Area Chart:**
      - Compares energy generation and consumption per capita for the selected country, providing insights into its energy balance.

## Key Findings
1. **Global Disparities:**
   - Europe and North America show higher renewable energy capacity per capita compared to Africa and other regions.
    
2. **Economic Correlation:**
   - There is a positive correlation between GDP per capita and access to electricity, indicating that wealthier nations tend to have better energy access.
    
3. **Increasing Investments:**
   - The upward trend in renewable electricity capacity per capita suggests increased global investments in renewable energy infrastructure.

4. **Variations in Renewable Energy Share:**
   - Some countries have significantly improved their renewable energy share, while others remain heavily reliant on non-renewable sources.
  
## Storytelling and Interpretation
The project highlights global disparities in energy access and renewable adoption, showing that developed nations with higher GDPs have better energy infrastructure and cleaner energy solutions, while underdeveloped regions struggle to transition from non-renewable sources. Despite this, the global rise in renewable capacity per capita reflects growing efforts to prioritize sustainability, emphasizing that economic growth and policy support are key to driving renewable energy adoption and achieving global energy equity.

## Setup Instructions
To execute the server, follow these steps in your terminal:
1) Install `http-server` (if you don’t have it already):
   - bash
     ```
     npm install -g http-server
     ```
 
2) Navigate to the project directory:
   - bash
     ```
     cd path\to\your\project-directory
     ```
   
3) Launch the server:
   - bash
     ```
     http-server
     ```
4) Open your browser and go to:
   - bash
     ```
     [http-server](http://localhost:8080)
     ```

## References
- Dataset: [Global Data on Sustainable Energy (2000-2020)](https://www.kaggle.com/datasets/anshtanwar/global-data-on-sustainable-energy)
