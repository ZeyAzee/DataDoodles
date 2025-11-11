# Number of armed conflicts - Data package

This data package contains the data that powers the chart ["Number of armed conflicts"](https://ourworldindata.org/grapher/number-of-armed-conflicts?v=1&csvType=full&useColumnShortNames=false&utm_source=chatgpt.com) on the Our World in Data website.

## CSV Structure

The high level structure of the CSV file is that each row is an observation for an entity (usually a country or region) and a timepoint (usually a year).

The first two columns in the CSV file are "Entity" and "Code". "Entity" is the name of the entity (e.g. "United States"). "Code" is the OWID internal entity code that we use if the entity is a country or region. For normal countries, this is the same as the [iso alpha-3](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3) code of the entity (e.g. "USA") - for non-standard countries like historical countries these are custom codes.

The third column is either "Year" or "Day". If the data is annual, this is "Year" and contains only the year as an integer. If the column is "Day", the column contains a date string in the form "YYYY-MM-DD".

The remaining columns are the data columns, each of which is a time series. If the CSV data is downloaded using the "full data" option, then each column corresponds to one time series below. If the CSV data is downloaded using the "only selected data visible in the chart" option then the data columns are transformed depending on the chart type and thus the association with the time series might not be as straightforward.

## Metadata.json structure

The .metadata.json file contains metadata about the data package. The "charts" key contains information to recreate the chart, like the title, subtitle etc.. The "columns" key contains information about each of the columns in the csv, like the unit, timespan covered, citation for the data etc..

## About the data

Our World in Data is almost never the original producer of the data - almost all of the data we use has been compiled by others. If you want to re-use data, it is your responsibility to ensure that you adhere to the sources' license and to credit them correctly. Please note that a single time series may have more than one source - e.g. when we stich together data from different time periods by different producers or when we calculate per capita metrics using population data from a second source.

### How we process data at Our World In Data
All data and visualizations on Our World in Data rely on data sourced from one or several original data providers. Preparing this original data involves several processing steps. Depending on the data, this can include standardizing country names and world region definitions, converting units, calculating derived indicators such as per capita measures, as well as adding or adapting metadata such as the name or the description given to an indicator.
[Read about our data pipeline](https://docs.owid.io/projects/etl/)

## Detailed information about each time series


## One-sided violence
Included is one-sided violence that was ongoing that year.
Last updated: June 13, 2025  
Date range: 1989–2024  
Unit: conflicts  


### How to cite this data

#### In-line citation
If you have limited space (e.g. in data visualizations), you can use this abbreviated in-line citation:  
Uppsala Conflict Data Program and Peace Research Institute Oslo (2025); geoBoundaries (2023) – processed by Our World in Data

#### Full citation
Uppsala Conflict Data Program and Peace Research Institute Oslo (2025); geoBoundaries (2023) – processed by Our World in Data. “One-sided violence” [dataset]. Uppsala Conflict Data Program and Peace Research Institute Oslo, “Armed Conflict version 25.1”; Uppsala Conflict Data Program, “Georeferenced Event Dataset v25.1”; geoBoundaries, “geoBoundaries - Comprehensive Global Administrative Zones (CGAZ) 6.0.0” [original data].
Source: Uppsala Conflict Data Program and Peace Research Institute Oslo (2025); geoBoundaries (2023) – processed by Our World In Data

### What you should know about this data
* One-sided violence is defined by the [Uppsala Conflict Data Program (UCDP)](https://ucdp.uu.se/) as the use of armed force by a state or non-state armed group against civilians that causes at least 25 civilian deaths during a year.
* UCDP identifies conflict deaths based on news reports, other contemporary sources, and academic research.

### Sources

#### Uppsala Conflict Data Program and Peace Research Institute Oslo – Armed Conflict
Retrieved on: 2025-06-13  
Retrieved from: https://ucdp.uu.se/downloads/index.html#armedconflict  

#### Uppsala Conflict Data Program – Georeferenced Event Dataset
Retrieved on: 2025-06-13  
Retrieved from: https://ucdp.uu.se/downloads/index.html#ged_global  

#### geoBoundaries – geoBoundaries - Comprehensive Global Administrative Zones (CGAZ)
Retrieved on: 2025-06-26  
Retrieved from: https://www.geoboundaries.org/globalDownloads.html  


## Extrasystemic
Included are extrasystemic conflicts that were ongoing a year.
Last updated: June 13, 2025  
Date range: 1946–2024  
Unit: conflicts  


### How to cite this data

#### In-line citation
If you have limited space (e.g. in data visualizations), you can use this abbreviated in-line citation:  
Uppsala Conflict Data Program and Peace Research Institute Oslo (2025); geoBoundaries (2023) – processed by Our World in Data

#### Full citation
Uppsala Conflict Data Program and Peace Research Institute Oslo (2025); geoBoundaries (2023) – processed by Our World in Data. “Extrasystemic” [dataset]. Uppsala Conflict Data Program and Peace Research Institute Oslo, “Armed Conflict version 25.1”; Uppsala Conflict Data Program, “Georeferenced Event Dataset v25.1”; geoBoundaries, “geoBoundaries - Comprehensive Global Administrative Zones (CGAZ) 6.0.0” [original data].
Source: Uppsala Conflict Data Program and Peace Research Institute Oslo (2025); geoBoundaries (2023) – processed by Our World In Data

### What you should know about this data
* A colonial conflict is defined by the [Uppsala Conflict Data Program (UCDP)](https://ucdp.uu.se/) as a conflict between a state and a non-state armed group that causes at least 25 deaths during a year, and takes place outside of the state's territory. This includes combatant and civilian deaths due to fighting.
* UCDP identifies conflict deaths based on news reports, other contemporary sources, and academic research.

### Sources

#### Uppsala Conflict Data Program and Peace Research Institute Oslo – Armed Conflict
Retrieved on: 2025-06-13  
Retrieved from: https://ucdp.uu.se/downloads/index.html#armedconflict  

#### Uppsala Conflict Data Program – Georeferenced Event Dataset
Retrieved on: 2025-06-13  
Retrieved from: https://ucdp.uu.se/downloads/index.html#ged_global  

#### geoBoundaries – geoBoundaries - Comprehensive Global Administrative Zones (CGAZ)
Retrieved on: 2025-06-26  
Retrieved from: https://www.geoboundaries.org/globalDownloads.html  


## Non-state
Included are non-state conflicts that were ongoing that year.
Last updated: June 13, 2025  
Date range: 1989–2024  
Unit: conflicts  


### How to cite this data

#### In-line citation
If you have limited space (e.g. in data visualizations), you can use this abbreviated in-line citation:  
Uppsala Conflict Data Program and Peace Research Institute Oslo (2025); geoBoundaries (2023) – processed by Our World in Data

#### Full citation
Uppsala Conflict Data Program and Peace Research Institute Oslo (2025); geoBoundaries (2023) – processed by Our World in Data. “Non-state” [dataset]. Uppsala Conflict Data Program and Peace Research Institute Oslo, “Armed Conflict version 25.1”; Uppsala Conflict Data Program, “Georeferenced Event Dataset v25.1”; geoBoundaries, “geoBoundaries - Comprehensive Global Administrative Zones (CGAZ) 6.0.0” [original data].
Source: Uppsala Conflict Data Program and Peace Research Institute Oslo (2025); geoBoundaries (2023) – processed by Our World In Data

### What you should know about this data
* A non-state conflict is defined by the [Uppsala Conflict Data Program (UCDP)](https://ucdp.uu.se/) as a conflict between non-state armed groups, such as rebel groups, criminal organizations, or ethnic groups, that causes at least 25 deaths during a year. This includes combatant and civilian deaths due to fighting.
* UCDP identifies conflict deaths based on news reports, other contemporary sources, and academic research.

### Sources

#### Uppsala Conflict Data Program and Peace Research Institute Oslo – Armed Conflict
Retrieved on: 2025-06-13  
Retrieved from: https://ucdp.uu.se/downloads/index.html#armedconflict  

#### Uppsala Conflict Data Program – Georeferenced Event Dataset
Retrieved on: 2025-06-13  
Retrieved from: https://ucdp.uu.se/downloads/index.html#ged_global  

#### geoBoundaries – geoBoundaries - Comprehensive Global Administrative Zones (CGAZ)
Retrieved on: 2025-06-26  
Retrieved from: https://www.geoboundaries.org/globalDownloads.html  


## Intrastate
Included are intrastate conflicts that were ongoing a year.
Last updated: June 13, 2025  
Date range: 1946–2024  
Unit: conflicts  


### How to cite this data

#### In-line citation
If you have limited space (e.g. in data visualizations), you can use this abbreviated in-line citation:  
Uppsala Conflict Data Program and Peace Research Institute Oslo (2025); geoBoundaries (2023) – processed by Our World in Data

#### Full citation
Uppsala Conflict Data Program and Peace Research Institute Oslo (2025); geoBoundaries (2023) – processed by Our World in Data. “Intrastate” [dataset]. Uppsala Conflict Data Program and Peace Research Institute Oslo, “Armed Conflict version 25.1”; Uppsala Conflict Data Program, “Georeferenced Event Dataset v25.1”; geoBoundaries, “geoBoundaries - Comprehensive Global Administrative Zones (CGAZ) 6.0.0” [original data].
Source: Uppsala Conflict Data Program and Peace Research Institute Oslo (2025); geoBoundaries (2023) – processed by Our World In Data

### What you should know about this data
* A civil conflict is defined by the [Uppsala Conflict Data Program (UCDP)](https://ucdp.uu.se/) as a conflict between a state and a non-state armed group that causes at least 25 deaths during a year. A non-state armed group can be a rebel group, criminal organization, or ethnic group. Foreign states can still be involved in a supporting role. This includes combatant and civilian deaths due to fighting.
* UCDP identifies conflict deaths based on news reports, other contemporary sources, and academic research.

### Sources

#### Uppsala Conflict Data Program and Peace Research Institute Oslo – Armed Conflict
Retrieved on: 2025-06-13  
Retrieved from: https://ucdp.uu.se/downloads/index.html#armedconflict  

#### Uppsala Conflict Data Program – Georeferenced Event Dataset
Retrieved on: 2025-06-13  
Retrieved from: https://ucdp.uu.se/downloads/index.html#ged_global  

#### geoBoundaries – geoBoundaries - Comprehensive Global Administrative Zones (CGAZ)
Retrieved on: 2025-06-26  
Retrieved from: https://www.geoboundaries.org/globalDownloads.html  


## Interstate
Included are interstate conflicts that were ongoing a year.
Last updated: June 13, 2025  
Date range: 1946–2024  
Unit: conflicts  


### How to cite this data

#### In-line citation
If you have limited space (e.g. in data visualizations), you can use this abbreviated in-line citation:  
Uppsala Conflict Data Program and Peace Research Institute Oslo (2025); geoBoundaries (2023) – processed by Our World in Data

#### Full citation
Uppsala Conflict Data Program and Peace Research Institute Oslo (2025); geoBoundaries (2023) – processed by Our World in Data. “Interstate” [dataset]. Uppsala Conflict Data Program and Peace Research Institute Oslo, “Armed Conflict version 25.1”; Uppsala Conflict Data Program, “Georeferenced Event Dataset v25.1”; geoBoundaries, “geoBoundaries - Comprehensive Global Administrative Zones (CGAZ) 6.0.0” [original data].
Source: Uppsala Conflict Data Program and Peace Research Institute Oslo (2025); geoBoundaries (2023) – processed by Our World In Data

### What you should know about this data
* An interstate conflict is defined by the [Uppsala Conflict Data Program (UCDP)](https://ucdp.uu.se/) as a conflict between states that causes at least 25 deaths during a year. This includes combatant and civilian deaths due to fighting.
* UCDP identifies conflict deaths based on news reports, other contemporary sources, and academic research.

### Sources

#### Uppsala Conflict Data Program and Peace Research Institute Oslo – Armed Conflict
Retrieved on: 2025-06-13  
Retrieved from: https://ucdp.uu.se/downloads/index.html#armedconflict  

#### Uppsala Conflict Data Program – Georeferenced Event Dataset
Retrieved on: 2025-06-13  
Retrieved from: https://ucdp.uu.se/downloads/index.html#ged_global  

#### geoBoundaries – geoBoundaries - Comprehensive Global Administrative Zones (CGAZ)
Retrieved on: 2025-06-26  
Retrieved from: https://www.geoboundaries.org/globalDownloads.html  


    