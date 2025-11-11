# Share of primary-school-age children who are out of school - Data package

This data package contains the data that powers the chart ["Share of primary-school-age children who are out of school"](https://ourworldindata.org/grapher/share-primary-school-age-out-of-school?v=1&csvType=full&useColumnShortNames=false&utm_source=chatgpt.com) on the Our World in Data website. It was downloaded on November 10, 2025.

### Active Filters

A filtered subset of the full data was downloaded. The following filters were applied:

## CSV Structure

The high level structure of the CSV file is that each row is an observation for an entity (usually a country or region) and a timepoint (usually a year).

The first two columns in the CSV file are "Entity" and "Code". "Entity" is the name of the entity (e.g. "United States"). "Code" is the OWID internal entity code that we use if the entity is a country or region. For normal countries, this is the same as the [iso alpha-3](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3) code of the entity (e.g. "USA") - for non-standard countries like historical countries these are custom codes.

The third column is either "Year" or "Day". If the data is annual, this is "Year" and contains only the year as an integer. If the column is "Day", the column contains a date string in the form "YYYY-MM-DD".

The final column is the data column, which is the time series that powers the chart. If the CSV data is downloaded using the "full data" option, then the column corresponds to the time series below. If the CSV data is downloaded using the "only selected data visible in the chart" option then the data column is transformed depending on the chart type and thus the association with the time series might not be as straightforward.

## Metadata.json structure

The .metadata.json file contains metadata about the data package. The "charts" key contains information to recreate the chart, like the title, subtitle etc.. The "columns" key contains information about each of the columns in the csv, like the unit, timespan covered, citation for the data etc..

## About the data

Our World in Data is almost never the original producer of the data - almost all of the data we use has been compiled by others. If you want to re-use data, it is your responsibility to ensure that you adhere to the sources' license and to credit them correctly. Please note that a single time series may have more than one source - e.g. when we stich together data from different time periods by different producers or when we calculate per capita metrics using population data from a second source.

## Detailed information about the data


## Out-of-school rate for children of primary school age
Percentage of children in the official primary school age group who are not enrolled in any level of education.
Last updated: May 1, 2025  
Next update: May 2026  
Date range: 1970–2024  
Unit: %  


### How to cite this data

#### In-line citation
If you have limited space (e.g. in data visualizations), you can use this abbreviated in-line citation:  
UNESCO Institute for Statistics (2025) – with minor processing by Our World in Data

#### Full citation
UNESCO Institute for Statistics (2025) – with minor processing by Our World in Data. “Out-of-school rate for children of primary school age” [dataset]. UNESCO Institute for Statistics, “UNESCO Institute for Statistics (UIS) - Education” [original data].
Source: UNESCO Institute for Statistics (2025) – with minor processing by Our World In Data

### What you should know about this data
* Many children and adolescents around the world are not in school, even though they are old enough to be. This indicator shows how many are missing out on education at each stage of the system.
* It measures the share of individuals in the official age range for a given level of education who are not enrolled at that level of education.
* These children or adolescents may have never entered school, may have dropped out, or may be starting later than expected.
* A share of 10% for children out of primary school means that 90% of all 6- to 11-year-olds are enrolled in primary education.
* High out-of-school rates signal barriers to access — such as poverty, gender inequality, location, or limited availability of schools — and highlight where more targeted support is needed.
* The data comes from administrative school enrolment records and household surveys, which provide age-specific insights when compared to population estimates.
* As with all education data, results should be interpreted carefully. Differences in how enrolment is defined, inconsistencies in age reporting, and timing of data collection (such as during holidays or late in the school year) can affect accuracy.

### How is this data described by its producer - UNESCO Institute for Statistics (2025)?
The number of students of the official age for primary education is subtracted from the total population of the same age. The result is expressed as a percentage of the population of the official age for primary education. For more information, consult the UNESCO Institute of Statistics website: http://www.uis.unesco.org/Education/

### Source

#### UNESCO Institute for Statistics – UNESCO Institute for Statistics (UIS) - Education
Retrieved on: 2025-05-01  
Retrieved from: https://databrowser.uis.unesco.org/resources/bulk  


    