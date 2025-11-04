document.addEventListener("DOMContentLoaded", () => {
  // We use a more diverse D3 color palette
  const COLORS = {
    // For bars (Bar Chart, Grouped Bar Chart, Stacked Bar Chart)
    // We use d3.schemeCategory10 for more contrasting colors
    female: d3.schemeCategory10[4],
    male: d3.schemeCategory10[0],

    // For Heatmap - a smoother gradient in a different shade
    heatmap:d3.interpolateRgbBasisClosed(["#feebe2", "#fcc5c0", "#fa9fb5", "#f768a1", "#dd3497", "#ae017e", "#7a0177"]),
    
    // For Waffle Chart - contrasting color for women and light background
    waffleFemale: d3.schemeSet2[3],
    waffleBg: "#e0e0e0",

    text: "#222",
  };

  // choose all viz cards
  const vizCards = document.querySelectorAll(".viz-card");

  vizCards.forEach((card) => {
    const canvas = card.querySelector(".viz-canvas");
    const footer = card.querySelector(".viz-footer");

    if (!canvas || !footer || canvas.textContent.includes("Coming Soon")) {
      return; // let through, if it placeholder or smth not going on plan
    }

    const chartType = card.dataset.chart;
    canvas.innerHTML = ""; // cleaning 'chart' or 'Loading...'

    // call appropriate drawning function
    try {
      switch (chartType) {
        case "Barchart":
          drawBarchart(
            canvas,
            "../Data/Data_Clean/bar_female_employment.csv",
            COLORS
          );
          break;
        case "Grouped Barchart":
          drawGroupedBarchart(
            canvas,
            "../Data/Data_Clean/grouped_emp_by_sex.csv",
            COLORS
          );
          break;
        case "Heatmap":
          drawHeatmap(
            canvas,
            "../Data/Data_Clean/heatmap_employment_gap.csv",
            COLORS
          );
          break;
        case "100% Stacked Barchart":
          drawStackedBarchart(
            canvas,
            "../Data/Data_Clean/stacked100_labor_force_share.csv",
            COLORS
          );
          break;
        case "Waffle Chart":
          drawWaffleChart(
            canvas,
            "../Data/Data_Clean/waffle_women_parliament.csv",
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
 * 1. Barchart: Female Employment Rate
 * ========================================================================
 */
async function drawBarchart(container, dataUrl, COLORS) {
  const data = await d3.csv(dataUrl, d3.autoType);
  data.sort((a, b) => d3.descending(a.female_emp_rate, b.female_emp_rate));

  const margin = { top: 60, right: 30, bottom: 120, left: 70 };
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
    .domain([0, d3.max(data, (d) => d.female_emp_rate)])
    .nice()
    .range([height, 0]);

  // X-axis
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end")
    .style("fill", COLORS.text);

  // Y-axis
  svg
    .append("g")
    .call(
      d3
        .axisLeft(y)
        .ticks(5)
        .tickFormat((d) => `${d}%`)
    )
    .selectAll("text")
    .style("fill", COLORS.text);

  // Y-axis Label
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 15)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("fill", COLORS.text)
    .style("font-size", "12px")
    .text("Female Employment Rate");

  // Bars
  svg
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => x(d.country))
    .attr("y", (d) => y(d.female_emp_rate))
    .attr("width", x.bandwidth())
    .attr("height", (d) => height - y(d.female_emp_rate))
    .attr("fill", COLORS.female)
    .append("title")
    .text((d) => `${d.country}: ${d.female_emp_rate.toFixed(1)}%`);
}

/**
 * ========================================================================
 * 2. Grouped Barchart: Employment Rate by Sex
 * ========================================================================
 */
async function drawGroupedBarchart(container, dataUrl, COLORS) {
  const data = await d3.csv(dataUrl, d3.autoType);
  data.sort((a, b) => d3.descending(a.female_emp_rate, b.female_emp_rate));

  const keys = ["female_emp_rate", "male_emp_rate"];

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

  const x0 = d3
    .scaleBand()
    .domain(data.map((d) => d.country))
    .rangeRound([0, width])
    .paddingInner(0.1);

  const x1 = d3
    .scaleBand()
    .domain(keys)
    .rangeRound([0, x0.bandwidth()])
    .padding(0.05);

  const y = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, (d) => Math.max(d.female_emp_rate, d.male_emp_rate)),
    ])
    .nice()
    .rangeRound([height, 0]);

  const color = d3
    .scaleOrdinal()
    .domain(keys)
    .range([COLORS.female, COLORS.male]);

  // X-axis
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x0))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end")
    .style("fill", COLORS.text);

  // Y-axis
  svg
    .append("g")
    .call(
      d3
        .axisLeft(y)
        .ticks(5)
        .tickFormat((d) => `${d}%`)
    )
    .selectAll("text")
    .style("fill", COLORS.text);

  // Y-axis Label
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 15)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("fill", COLORS.text)
    .style("font-size", "12px")
    .text("Employment Rate");

  // Bars
  const groups = svg
    .selectAll(".group")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "group")
    .attr("transform", (d) => `translate(${x0(d.country)},0)`);

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
    .text(
      (d) =>
        `${d.country} (${
          d.key === "female_emp_rate" ? "Female" : "Male"
        }): ${d.value.toFixed(1)}%`
    );

  // Legend
  const legend = svg
    .append("g")
    // ИЗМЕНЕНИЕ: сдвигаем легенду вверх (было -10)
    .attr("transform", `translate(${width - 120}, -35)`);

  keys.forEach((key, i) => {
    const legendRow = legend
      .append("g")
      .attr("transform", `translate(0, ${i * 20})`);

    legendRow
      .append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", color(key));

    // ИЗМЕНЕНИЕ: центрируем текст по вертикали
    legendRow
      .append("text")
      .attr("x", 20)
      .attr("y", 7.5) // 15 / 2
      .attr("dominant-baseline", "middle")
      .text(key === "female_emp_rate" ? "Female" : "Male")
      .style("font-size", "12px")
      .style("fill", COLORS.text);
  });
}

/**
 * ========================================================================
 * 3. Heatmap: Employment Gap
 * ========================================================================
 */
async function drawHeatmap(container, dataUrl, COLORS) {
  const data = await d3.csv(dataUrl, d3.autoType);

  const margin = { top: 40, right: 20, bottom: 80, left: 140 };
  const totalWidth = 550;

  // ИЗМЕНЕНИЕ: Увеличена общая высота для лучшего соотношения сторон
  const totalHeight = 450; // Было 400

  const width = totalWidth - margin.left - margin.right;
  // `height` теперь тоже автоматически станет больше (450 - 40 - 80 = 330)
  const height = totalHeight - margin.top - margin.bottom;

  const svg = d3
    .select(container)
    .append("svg")
    .attr("viewBox", `0 0 ${totalWidth} ${totalHeight}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const countries = [...new Set(data.map((d) => d.country))].sort(d3.ascending);
  const years = [...new Set(data.map((d) => d.year))].sort(d3.ascending);

  const x = d3.scaleBand().domain(years).range([0, width]).padding(0.05);

  // Y-шкала теперь будет распределять страны по большей высоте (330)
  const y = d3.scaleBand().domain(countries).range([height, 0]).padding(0.1);

  // X-axis
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).tickValues(x.domain().filter((d, i) => !(i % 3))))
    .selectAll("text")
    .style("fill", COLORS.text);

  // Y-axis
  svg
    .append("g")
    .call(d3.axisLeft(y))
    .selectAll("text")
    .style("fill", COLORS.text);

  const maxGap = d3.max(data, (d) => d.employment_gap_pct);

  const color = d3
    .scaleSequential()
    .interpolator(COLORS.heatmap)
    .domain([0, maxGap]);

  // Cells
  svg
    .selectAll()
    .data(data, (d) => `${d.country}:${d.year}`)
    .enter()
    .append("rect")
    .attr("x", (d) => x(d.year))
    .attr("y", (d) => y(d.country))
    .attr("width", x.bandwidth())
    .attr("height", y.bandwidth())
    .style("fill", (d) => color(d.employment_gap_pct))
    .append("title")
    .text(
      (d) =>
        `Gap in ${d.country} (${d.year}): ${d.employment_gap_pct.toFixed(1)}%`
    );
}

/**
 * ========================================================================
 * 4. 100% Stacked Barchart: Labor Force Share
 * ========================================================================
 */
async function drawStackedBarchart(container, dataUrl, COLORS) {
  let data = await d3.csv(dataUrl, d3.autoType);

  data = data.map((d) => {
    const total = d.female_share_pct + d.male_share_pct;
    return {
      country: d.country,
      female_pct: (d.female_share_pct / total) * 100,
      male_pct: (d.male_share_pct / total) * 100,
    };
  });

  data.sort((a, b) => d3.descending(a.female_pct, b.female_pct));

  const keys = ["female_pct", "male_pct"];
  const stackedData = d3.stack().keys(keys)(data);

  // ИЗМЕНЕНИЕ: Увеличен нижний отступ (было 140)
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
    .domain(data.map((d) => d.country))
    .range([0, width])
    .padding(0.1);

  const y = d3.scaleLinear().domain([0, 100]).range([height, 0]);

  const color = d3
    .scaleOrdinal()
    .domain(keys)
    .range([COLORS.female, COLORS.male]);

  // X-axis
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end")
    .style("fill", COLORS.text);

  // Y-axis
  svg
    .append("g")
    .call(
      d3
        .axisLeft(y)
        .ticks(5)
        .tickFormat((d) => `${d}%`)
    )
    .selectAll("text")
    .style("fill", COLORS.text);

  // Y-axis Label
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 15)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("fill", COLORS.text)
    .style("font-size", "12px")
    .text("Share of Labor Force");

  // Bars
  svg
    .append("g")
    .selectAll("g")
    .data(stackedData)
    .enter()
    .append("g")
    .attr("fill", (d) => color(d.key))
    .selectAll("rect")
    .data((d) => d)
    .enter()
    .append("rect")
    .attr("x", (d, i) => x(d.data.country))
    .attr("y", (d) => y(d[1]))
    .attr("height", (d) => y(d[0]) - y(d[1]))
    .attr("width", x.bandwidth())
    .append("title")
    .text((d) => {
      const key = d[1] === d.data.male_pct ? "Male" : "Female";
      const pct = (d[1] - d[0]).toFixed(1);
      return `${d.data.country} (${key}): ${pct}%`;
    });

  // Legend
  const legend = svg
    .append("g")
    .attr("transform", `translate(${width - 120}, -45)`);

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
      .text(key === "female_pct" ? "Female" : "Male")
      .style("font-size", "12px")
      .style("fill", COLORS.text);
  });
}

/**
 * ========================================================================
 * 5. Waffle Chart: Women in Parliament
 * ========================================================================
 */
async function drawWaffleChart(container, dataUrl, COLORS) {
  const data = await d3.csv(dataUrl, d3.autoType);

  const margin = { top: 70, right: 20, bottom: 10, left: 20 };
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

  // Waffle settings
  const waffleSize = 10;
  const totalSquares = waffleSize * waffleSize;
  const squareSize = 10;
  const squareGap = 2;
  const waffleWidth = (squareSize + squareGap) * waffleSize;

  const wafflesPerRow = Math.floor(width / (waffleWidth + 25));

  data.sort((a, b) =>
    d3.descending(a.women_leadership_pct, b.women_leadership_pct)
  );

  const waffleGroups = svg
    .selectAll(".waffle-group")
    .data(data.slice(0, 6))
    .enter()
    .append("g")
    .attr("class", "waffle-group")
    .attr("transform", (d, i) => {
      const col = i % wafflesPerRow;
      const row = Math.floor(i / wafflesPerRow);
      const x = col * (waffleWidth + 25);
      const y = row * (waffleWidth + 30);
      return `translate(${x},${y})`;
    });

  waffleGroups.each(function (d) {
    const group = d3.select(this);
    const numWomen = Math.round(d.women_leadership_pct);
    const waffleData = d3.range(totalSquares).map((i) => {
      return {
        isWoman: i < numWomen,
      };
    });

    // country name
    group
      .append("text")
      .attr("x", waffleWidth / 2)
      .attr("y", -8)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "600")
      .style("fill", COLORS.text)
      .text(`${d.country} (${numWomen}%)`);

    // squares
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
      .attr("fill", (d) => (d.isWoman ? COLORS.waffleFemale : COLORS.waffleBg)) // ИЗМЕНЕНИЕ: Новые цвета
      .append("title")
      .text(d.isWoman ? "Women" : "Men/Other");
  });
}
