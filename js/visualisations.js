// js/visualisations.js

document.addEventListener("DOMContentLoaded", () => {
  const COLORS = {
    // colors for status
    conflict: "#e41a1c", // red
    stable: "#377eb8", // blue

    heatmap: d3.interpolateYlOrRd,

    // color for "empty" cells
    waffleBg: "#444444",

    // Цвет текста (из вашего CSS)
    text: "#c4c0c0",
  };

  // choose allvisualisations card
  const vizCards = document.querySelectorAll(".viz-card");

  vizCards.forEach((card) => {
    const canvas = card.querySelector(".viz-canvas");
    const footer = card.querySelector(".viz-footer");

    //skip "Coming Soon"
    if (!canvas || !footer || canvas.textContent.includes("Coming Soon")) {
      return;
    }

    const chartType = card.dataset.chart;
    canvas.innerHTML = ""; // clean 'chart'

    // call appropriate drawing function
    try {
      switch (chartType) {
        case "Barchart":
          drawBarchart(
            canvas,
            "Data/ChildreEducationConflict/ChartData/bar_out_of_school.csv",
            COLORS
          );
          break;
        case "Grouped Barchart":
          drawGroupedBarchart(
            canvas,
            "Data/ChildreEducationConflict/ChartData/grouped_country_year.csv",
            COLORS
          );
          break;
        case "Heatmap":
          drawHeatmap(
            canvas,
            "Data/ChildreEducationConflict/ChartData/heatmap_out_of_school.csv",
            COLORS
          );
          break;
        case "100% Stacked Barchart":
          drawStackedBarchart(
            canvas,
            "Data/ChildreEducationConflict/ChartData/stacked100_conflict_share.csv",
            COLORS
          );
          break;
        case "Waffle Chart":
          drawWaffleChart(
            canvas,
            "Data/ChildreEducationConflict/ChartData/waffle_global_avg.csv",
            COLORS
          );
          break;
        case "Histogram":
          drawHistogram(
            canvas,
            "Data/ChildreEducationConflict/DistributionData/histogram.csv",
            COLORS
          );
          break;
        case "Violin Plot":
          drawViolinPlot(
            canvas,
            "Data/ChildreEducationConflict/DistributionData/violin_box_raw.csv",
            COLORS
          );
          break;
        case "Boxplot":
          drawBoxplot(
            canvas,
            "Data/ChildreEducationConflict/DistributionData/box_summary.csv",
            COLORS
          );
          break;
        case "Ridgeline Plot":
          drawRidgelinePlot(
            canvas,
            "Data/ChildreEducationConflict/TimeLine/histogram_country_time.csv",
            COLORS
          );
          break;
        case "Streamgraph":
          drawStreamgraph(
            canvas,
            "Data/ChildreEducationConflict/TimeLine/violin_box_raw.csv",
            COLORS
          );
          break;
        case "Horizon Multiples":
          drawHorizonMultiples(
            canvas,
            "Data/ChildreEducationConflict/TimeLine/violin_box_raw.csv",
            COLORS
          );
          break;
        case "Bump Chart":
          drawBumpChart(
            canvas,
            "Data/ChildreEducationConflict/TimeLine/box_summary_country_time.csv",
            COLORS
          );
          break;
        case "Change Map":
          drawChoroplethMapChange(
            canvas,
            "Data/ChildreEducationConflict/MapData/change_map.csv",
            "Data/ChildreEducationConflict/MapData/custom.geo.json",
            COLORS
          );
          break;
        case "Choropleth Map":
          drawChoroplethMapAvg(
            canvas,
            "Data/ChildreEducationConflict/MapData/choropleth.csv",
            "Data/ChildreEducationConflict/MapData/custom.geo.json",
            COLORS
          );
          break;
        case "Proportional Symbol Map":
          drawProportionalSymbolMap(
            canvas,
            "Data/ChildreEducationConflict/MapData/proportional_symbols.csv",
            "Data/ChildreEducationConflict/MapData/custom.geo.json",
            COLORS
          );
          break;
      }
    } catch (error) {
      console.error("Error drawing chart:", chartType, error);
      canvas.innerHTML = "Error loading chart.";
      canvas.style.color = "red";
    }
  });
});

/**
 * ========================================================================
 * 1. Barchart: average out-of-school % by country
 * Файл: bar_out_of_school.csv
 * ========================================================================
 */
async function drawBarchart(container, dataUrl, COLORS) {
  const data = await d3.csv(dataUrl, d3.autoType);

  // sorting data by out_of_school_pct descending
  data.sort((a, b) => d3.descending(a.out_of_school_pct, b.out_of_school_pct));

  const margin = { top: 30, right: 30, bottom: 120, left: 70 };
  const totalWidth = 500;
  const totalHeight = 400;
  const width = totalWidth - margin.left - margin.right;
  const height = totalHeight - margin.top - margin.bottom;

  const svg = d3
    .select(container)
    .append("svg")
    .attr("viewBox", `0 0 ${totalWidth} ${totalHeight}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3
    .scaleBand()
    .domain(data.map((d) => d.country))
    .range([0, width])
    .padding(0.1);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.out_of_school_pct)])
    .nice()
    .range([height, 0]);

  // axis X (Countries)
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end")
    .style("fill", COLORS.text);

  // axis Y (Percentages)
  svg
    .append("g")
    .call(
      d3
        .axisLeft(y)
        .ticks(5)
        .tickFormat((d) => `${d.toFixed(0)}%`)
    )
    .call((g) => g.selectAll(".domain, .tick line").style("stroke", "#555"))
    .call((g) => g.selectAll("text").style("fill", COLORS.text));

  // text Y axis
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 15)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("fill", COLORS.text)
    .style("font-size", "12px")
    .text("Avg. Out-of-School %");

  // create bars
  svg
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => x(d.country))
    .attr("y", (d) => y(d.out_of_school_pct))
    .attr("width", x.bandwidth())
    .attr("height", (d) => height - y(d.out_of_school_pct))
    // color by conflict status
    .attr("fill", (d) =>
      d.conflict_status === "Conflict" ? COLORS.conflict : COLORS.stable
    )
    .append("title")
    .text(
      (d) =>
        `${d.country} (${d.conflict_status}): ${d.out_of_school_pct.toFixed(
          1
        )}%`
    );
}

/**
 * ========================================================================
 * 2. Grouped Barchart: average by status (Conflict vs Stable)
 * file: grouped_country_year.csv
 * ========================================================================
 */
async function drawGroupedBarchart(container, dataUrl, COLORS) {
  const data = await d3.csv(dataUrl, d3.autoType);

  // aggregate average out_of_school_pct by country and conflict_status
  const statusAvgs = d3.rollup(
    data,
    (v) => d3.mean(v, (d) => d.out_of_school_pct),
    (d) => d.country,
    (d) => d.conflict_status
  );

  // transform to array of objects for easier plotting
  const groupedData = Array.from(statusAvgs.entries()).map(
    ([country, values]) => {
      return {
        country: country,
        Conflict: values.get("Conflict") || 0, // 0, if no 'Conflict' years
        Stable: values.get("Stable") || 0, // 0, if no 'Stable' years
      };
    }
  );

  //sort by total avg descending
  groupedData.sort((a, b) =>
    d3.descending(a.Conflict + a.Stable, b.Conflict + b.Stable)
  );

  const keys = ["Conflict", "Stable"];

  const margin = { top: 50, right: 30, bottom: 90, left: 70 };
  const totalWidth = 500;
  const totalHeight = 400;
  const width = totalWidth - margin.left - margin.right;
  const height = totalHeight - margin.top - margin.bottom;

  const svg = d3
    .select(container)
    .append("svg")
    .attr("viewBox", `0 0 ${totalWidth} ${totalHeight}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // scale X0 (for countries)
  const x0 = d3
    .scaleBand()
    .domain(groupedData.map((d) => d.country))
    .rangeRound([0, width])
    .paddingInner(0.1);

  // scale X1 (for 'Conflict' and 'Stable' within country)
  const x1 = d3
    .scaleBand()
    .domain(keys)
    .rangeRound([0, x0.bandwidth()])
    .padding(0.05);

  // scale Y
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(groupedData, (d) => Math.max(d.Conflict, d.Stable))])
    .nice()
    .rangeRound([height, 0]);

  // color scale
  const color = d3
    .scaleOrdinal()
    .domain(keys)
    .range([COLORS.conflict, COLORS.stable]);

  // axis X
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x0))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end")
    .style("fill", COLORS.text);

  // axis Y
  svg
    .append("g")
    .call(
      d3
        .axisLeft(y)
        .ticks(5)
        .tickFormat((d) => `${d.toFixed(0)}%`)
    )
    .call((g) => g.selectAll(".domain, .tick line").style("stroke", "#555"))
    .call((g) => g.selectAll("text").style("fill", COLORS.text));

  // text Y axis
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 15)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("fill", COLORS.text)
    .style("font-size", "12px")
    .text("Avg. Out-of-School %");

  // groups of bars
  const groups = svg
    .selectAll(".group")
    .data(groupedData)
    .enter()
    .append("g")
    .attr("class", "group")
    .attr("transform", (d) => `translate(${x0(d.country)},0)`);

  // bars in groups
  groups
    .selectAll("rect")
    .data((d) =>
      keys.map((key) => ({ key, value: d[key], country: d.country }))
    )
    .enter()
    .append("rect")
    .attr("x", (d) => x1(d.key))
    .attr("y", (d) => y(d.value))
    .attr("width", x1.bandwidth())
    .attr("height", (d) => height - y(d.value))
    .attr("fill", (d) => color(d.key))
    .append("title")
    .text((d) => `${d.country} (${d.key}): ${d.value.toFixed(1)}%`);

  const legend = svg
    .append("g")
    .attr("transform", `translate(${width - 100}, -35)`);

  keys.forEach((key, i) => {
    const legendRow = legend
      .append("g")
      .attr("transform", `translate(0, ${i * 20})`);

    legendRow
      .append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", color(key));

    legendRow
      .append("text")
      .attr("x", 20)
      .attr("y", 7.5)
      .attr("dominant-baseline", "middle")
      .text(key)
      .style("font-size", "12px")
      .style("fill", COLORS.text);
  });
}

/**
 * ========================================================================
 * 3. Heatmap: country x year
 * file: heatmap_out_of_school.csv
 * ========================================================================
 */
async function drawHeatmap(container, dataUrl, COLORS) {
  const data = await d3.csv(dataUrl, d3.autoType);

  // transform data to long format
  // pick all years from columns (excluding 'country')
  const allYears = data.columns.slice(1);

  // filter years to only those with at least one value > 0
  const relevantYears = allYears.filter((year) => {
    // check if any country has a value > 0 for this year
    return data.some((d) => d[year] > 0);
  });

  const longData = data.flatMap((d) =>
    relevantYears.map((year) => ({
      country: d.country,
      year: year,
      value: d[year],
    }))
  );

  const countries = [...new Set(longData.map((d) => d.country))].sort(
    d3.ascending
  );

  // setup SVG and scales
  const margin = { top: 40, right: 20, bottom: 80, left: 90 };
  const totalWidth = 550;
  const totalHeight = 450;
  const width = totalWidth - margin.left - margin.right;
  const height = totalHeight - margin.top - margin.bottom;

  const svg = d3
    .select(container)
    .append("svg")
    .attr("viewBox", `0 0 ${totalWidth} ${totalHeight}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // scale X (Years)
  const x = d3
    .scaleBand()
    .domain(relevantYears)
    .range([0, width])
    .padding(0.05);

  // scale Y (Countries)
  const y = d3.scaleBand().domain(countries).range([height, 0]).padding(0.1);

  // axis X
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    // show every 3rd year label to avoid clutter
    .call(d3.axisBottom(x).tickValues(x.domain().filter((d, i) => !(i % 3))))
    .selectAll("text")
    .style("fill", COLORS.text);

  // axis Y
  svg
    .append("g")
    .call(d3.axisLeft(y))
    .call((g) => g.selectAll(".domain, .tick line").style("stroke", "#555"))
    .call((g) => g.selectAll("text").style("fill", COLORS.text));

  // color scale
  const maxGap = d3.max(longData, (d) => d.value);
  const color = d3
    .scaleSequential(COLORS.heatmap)
    // start domain slightly below 0 to ensure very small values are visible
    .domain([-0.01, maxGap]);

  // draw cells
  svg
    .selectAll()
    .data(longData, (d) => `${d.country}:${d.year}`)
    .enter()
    .append("rect")
    .attr("x", (d) => x(d.year))
    .attr("y", (d) => y(d.country))
    .attr("width", x.bandwidth())
    .attr("height", y.bandwidth())
    .style("fill", (d) => color(d.value))
    .append("title")
    .text((d) => `${d.country} (${d.year}): ${d.value.toFixed(1)}%`);
}

/**
 * ========================================================================
 * 4. 100% Stacked Barchart: conflict vs stable share over years
 * file: stacked100_conflict_share.csv
 * ========================================================================
 */
async function drawStackedBarchart(container, dataUrl, COLORS) {
  let data = await d3.csv(dataUrl, d3.autoType);

  const keys = ["conflict_share", "stable_share"];
  const stackedData = d3.stack().keys(keys)(data);
  // d[0] - lower bound, d[1] - upper bound
  // d.data - source object (with ‘year’))

  const margin = { top: 60, right: 30, bottom: 90, left: 70 };
  const totalWidth = 500;
  const totalHeight = 400;
  const width = totalWidth - margin.left - margin.right;
  const height = totalHeight - margin.top - margin.bottom;

  const svg = d3
    .select(container)
    .append("svg")
    .attr("viewBox", `0 0 ${totalWidth} ${totalHeight}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3
    .scaleBand()
    .domain(data.map((d) => d.year))
    .range([0, width])
    .padding(0.1);

  const y = d3.scaleLinear().domain([0, 100]).range([height, 0]);

  const color = d3
    .scaleOrdinal()
    .domain(keys)
    .range([COLORS.conflict, COLORS.stable]);

  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end")
    .style("fill", COLORS.text);

  svg
    .append("g")
    .call(
      d3
        .axisLeft(y)
        .ticks(5)
        .tickFormat((d) => `${d}%`)
    )
    .call((g) => g.selectAll(".domain, .tick line").style("stroke", "#555"))
    .call((g) => g.selectAll("text").style("fill", COLORS.text));

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 15)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("fill", COLORS.text)
    .style("font-size", "12px")
    .text("Share of Contexts");

  // layers
  svg
    .append("g")
    .selectAll("g")
    .data(stackedData)
    .enter()
    .append("g")
    .attr("fill", (d) => color(d.key))
    .selectAll("rect")
    .data((d) => d) // d - is [y0, y1] + data
    .enter()
    .append("rect")
    .attr("x", (d) => x(d.data.year))
    .attr("y", (d) => y(d[1]))
    .attr("height", (d) => y(d[0]) - y(d[1]))
    .attr("width", x.bandwidth())
    .append("title")
    .text((d) => {
      const key = d[1] === d.data.stable_share ? "Stable" : "Conflict";
      const pct = (d[1] - d[0]).toFixed(1);
      return `${d.data.year} (${key}): ${pct}%`;
    });

  const legend = svg
    .append("g")
    .attr("transform", `translate(${width - 100}, -45)`);

  keys.forEach((key, i) => {
    const legendRow = legend
      .append("g")
      .attr("transform", `translate(0, ${i * 20})`);
    legendRow
      .append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", color(key));

    legendRow
      .append("text")
      .attr("x", 20)
      .attr("y", 7.5)
      .attr("dominant-baseline", "middle")
      .text(key === "conflict_share" ? "Conflict" : "Stable")
      .style("font-size", "12px")
      .style("fill", COLORS.text);
  });
}

/**
 * ========================================================================
 * 5. Waffle Chart: global Average Comparison
 * Файл: waffle_global_avg.csv
 * ========================================================================
 */
async function drawWaffleChart(container, dataUrl, COLORS) {
  const data = await d3.csv(dataUrl, d3.autoType);
  // data = [ {conflict_status: 'Conflict', ...}, {conflict_status: 'Stable', ...} ]

  const margin = { top: 40, right: 20, bottom: 20, left: 20 };
  const totalWidth = 500;
  const totalHeight = 400;
  const width = totalWidth - margin.left - margin.right;
  const height = totalHeight - margin.top - margin.bottom;

  const svg = d3
    .select(container)
    .append("svg")
    .attr("viewBox", `0 0 ${totalWidth} ${totalHeight}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // setting up waffle parameters
  const waffleSize = 10;
  const totalSquares = waffleSize * waffleSize;
  const squareSize = 12;
  const squareGap = 3;
  const waffleWidth = (squareSize + squareGap) * waffleSize - squareGap;
  const waffleHeight = waffleWidth;

  //spacing between two waffles
  const waffleSpacing = 40;

  // Total width of two wafers
  const totalWafflesWidth = waffleWidth * 2 + waffleSpacing;

  // Center the group of waffles
  const startX = (width - totalWafflesWidth) / 2;
  const startY = (height - waffleHeight) / 2;

  const waffleGroups = svg
    .selectAll(".waffle-group")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "waffle-group")
    .attr("transform", (d, i) => {
      const x = startX + i * (waffleWidth + waffleSpacing);
      return `translate(${x}, ${startY})`;
    });

  waffleGroups.each(function (d) {
    const group = d3.select(this);
    const numFilled = Math.round(d.avg_out_of_school_pct); // 11.9 -> 12, 6.49 -> 6

    // Creating data for 100 squares
    const waffleData = d3.range(totalSquares).map((i) => {
      return {
        isFilled: i < numFilled,
      };
    });

    const isConflict = d.conflict_status === "Conflict";
    const fillColor = isConflict ? COLORS.conflict : COLORS.stable;

    // name (Conflict / Stable)
    group
      .append("text")
      .attr("x", waffleWidth / 2)
      .attr("y", -20)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "600")
      .style("fill", COLORS.text)
      .text(d.conflict_status);

    // %
    group
      .append("text")
      .attr("x", waffleWidth / 2)
      .attr("y", -5)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", fillColor)
      .text(`${d.avg_out_of_school_pct.toFixed(1)}%`);

    group
      .selectAll(".square")
      .data(waffleData)
      .enter()
      .append("rect")
      .attr("class", "square")
      .attr("x", (d, i) => (i % waffleSize) * (squareSize + squareGap))
      .attr(
        "y",
        (d, i) => Math.floor(i / waffleSize) * (squareSize + squareGap)
      )
      .attr("width", squareSize)
      .attr("height", squareSize)
      .attr("rx", 2)
      .attr("ry", 2)
      .attr("fill", (d) => (d.isFilled ? fillColor : COLORS.waffleBg))
      .append("title")
      .text(isConflict ? "Conflict: 1 child" : "Stable: 1 child");
  });
}

/**
 * ========================================================================
 * 6. Histogram: Comparison of distributions
 * file: histogram.csv
 * ========================================================================
 */
async function drawHistogram(container, dataUrl, COLORS) {
  const data = await d3.csv(dataUrl, d3.autoType);

  // The data is already grouped; it needs to be converted
  const dataByBin = d3.group(data, (d) => d.bin_mid);

  const groupedData = Array.from(dataByBin.entries())
    .map(([bin, values]) => {
      // Creating a readable binary label
      const binStart = values[0].bin_start;
      const binEnd = values[0].bin_end;
      const binLabel = `${binStart.toFixed(0)}–${binEnd.toFixed(0)}%`;

      return {
        bin: binLabel,
        bin_start: binStart, // for sorting
        Conflict:
          values.find((d) => d.conflict_status === "Conflict")?.count || 0,
        Stable: values.find((d) => d.conflict_status === "Stable")?.count || 0,
      };
    })
    // Sort by the beginning of the bin, not alphabetically
    .sort((a, b) => a.bin_start - b.bin_start);

  // filter out bins where both values are 0, for clarity
  const filteredData = groupedData.filter(
    (d) => d.Conflict > 0 || d.Stable > 0
  );

  const keys = ["Conflict", "Stable"];

  const margin = { top: 50, right: 30, bottom: 90, left: 70 };
  const totalWidth = 500;
  const totalHeight = 400;
  const width = totalWidth - margin.left - margin.right;
  const height = totalHeight - margin.top - margin.bottom;

  const svg = d3
    .select(container)
    .append("svg")
    .attr("viewBox", `0 0 ${totalWidth} ${totalHeight}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // X0 scale (for bins)
  const x0 = d3
    .scaleBand()
    .domain(filteredData.map((d) => d.bin))
    .rangeRound([0, width])
    .paddingInner(0.1);

  // Scale X1 (for ‘Conflict’ and ‘Stable’ inside the bin)
  const x1 = d3
    .scaleBand()
    .domain(keys)
    .rangeRound([0, x0.bandwidth()])
    .padding(0.05);

  const y = d3
    .scaleLinear()
    // use a logarithmic scale because ‘Stable’ has very high peaks
    .domain([0.1, d3.max(filteredData, (d) => Math.max(d.Conflict, d.Stable))])
    .nice()
    .rangeRound([height, 0]);

  const color = d3
    .scaleOrdinal()
    .domain(keys)
    .range([COLORS.conflict, COLORS.stable]);

  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x0))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end")
    .style("fill", COLORS.text);

  svg
    .append("g")
    .call(
      d3.axisLeft(y).ticks(5, ".1s") // format for log scale
    )
    .call((g) => g.selectAll(".domain, .tick line").style("stroke", "#555"))
    .call((g) => g.selectAll("text").style("fill", COLORS.text));

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 15)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("fill", COLORS.text)
    .style("font-size", "12px")
    .text("Frequency (Log Scale)");

  const groups = svg
    .selectAll(".group")
    .data(filteredData)
    .enter()
    .append("g")
    .attr("class", "group")
    .attr("transform", (d) => `translate(${x0(d.bin)},0)`);

  groups
    .selectAll("rect")
    .data((d) => keys.map((key) => ({ key, value: d[key], bin: d.bin })))
    .enter()
    .append("rect")
    .attr("x", (d) => x1(d.key))
    // use y(Math.max(0.1, d.value)) for the log scale so that 0 does not break the graph
    .attr("y", (d) => y(Math.max(0.1, d.value)))
    .attr("width", x1.bandwidth())
    .attr("height", (d) => height - y(Math.max(0.1, d.value)))
    .attr("fill", (d) => color(d.key))
    .style("opacity", 0.8) // Add transparency for overlay
    .append("title")
    .text((d) => `Bin ${d.bin} (${d.key}): ${d.value.toFixed(0)}`);

  const legend = svg
    .append("g")
    .attr("transform", `translate(${width - 100}, -35)`);

  keys.forEach((key, i) => {
    const legendRow = legend
      .append("g")
      .attr("transform", `translate(0, ${i * 20})`);
    legendRow
      .append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", color(key));
    legendRow
      .append("text")
      .attr("x", 20)
      .attr("y", 7.5)
      .attr("dominant-baseline", "middle")
      .text(key)
      .style("font-size", "12px")
      .style("fill", COLORS.text);
  });
}

/**
 * ========================================================================
 * 7. Violin Plot: for distribution comparison
 * file: violin_box_raw.csv
 * ========================================================================
 */
async function drawViolinPlot(container, dataUrl, COLORS) {
  const data = await d3.csv(dataUrl, d3.autoType);

  const margin = { top: 30, right: 30, bottom: 50, left: 50 };
  const totalWidth = 500;
  const totalHeight = 400;
  const width = totalWidth - margin.left - margin.right;
  const height = totalHeight - margin.top - margin.bottom;

  const svg = d3
    .select(container)
    .append("svg")
    .attr("viewBox", `0 0 ${totalWidth} ${totalHeight}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  //  Y scale (Numerical)
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.out_of_school_pct)])
    .nice()
    .range([height, 0]);

  svg
    .append("g")
    .call(
      d3
        .axisLeft(y)
        .ticks(5)
        .tickFormat((d) => `${d.toFixed(0)}%`)
    )
    .call((g) => g.selectAll(".domain, .tick line").style("stroke", "#555"))
    .call((g) => g.selectAll("text").style("fill", COLORS.text));

  // X scale (Categorical)
  const x = d3
    .scaleBand()
    .domain(["Conflict", "Stable"])
    .range([0, width])
    .padding(0.2);

  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .call((g) => g.selectAll(".domain, .tick line").style("stroke", "#555"))
    .call((g) => g.selectAll("text").style("fill", COLORS.text));

  // --- Making “violins” ---
  // Create bins (histogram) for each status
  const histogram = d3
    .histogram()
    .domain(y.domain())
    .thresholds(y.ticks(20)) // 20 bins for smoothness
    .value((d) => d.out_of_school_pct);

  const conflictBins = histogram(
    data.filter((d) => d.conflict_status === "Conflict")
  );
  const stableBins = histogram(
    data.filter((d) => d.conflict_status === "Stable")
  );

  // Find the maximum “length” (number) in the bin
  const maxBinLength = Math.max(
    d3.max(conflictBins, (d) => d.length),
    d3.max(stableBins, (d) => d.length)
  );

  // Scale for the “width” of a violin
  const violinWidthScale = d3
    .scaleLinear()
    .domain([0, maxBinLength])
    .range([0, x.bandwidth() / 2]); // Max width is half the band

  // generate area path for the violin
  const area = d3
    .area()
    .x0((d) => -violinWidthScale(d.length)) // left side
    .x1((d) => violinWidthScale(d.length)) // right side
    .y((d) => y((d.x0 + d.x1) / 2)) // centwer
    .curve(d3.curveCatmullRom);

  // viz
  svg
    .append("path")
    .datum(conflictBins)
    .attr("transform", `translate(${x("Conflict") + x.bandwidth() / 2}, 0)`)
    .attr("d", area)
    .style("fill", COLORS.conflict)
    .style("opacity", 0.7)
    .append("title")
    .text("Conflict Distribution");

  svg
    .append("path")
    .datum(stableBins)
    .attr("transform", `translate(${x("Stable") + x.bandwidth() / 2}, 0)`)
    .attr("d", area)
    .style("fill", COLORS.stable)
    .style("opacity", 0.7)
    .append("title")
    .text("Stable Distribution");
}

/**
 * ========================================================================
 * 8. Boxplot
 * file: box_summary.csv
 * ========================================================================
 */
async function drawBoxplot(container, dataUrl, COLORS) {
  const data = await d3.csv(dataUrl, d3.autoType);

  // Converting “long” data into “wide” data
  // group by 'conflict_status'
  const nested = d3.group(data, (d) => d.conflict_status);

  // Convert to { status: “Conflict”, stats: { median: 16.2, q1: 5.4, ... } }
  const summaryData = Array.from(nested.entries()).map(([status, values]) => {
    const stats = {};
    values.forEach((v) => {
      stats[v.level_1] = v.out_of_school_pct;
    });
    return { status, stats };
  });

  const margin = { top: 30, right: 30, bottom: 50, left: 50 };
  const totalWidth = 500;
  const totalHeight = 400;
  const width = totalWidth - margin.left - margin.right;
  const height = totalHeight - margin.top - margin.bottom;

  const svg = d3
    .select(container)
    .append("svg")
    .attr("viewBox", `0 0 ${totalWidth} ${totalHeight}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(summaryData, (d) => d.stats.whisker_high)])
    .nice()
    .range([height, 0]);

  svg
    .append("g")
    .call(
      d3
        .axisLeft(y)
        .ticks(5)
        .tickFormat((d) => `${d.toFixed(0)}%`)
    )
    .call((g) => g.selectAll(".domain, .tick line").style("stroke", "#555"))
    .call((g) => g.selectAll("text").style("fill", COLORS.text));

  const x = d3
    .scaleBand()
    .domain(["Conflict", "Stable"])
    .range([0, width])
    .padding(0.4);

  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .call((g) => g.selectAll(".domain, .tick line").style("stroke", "#555"))
    .call((g) => g.selectAll("text").style("fill", COLORS.text));

  // --- viz ---
  const boxWidth = x.bandwidth();

  summaryData.forEach((d) => {
    const { status, stats } = d;
    const center = x(status) + boxWidth / 2;
    const color = status === "Conflict" ? COLORS.conflict : COLORS.stable;

    svg
      .append("line")
      .attr("x1", center)
      .attr("x2", center)
      .attr("y1", y(stats.whisker_low))
      .attr("y2", y(stats.whisker_high))
      .attr("stroke", color)
      .attr("stroke-width", 2);

    svg
      .append("rect")
      .attr("x", x(status))
      .attr("y", y(stats.q3))
      .attr("height", y(stats.q1) - y(stats.q3))
      .attr("width", boxWidth)
      .attr("fill", color)
      .style("opacity", 0.7)
      .append("title")
      .text(
        `${status} (IQR: ${stats.q1.toFixed(1)}% - ${stats.q3.toFixed(1)}%)`
      );

    svg
      .append("line")
      .attr("x1", x(status))
      .attr("x2", x(status) + boxWidth)
      .attr("y1", y(stats.median))
      .attr("y2", y(stats.median))
      .attr("stroke", "#FFFFFF")
      .attr("stroke-width", 2)
      .append("title")
      .text(`${status} (Median: ${stats.median.toFixed(1)}%)`);

    svg
      .append("line")
      .attr("x1", center - boxWidth / 4)
      .attr("x2", center + boxWidth / 4)
      .attr("y1", y(stats.whisker_low))
      .attr("y2", y(stats.whisker_low))
      .attr("stroke", color)
      .attr("stroke-width", 2);

    svg
      .append("line")
      .attr("x1", center - boxWidth / 4)
      .attr("x2", center + boxWidth / 4)
      .attr("y1", y(stats.whisker_high))
      .attr("y2", y(stats.whisker_high))
      .attr("stroke", color)
      .attr("stroke-width", 2);
  });
}

/**
 * ========================================================================
 * 9: Ridgeline Plot (Joyplot)
 * file: histogram_country_time.csv
 * ========================================================================
 */
async function drawRidgelinePlot(container, dataUrl, COLORS) {
  const rawData = await d3.csv(dataUrl, d3.autoType);

  // We filter only Conflict (or you can make it Global) so that the graph is not overloaded.
  const data = rawData.filter((d) => d.conflict_status === "Conflict");

  // We obtain unique years and sort them (from new to old, so that the new ones overlap the old ones).
  const years = [...new Set(data.map((d) => d.year))].sort(d3.descending);

  // Receiving bins
  const bins = [...new Set(data.map((d) => d.bin_mid))].sort(d3.ascending);

  // Grouping data
  const dataByYear = d3.group(data, (d) => d.year);

  const margin = { top: 60, right: 30, bottom: 50, left: 60 };
  const totalWidth = 500;
  const totalHeight = 500;
  const width = totalWidth - margin.left - margin.right;
  const height = totalHeight - margin.top - margin.bottom;

  const svg = d3
    .select(container)
    .append("svg")
    .attr("viewBox", `0 0 ${totalWidth} ${totalHeight}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // X Scale (Bins/Percentages)
  const x = d3.scaleLinear().domain([0, 100]).range([0, width]);

  // Y-scale (Years) - use scaleBand to position the baselines
  const y = d3.scaleBand().domain(years).range([0, height]).paddingInner(1);

  // Mountain height scale (Count)
  const maxCount = d3.max(data, (d) => d.count);
  const z = d3.scaleLinear().domain([0, maxCount]).range([0, -60]); // Peak height (negative, since upward)

  // Area generator
  const area = d3
    .area()
    .x((d) => x(d.bin_mid))
    .y0(0)
    .y1((d) => z(d.count))
    .curve(d3.curveBasis);

  svg
    .selectAll(".ridge")
    .data(years)
    .enter()
    .append("g")
    .attr("transform", (d) => `translate(0, ${y(d)})`)
    .each(function (year) {
      const group = d3.select(this);
      const yearDataRaw = dataByYear.get(year) || [];

      // Fill in the gaps with zeros for correct line rendering.
      const yearData = bins.map((bin) => {
        const found = yearDataRaw.find((r) => r.bin_mid === bin);
        return { bin_mid: bin, count: found ? found.count : 0 };
      });

      group
        .append("path")
        .datum(yearData)
        .attr("fill", COLORS.conflict) // The color of conflict
        .attr("opacity", 0.6)
        .attr("d", area);

      group
        .append("path")
        .datum(yearData)
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", 0.5)
        .attr(
          "d",
          area.lineY1((d) => z(d.count))
        );

      group
        .append("text")
        .attr("x", -10)
        .attr("y", 0)
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .style("fill", COLORS.text)
        .style("font-size", "12px")
        .text(year);
    });

  // axis X
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(
      d3
        .axisBottom(x)
        .ticks(5)
        .tickFormat((d) => `${d}%`)
    )
    .selectAll("text")
    .style("fill", COLORS.text);

  // title X
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height + 35)
    .style("text-anchor", "middle")
    .style("fill", COLORS.text)
    .style("font-size", "12px")
    .text("Out-of-School Rate (%)");
}

/**
 * ========================================================================
 * 10: Streamgraph
 * file: violin_box_raw.csv
 * ========================================================================
 */
async function drawStreamgraph(container, dataUrl, COLORS) {
  const rawData = await d3.csv(dataUrl, d3.autoType);

  // 1. Aggregation: Sum (or average) of percentages by year and status
  const dataByYear = d3.rollup(
    rawData,
    (v) => d3.mean(v, (d) => d.out_of_school_pct),
    (d) => d.year,
    (d) => d.conflict_status
  );

  const years = [...new Set(rawData.map((d) => d.year))].sort(d3.ascending);
  const keys = ["Conflict", "Stable"];

  // Preparing data for the stack
  const stackData = years.map((year) => {
    const obj = { year: year };
    keys.forEach((key) => {
      obj[key] = dataByYear.get(year)?.get(key) || 0;
    });
    return obj;
  });

  const margin = { top: 20, right: 30, bottom: 40, left: 30 };
  const totalWidth = 500;
  const totalHeight = 400;
  const width = totalWidth - margin.left - margin.right;
  const height = totalHeight - margin.top - margin.bottom;

  const svg = d3
    .select(container)
    .append("svg")
    .attr("viewBox", `0 0 ${totalWidth} ${totalHeight}`)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Stack with offset “Silhouette” (centered stream) or “Wiggle”
  const stack = d3
    .stack()
    .keys(keys)
    .offset(d3.stackOffsetSilhouette) // Centers the graph
    .order(d3.stackOrderNone);

  const series = stack(stackData);

  // scales
  const x = d3.scaleLinear().domain(d3.extent(years)).range([0, width]);

  // The Y domain depends on the offset. Find the min and max in the series
  const yMin = d3.min(series, (layer) => d3.min(layer, (d) => d[0]));
  const yMax = d3.max(series, (layer) => d3.max(layer, (d) => d[1]));

  const y = d3.scaleLinear().domain([yMin, yMax]).range([height, 0]);

  const color = d3
    .scaleOrdinal()
    .domain(keys)
    .range([COLORS.conflict, COLORS.stable]);

  const area = d3
    .area()
    .x((d) => x(d.data.year))
    .y0((d) => y(d[0]))
    .y1((d) => y(d[1]))
    .curve(d3.curveCatmullRom);

  svg
    .selectAll("path")
    .data(series)
    .enter()
    .append("path")
    .attr("d", area)
    .attr("fill", (d) => color(d.key))
    .attr("opacity", 0.8)
    .append("title")
    .text((d) => d.key);

  // axis X
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).tickFormat(d3.format("d")).tickSize(0))
    .select(".domain")
    .remove();

  svg.selectAll(".tick text").style("fill", COLORS.text);

  // legend
  svg
    .selectAll(".label")
    .data(keys)
    .enter()
    .append("text")
    .attr("x", 10)
    .attr("y", (d, i) => 30 + i * 20)
    .style("fill", (d) => color(d))
    .style("font-weight", "bold")
    .text((d) => d);
}

/**
 * ========================================================================
 * 11: Horizon-style Multiples
 * file: violin_box_raw.csv
 * ========================================================================
 */
async function drawHorizonMultiples(container, dataUrl, COLORS) {
  const rawData = await d3.csv(dataUrl, d3.autoType);

  // Grouping by country
  const dataByCountry = d3.group(rawData, (d) => d.country);
  const countries = Array.from(dataByCountry.keys()).sort();
  const years = [...new Set(rawData.map((d) => d.year))].sort(d3.ascending);

  // setting up dimensions
  const margin = { top: 30, right: 20, bottom: 20, left: 60 };
  const totalWidth = 500;
  const rowHeight = 28;
  const gap = 5;
  const totalHeight =
    countries.length * (rowHeight + gap) + margin.top + margin.bottom;
  const width = totalWidth - margin.left - margin.right;

  const svg = d3
    .select(container)
    .append("svg")
    // Dynamic height depending on the number of countries
    .attr("viewBox", `0 0 ${totalWidth} ${Math.max(400, totalHeight)}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // General X scale
  const x = d3.scaleLinear().domain(d3.extent(years)).range([0, width]);

  // Total Y scale (local for each row)
  // Find the global maximum for unification, or the local maximum for detailing
  // For Horizon, it is better to use a global or fixed max to compare scales.
  const globalMax = 50; // We trim emissions > 50% for readability of key data
  const y = d3.scaleLinear().domain([0, globalMax]).range([rowHeight, 0]);

  const area = d3
    .area()
    .x((d) => x(d.year))
    .y0(rowHeight)
    .y1((d) => y(Math.min(d.out_of_school_pct, globalMax))) // Clip at max
    .curve(d3.curveMonotoneX);

  const rows = svg
    .selectAll(".row")
    .data(countries)
    .enter()
    .append("g")
    .attr("transform", (d, i) => `translate(0, ${i * (rowHeight + gap)})`);

  rows.each(function (country) {
    const group = d3.select(this);
    const countryData = dataByCountry
      .get(country)
      .sort((a, b) => a.year - b.year);

    // Determine status (for color) - take the status of the last year or the prevailing status
    const isConflict = countryData.some(
      (d) => d.conflict_status === "Conflict"
    );
    const fillColor = isConflict ? COLORS.conflict : COLORS.stable;

    group
      .append("rect")
      .attr("width", width)
      .attr("height", rowHeight)
      .attr("fill", "#ffffff")
      .attr("opacity", 0.05);

    // Data area
    group
      .append("path")
      .datum(countryData)
      .attr("fill", fillColor)
      .attr("opacity", 0.7)
      .attr("d", area);

    // Data line (for clarity)
    group
      .append("path")
      .datum(countryData)
      .attr("fill", "none")
      .attr("stroke", fillColor)
      .attr("stroke-width", 1)
      .attr(
        "d",
        area.lineY1((d) => y(Math.min(d.out_of_school_pct, globalMax)))
      );

    group
      .append("text")
      .attr("x", -10)
      .attr("y", rowHeight / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .style("fill", COLORS.text)
      .style("font-size", "10px")
      .text(country);
  });

  const axisYPos = countries.length * (rowHeight + gap);
  svg
    .append("g")
    .attr("transform", `translate(0, ${axisYPos})`)
    .call(d3.axisBottom(x).tickFormat(d3.format("d")).ticks(5))
    .selectAll("text")
    .style("fill", COLORS.text);

  svg.select(".domain").attr("stroke", "#555");
}

/**
 * ========================================================================
 * 12: Bump Chart
 * file: box_summary_country_time.csv
 * ========================================================================
 */
async function drawBumpChart(container, dataUrl, COLORS) {
  const rawData = await d3.csv(dataUrl, d3.autoType);

  const years = [...new Set(rawData.map((d) => d.year))].sort(d3.ascending);

  // Group by year and rank
  const rankedData = years.flatMap((year) => {
    const yearData = rawData.filter((d) => d.year === year);
    // Sort by median (high % = rank 1)
    yearData.sort((a, b) => d3.descending(a.median, b.median));
    return yearData.map((d, i) => ({
      year: d.year,
      country: d.country,
      median: d.median,
      rank: i + 1,
      status: d.conflict_status,
    }));
  });

  const dataByCountry = d3.group(rankedData, (d) => d.country);
  const countries = Array.from(dataByCountry.keys());

  const margin = { top: 30, right: 80, bottom: 40, left: 60 };
  const totalWidth = 550;
  const totalHeight = 550;
  const width = totalWidth - margin.left - margin.right;
  const height = totalHeight - margin.top - margin.bottom;

  const svg = d3
    .select(container)
    .append("svg")
    .attr("viewBox", `0 0 ${totalWidth} ${totalHeight}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // scales
  const maxRank = d3.max(rankedData, (d) => d.rank);

  const x = d3.scalePoint().domain(years).range([0, width]); // The graph is drawn strictly to width

  const y = d3.scaleLinear().domain([1, maxRank]).range([0, height]);

  const countryColor = d3.scaleOrdinal(d3.schemeCategory10).domain(countries);

  const line = d3
    .line()
    .x((d) => x(d.year))
    .y((d) => y(d.rank))
    .curve(d3.curveMonotoneX);

  // draw lines
  svg
    .selectAll(".rank-line")
    .data(dataByCountry)
    .enter()
    .append("path")
    .attr("class", "rank-line")
    .attr("fill", "none")
    .attr("stroke-width", 3)
    .attr("stroke", (d) => countryColor(d[0]))
    .attr("d", (d) => line(d[1]))
    .attr("opacity", 0.8)
    .style("mix-blend-mode", "screen");

  // draw dots
  svg
    .selectAll(".rank-dot")
    .data(rankedData)
    .enter()
    .append("circle")
    .attr("cx", (d) => x(d.year))
    .attr("cy", (d) => y(d.rank))
    .attr("r", 3)
    .attr("fill", (d) => countryColor(d.country))
    .attr("stroke", "#2b2b2b")
    .attr("stroke-width", 1);

  // --- CALCULATION OF SIGNATURE POSITIONS ---

  const labelsData = countries.map((c) => {
    const points = dataByCountry.get(c);
    // We take the latest available point
    const lastPoint = points.sort((a, b) => a.year - b.year)[points.length - 1];
    return {
      country: c,
      // Coordinates of the end of the graph line
      xAnchor: x(lastPoint.year),
      yAnchor: y(lastPoint.rank),
      yText: y(lastPoint.rank),
      rank: lastPoint.rank,
    };
  });

  // Sort signatures vertically
  labelsData.sort((a, b) => a.yAnchor - b.yAnchor);

  // “Separate” the signatures so they don't stick together
  const fontSize = 12;

  for (let i = 1; i < labelsData.length; i++) {
    const prev = labelsData[i - 1];
    const curr = labelsData[i];

    // If the current mark is higher than (previous + font height), shift
    if (curr.yText < prev.yText + fontSize) {
      curr.yText = prev.yText + fontSize;
    }
  }

  const labelGroup = svg
    .selectAll(".label-group")
    .data(labelsData)
    .enter()
    .append("g");

  // Connecting line (from the graph point to the text)
  labelGroup
    .append("path")
    .attr("fill", "none")
    .attr("stroke", "#888")
    .attr("stroke-width", 1)
    .attr("stroke-dasharray", "2,2")
    .attr("opacity", 0.5)
    .attr("d", (d) => {
      return `M ${d.xAnchor + 5}, ${d.yAnchor} 
                    C ${width + 20}, ${d.yAnchor} 
                      ${width - 20}, ${d.yText} 
                      ${width + 10}, ${d.yText}`;
    });

  labelGroup
    .append("text")
    .attr("x", width + 15)
    .attr("y", (d) => d.yText)
    .attr("dy", "0.35em")
    .style("fill", (d) => countryColor(d.country))
    .style("font-size", "11px")
    .style("font-weight", "bold")
    .text((d) => d.country);

  // axis
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("fill", COLORS.text);

  svg
    .selectAll(".grid-line")
    .data(years)
    .enter()
    .append("line")
    .attr("x1", (d) => x(d))
    .attr("x2", (d) => x(d))
    .attr("y1", 0)
    .attr("y2", height)
    .attr("stroke", "#444")
    .attr("stroke-dasharray", "2,2")
    .attr("opacity", 0.3)
    .lower();

  // axis Y
  svg
    .append("g")
    .call(d3.axisLeft(y).ticks(maxRank))
    .call((g) => g.select(".domain").remove())
    .call((g) => g.selectAll(".tick line").remove())
    .call((g) => g.selectAll("text").style("fill", "#666"));

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 15)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("fill", COLORS.text)
    .text("Rank (1 = Highest Rate)");
}

/**
 * ==================================================================
 * map 1: Change Map 
 * ==================================================================
 */

function drawChoroplethMapChange(containerEl, csvUrl, geoJsonUrl, COLORS) {
  const width = containerEl.clientWidth || 600;
  const height = Math.max(320, Math.round(width * 0.55));

  containerEl.innerHTML = "";

  const svg = d3
    .select(containerEl)
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  const mapGroup = svg.append("g").attr("class", "map-group");

  Promise.all([
    d3.csv(csvUrl, d3.autoType),
    d3.json(geoJsonUrl),
  ])
    .then(([rows, geo]) => {
      const dataByCountry = new Map(rows.map((d) => [d.country, d]));

      const changes = rows
        .map((d) => d.change)
        .filter((v) => typeof v === "number" && !Number.isNaN(v));

      if (!changes.length) {
        containerEl.textContent = "No data";
        return;
      }

      const minChange = d3.min(changes);
      const maxChange = d3.max(changes);

      const color = d3
        .scaleSequential()
        .domain([minChange, maxChange])
        .interpolator(COLORS.heatmap);

      const projection = d3.geoNaturalEarth1().fitWidth(width, geo);
      const path = d3.geoPath(projection);

      const bounds = path.bounds(geo);
      const geoHeight = bounds[1][1] - bounds[0][1];
      const offsetY = (height - geoHeight) / 2 - bounds[0][1];

      mapGroup.attr("transform", `translate(0,${offsetY})`);

      mapGroup
        .selectAll("path.country")
        .data(geo.features)
        .join("path")
        .attr("class", "country")
        .attr("d", path)
        .attr("fill", (d) => {
          const record = dataByCountry.get(d.properties.name);
          if (!record || Number.isNaN(record.change)) {
            return COLORS.waffleBg;
          }
          return color(record.change);
        })
        .attr("stroke", "#111")
        .attr("stroke-width", 0.3);

      const legendWidth = Math.min(220, width * 0.55);
      const legendHeight = 10;
      const legendMargin = 16;

      const defs = svg.append("defs");
      const gradientId = "change-map-gradient";

      const gradient = defs
        .append("linearGradient")
        .attr("id", gradientId)
        .attr("x1", "0%")
        .attr("x2", "100%")
        .attr("y1", "0%")
        .attr("y2", "0%");

      d3.range(0, 1.01, 0.1).forEach((t) => {
        gradient
          .append("stop")
          .attr("offset", `${t * 100}%`)
          .attr("stop-color", COLORS.heatmap(t));
      });

      const legendGroup = svg
        .append("g")
        .attr("class", "legend")
        .attr(
          "transform",
          `translate(${width - legendWidth - legendMargin},${
            height - legendMargin - 30
          })`
        );

      legendGroup
        .append("rect")
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .attr("fill", `url(#${gradientId})`);

      const legendScale = d3
        .scaleLinear()
        .domain([minChange, maxChange])
        .range([0, legendWidth]);

      const legendAxis = d3
        .axisBottom(legendScale)
        .ticks(4)
        .tickFormat(d3.format(".1f"));

      legendGroup
        .append("g")
        .attr("transform", `translate(0,${legendHeight})`)
        .call(legendAxis)
        .call((g) => {
          g.selectAll("text")
            .attr("fill", COLORS.text)
            .attr("font-size", 10);
          g.selectAll("line,path").attr("stroke", COLORS.text);
        });

      legendGroup
        .append("text")
        .attr("x", 0)
        .attr("y", -4)
        .attr("fill", COLORS.text)
        .attr("font-size", 11)
        .text("Change in out-of-school rate (p.p.)");
    })
    .catch((error) => {
      console.error("Error drawing change map:", error);
      containerEl.textContent = "Error loading map.";
    });
}

/**
 * ==================================================================
 * map 2: Choropleth Map (Avg)
 * ==================================================================
 */

function drawChoroplethMapAvg(container, csvPath, geoPath, COLORS) {

  const width = container.clientWidth || 600;
  const height = Math.max(320, Math.round(width * 0.55));

  container.innerHTML = "";

  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  Promise.all([d3.json(geoPath), d3.csv(csvPath)])
    .then(([geojson, rows]) => {
      if (!geojson || !geojson.features || !rows || !rows.length) return;

      const avgByCountry = d3.rollup(
        rows,
        (v) => d3.mean(v, (d) => +d.avg_out_of_school_pct),
        (d) => d.country
      );

      const breakdownByCountry = d3.group(rows, (d) => d.country);

      geojson.features.forEach((f) => {
        const props = f.properties || {};
        const name = props.admin;
        const v = avgByCountry.get(name);
        props._value = Number.isFinite(v) ? v : NaN;

        const breakdown = breakdownByCountry.get(name);
        if (breakdown) {
          const conflictRow = breakdown.find(
            (d) => d.conflict_status === "Conflict"
          );
          const stableRow = breakdown.find(
            (d) => d.conflict_status === "Stable"
          );
          props._conflict = conflictRow
            ? +conflictRow.avg_out_of_school_pct
            : NaN;
          props._stable = stableRow
            ? +stableRow.avg_out_of_school_pct
            : NaN;
        } else {
          props._conflict = NaN;
          props._stable = NaN;
        }
      });

      const values = geojson.features
        .map((f) => f.properties._value)
        .filter((v) => Number.isFinite(v));

      if (!values.length) return;

      const maxVal = d3.max(values);

      const projection = d3.geoNaturalEarth1().fitWidth(width, geojson);
      const path = d3.geoPath(projection);

      const bounds = path.bounds(geojson);
      const geoHeight = bounds[1][1] - bounds[0][1];
      const offsetY = (height - geoHeight) / 2 - bounds[0][1];

      const g = svg.append("g").attr("transform", `translate(0,${offsetY})`);

      const color = d3
        .scaleSequential(COLORS.heatmap)
        .domain([0, maxVal]);

      const countries = g
        .selectAll("path.country")
        .data(geojson.features)
        .join("path")
        .attr("class", "country")
        .attr("d", path)
        .attr("fill", (d) => {
          const v = d.properties._value;
          return Number.isFinite(v) ? color(v) : COLORS.waffleBg;
        })
        .attr("stroke", "#111")
        .attr("stroke-width", 0.3)
        .attr("vector-effect", "non-scaling-stroke");

      countries
        .append("title")
        .text((d) => {
          const props = d.properties || {};
          const name = props.admin || "";
          const v = props._value;
          const conflict = props._conflict;
          const stable = props._stable;
          const fmt = d3.format(".1f");

          const lines = [];
          lines.push(name || "Unknown");
          lines.push(
            "Average out-of-school (2010–2024): " +
              (Number.isFinite(v) ? fmt(v) + "%" : "n/a")
          );
          if (Number.isFinite(conflict)) {
            lines.push("Conflict: " + fmt(conflict) + "%");
          }
          if (Number.isFinite(stable)) {
            lines.push("Stable: " + fmt(stable) + "%");
          }
          return lines.join("\n");
        });

      const legendWidth = Math.min(220, width * 0.55);
      const legendHeight = 10;
      const legendMargin = 16;

      const defs = svg.append("defs");
      const gradientId = "choropleth-avg-gradient";

      const grad = defs
        .append("linearGradient")
        .attr("id", gradientId)
        .attr("x1", "0%")
        .attr("x2", "100%")
        .attr("y1", "0%")
        .attr("y2", "0%");

      d3.range(0, 1.01, 0.1).forEach((t) => {
        grad
          .append("stop")
          .attr("offset", `${t * 100}%`)
          .attr("stop-color", COLORS.heatmap(t * (maxVal > 0 ? 1 : 0)));
      });

      const legendGroup = svg
        .append("g")
        .attr("class", "legend")
        .attr(
          "transform",
          `translate(${width - legendWidth - legendMargin},${
            height - legendMargin - 30
          })`
        );

      legendGroup
        .append("rect")
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .attr("fill", `url(#${gradientId})`);

      const legendScale = d3
        .scaleLinear()
        .domain([0, maxVal])
        .range([0, legendWidth]);

      const legendAxis = d3
        .axisBottom(legendScale)
        .ticks(4)
        .tickFormat((d) => d3.format(".1f")(d) + "%");

      legendGroup
        .append("g")
        .attr("transform", `translate(0,${legendHeight})`)
        .call(legendAxis)
        .call((gAxis) => {
          gAxis
            .selectAll("text")
            .attr("fill", COLORS.text)
            .attr("font-size", 10);
          gAxis.selectAll("line,path").attr("stroke", "#555");
        });

      legendGroup
        .append("text")
        .attr("x", 0)
        .attr("y", -4)
        .attr("fill", COLORS.text)
        .attr("font-size", 11)
        .text("Average out-of-school rate (%)");
    })
    .catch((err) => {
      console.error("Choropleth map error:", err);
      d3.select(container)
        .append("div")
        .style("color", "red")
        .style("padding", "8px")
        .style("font-size", "12px")
        .text("Error loading map");
    });
}

/**
 * ==================================================================
 * map 3: Proportional Symbol Map
 * ==================================================================
 */
function drawProportionalSymbolMap(container, csvPath, geoJsonPath, COLORS) {
  const width = container.clientWidth || 400;
  const height = container.clientHeight || 260;

  container.innerHTML = "";
  container.style.position = "relative";

  const svg = d3
    .select(container)
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  const g = svg.append("g");

  const projection = d3.geoNaturalEarth1();
  const path = d3.geoPath(projection);

  const tooltip = d3
    .select(container)
    .append("div")
    .style("position", "absolute")
    .style("pointer-events", "none")
    .style("background", "#111")
    .style("color", "#f5f5f5")
    .style("padding", "6px 8px")
    .style("border-radius", "4px")
    .style("font-size", "11px")
    .style("opacity", 0);

  Promise.all([
    d3.json(geoJsonPath),
    d3.csv(csvPath, d3.autoType),
  ])
    .then(([geo, data]) => {
      const valueByCountry = new Map(
        data.map((d) => [d.country, d.avg_out_of_school_pct])
      );

      const values = Array.from(valueByCountry.values()).filter(
        (v) => v != null && !isNaN(v)
      );

      if (!values.length) return;

      const color = d3
        .scaleSequential()
        .domain([d3.min(values), d3.max(values)])
        .interpolator(COLORS.heatmap);

      projection.fitExtent(
        [
          [10, 10],
          [width - 10, height - 10],
        ],
        geo
      );

      g.selectAll("path")
        .data(geo.features)
        .join("path")
        .attr("d", path)
        .attr("fill", (d) => {
          const v = valueByCountry.get(d.properties.name);
          return v != null ? color(v) : "#2b2b2b";
        })
        .attr("stroke", "#111")
        .attr("stroke-width", 0.3)
        .on("mousemove", function (event, d) {
          const v = valueByCountry.get(d.properties.name);
          tooltip
            .style("opacity", 1)
            .html(
              `<strong>${d.properties.name}</strong><br>` +
                (v != null
                  ? `Out-of-school: ${v.toFixed(1)}%`
                  : "No data")
            )
            .style("left", event.offsetX + 12 + "px")
            .style("top", event.offsetY + 12 + "px");
        })
        .on("mouseleave", function () {
          tooltip.style("opacity", 0);
        });
    })
    .catch((error) => {
      console.error("Error loading Change Map data:", error);
      container.innerHTML = "Error loading data.";
      container.style.color = "red";
    });
}