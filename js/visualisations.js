document.addEventListener("DOMContentLoaded", () => {
  // Новая палитра, соответствующая теме "конфликт/стабильность" и темному режиму
  const COLORS = {
    // Цвета для статуса
    conflict: "#e41a1c", // Красный
    stable: "#377eb8", // Синий

    // Градиент для тепловой карты (от желтого к красному)
    heatmap: d3.interpolateYlOrRd,

    // Цвет для фона "пустых" ячеек вафельного графика
    waffleBg: "#444444",

    // Цвет текста (из вашего CSS)
    text: "#c4c0c0",
  };

  // Выбираем все карточки визуализаций
  const vizCards = document.querySelectorAll(".viz-card");

  vizCards.forEach((card) => {
    const canvas = card.querySelector(".viz-canvas");
    const footer = card.querySelector(".viz-footer");

    // Пропускаем плейсхолдер "Coming Soon"
    if (!canvas || !footer || canvas.textContent.includes("Coming Soon")) {
      return;
    }

    const chartType = card.dataset.chart;
    canvas.innerHTML = ""; // Очищаем 'chart'

    // Вызываем соответствующую функцию отрисовки
    try {
      switch (chartType) {
        case "Barchart":
          drawBarchart(canvas, "Data/ChildreEducationConflict/ChartData/bar_out_of_school.csv", COLORS);
          break;
        case "Grouped Barchart":
          // Эта функция была полностью переписана для обработки данных
          // grouped_country_year.csv
          drawGroupedBarchart(canvas, "Data/ChildreEducationConflict/ChartData/grouped_country_year.csv", COLORS);
          break;
        case "Heatmap":
          drawHeatmap(canvas, "Data/ChildreEducationConflict/ChartData/heatmap_out_of_school.csv", COLORS);
          break;
        case "100% Stacked Barchart":
          drawStackedBarchart(canvas, "Data/ChildreEducationConflict/ChartData/stacked100_conflict_share.csv", COLORS);
          break;
        case "Waffle Chart":
          drawWaffleChart(canvas, "Data/ChildreEducationConflict/ChartData/waffle_global_avg.csv", COLORS);
          break;
          case "Histogram":
          drawHistogram(canvas, "Data/ChildreEducationConflict/DistributionData/histogram.csv", COLORS);
          break;
        case "Violin Plot":
          drawViolinPlot(canvas, "Data/ChildreEducationConflict/DistributionData/violin_box_raw.csv", COLORS);
          break;
        case "Boxplot":
          drawBoxplot(canvas, "Data/ChildreEducationConflict/DistributionData/box_summary.csv", COLORS);
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
 * 1. Barchart: Средний процент по странам
 * Файл: bar_out_of_school.csv
 * ========================================================================
 */
async function drawBarchart(container, dataUrl, COLORS) {
  const data = await d3.csv(dataUrl, d3.autoType);
  
  // Сортируем данные по убыванию
  data.sort((a, b) =>
    d3.descending(a.out_of_school_pct, b.out_of_school_pct)
  );

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

  // Ось X (Страны)
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end")
    .style("fill", COLORS.text);

  // Ось Y (Проценты)
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

  // Подпись оси Y
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

  // Столбцы
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
    // Цвет в зависимости от статуса
    .attr("fill", (d) =>
      d.conflict_status === "Conflict" ? COLORS.conflict : COLORS.stable
    )
    .append("title")
    .text(
      (d) =>
        `${d.country} (${d.conflict_status}): ${d.out_of_school_pct.toFixed(1)}%`
    );
}

/**
 * ========================================================================
 * 2. Grouped Barchart: Средние по статусу (Conflict vs Stable)
 * Файл: grouped_country_year.csv
 *
 * ПРИМЕЧАНИЕ: Данные в `grouped_country_year.csv` - это временной ряд.
 * Группированный барный график здесь лучше всего подходит для
 * сравнения СРЕДНЕГО 'Conflict' и 'Stable' процента для каждой страны.
 * ========================================================================
 */
async function drawGroupedBarchart(container, dataUrl, COLORS) {
  const data = await d3.csv(dataUrl, d3.autoType);

  // 1. Агрегируем данные: вычисляем средний % для 'Conflict' и 'Stable' по каждой стране
  const statusAvgs = d3.rollup(
    data,
    (v) => d3.mean(v, (d) => d.out_of_school_pct),
    (d) => d.country,
    (d) => d.conflict_status
  );

  // 2. Преобразуем сгруппированные данные в плоский массив
  const groupedData = Array.from(statusAvgs.entries()).map(
    ([country, values]) => {
      return {
        country: country,
        Conflict: values.get("Conflict") || 0, // 0, если у страны не было 'Conflict' лет
        Stable: values.get("Stable") || 0, // 0, если не было 'Stable' лет
      };
    }
  );

  // Сортируем по суммарному % (для наглядности)
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

  // Шкала X0 (для стран)
  const x0 = d3
    .scaleBand()
    .domain(groupedData.map((d) => d.country))
    .rangeRound([0, width])
    .paddingInner(0.1);

  // Шкала X1 (для 'Conflict' и 'Stable' внутри страны)
  const x1 = d3
    .scaleBand()
    .domain(keys)
    .rangeRound([0, x0.bandwidth()])
    .padding(0.05);

  // Шкала Y
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(groupedData, (d) => Math.max(d.Conflict, d.Stable))])
    .nice()
    .rangeRound([height, 0]);

  // Цветовая шкала
  const color = d3
    .scaleOrdinal()
    .domain(keys)
    .range([COLORS.conflict, COLORS.stable]);

  // Ось X
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x0))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end")
    .style("fill", COLORS.text);

  // Ось Y
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
    
  // Подпись оси Y
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

  // Группы столбцов
  const groups = svg
    .selectAll(".group")
    .data(groupedData)
    .enter()
    .append("g")
    .attr("class", "group")
    .attr("transform", (d) => `translate(${x0(d.country)},0)`);

  // Столбцы внутри групп
  groups
    .selectAll("rect")
    .data((d) => keys.map((key) => ({ key, value: d[key], country: d.country })))
    .enter()
    .append("rect")
    .attr("x", (d) => x1(d.key))
    .attr("y", (d) => y(d.value))
    .attr("width", x1.bandwidth())
    .attr("height", (d) => height - y(d.value))
    .attr("fill", (d) => color(d.key))
    .append("title")
    .text((d) => `${d.country} (${d.key}): ${d.value.toFixed(1)}%`);

  // Легенда
  const legend = svg
    .append("g")
    .attr("transform", `translate(${width - 100}, -35)`); // Сдвигаем

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
      .attr("y", 7.5) // Центрируем текст
      .attr("dominant-baseline", "middle")
      .text(key)
      .style("font-size", "12px")
      .style("fill", COLORS.text);
  });
}

/**
 * ========================================================================
 * 3. Heatmap: Страны × Годы
 * Файл: heatmap_out_of_school.csv
 * ========================================================================
 */
async function drawHeatmap(container, dataUrl, COLORS) {
  const data = await d3.csv(dataUrl, d3.autoType);

  // 1. Преобразуем "широкие" данные в "длинные"
  // Годы берем из колонок, исключая 'country'
  const allYears = data.columns.slice(1);
  
  // Отфильтруем годы, где все значения 0 (как 2023, 2024 в примере)
  const relevantYears = allYears.filter(year => {
    // Проверяем, есть ли хоть одно ненулевое значение в этом году
    return data.some(d => d[year] > 0);
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
  
  // 2. Настройка SVG и Шкал
  const margin = { top: 40, right: 20, bottom: 80, left: 90 }; // Увеличено слева
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

  // Шкала X (Годы)
  const x = d3.scaleBand().domain(relevantYears).range([0, width]).padding(0.05);

  // Шкала Y (Страны)
  const y = d3.scaleBand().domain(countries).range([height, 0]).padding(0.1);

  // Ось X
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    // Показываем каждый 3-й год, чтобы избежать наложения
    .call(d3.axisBottom(x).tickValues(x.domain().filter((d, i) => !(i % 3))))
    .selectAll("text")
    .style("fill", COLORS.text);

  // Ось Y
  svg
    .append("g")
    .call(d3.axisLeft(y))
    .call((g) => g.selectAll(".domain, .tick line").style("stroke", "#555"))
    .call((g) => g.selectAll("text").style("fill", COLORS.text));

  // Цветовая шкала
  const maxGap = d3.max(longData, (d) => d.value);
  const color = d3
    .scaleSequential(COLORS.heatmap)
    // Начинаем домен с -0.01, чтобы 0% были цветом 'min', а не смешанным
    .domain([-0.01, maxGap]);

  // 3. Отрисовка ячеек
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
 * 4. 100% Stacked Barchart: Доля по годам
 * Файл: stacked100_conflict_share.csv
 * ========================================================================
 */
async function drawStackedBarchart(container, dataUrl, COLORS) {
  let data = await d3.csv(dataUrl, d3.autoType);

  const keys = ["conflict_share", "stable_share"];
  const stackedData = d3.stack().keys(keys)(data);
  // d[0] - нижняя граница, d[1] - верхняя
  // d.data - исходный объект (с 'year')

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

  // Шкала X (Годы)
  const x = d3
    .scaleBand()
    .domain(data.map((d) => d.year))
    .range([0, width])
    .padding(0.1);

  // Шкала Y (Проценты)
  const y = d3.scaleLinear().domain([0, 100]).range([height, 0]);

  // Цветовая шкала
  const color = d3
    .scaleOrdinal()
    .domain(keys)
    .range([COLORS.conflict, COLORS.stable]);

  // Ось X
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end")
    .style("fill", COLORS.text);

  // Ось Y
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
    
  // Подпись оси Y
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

  // Слои
  svg
    .append("g")
    .selectAll("g")
    .data(stackedData)
    .enter()
    .append("g")
    .attr("fill", (d) => color(d.key))
    .selectAll("rect")
    .data((d) => d) // d - это [y0, y1] + data
    .enter()
    .append("rect")
    .attr("x", (d) => x(d.data.year))
    .attr("y", (d) => y(d[1]))
    .attr("height", (d) => y(d[0]) - y(d[1]))
    .attr("width", x.bandwidth())
    .append("title")
    .text((d) => {
      const key = (d[1] === d.data.stable_share) ? "Stable" : "Conflict";
      const pct = (d[1] - d[0]).toFixed(1);
      return `${d.data.year} (${key}): ${pct}%`;
    });

  // Легенда
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
 * 5. Waffle Chart: Глобальные средние
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

  // Настройки "вафли"
  const waffleSize = 10; // 10x10 сетка
  const totalSquares = waffleSize * waffleSize;
  const squareSize = 12;
  const squareGap = 3;
  const waffleWidth = (squareSize + squareGap) * waffleSize - squareGap;
  const waffleHeight = waffleWidth;
  
  // Расстояние между двумя вафлями
  const waffleSpacing = 40;

  // Общая ширина двух вафель
  const totalWafflesWidth = waffleWidth * 2 + waffleSpacing;
  
  // Центрируем группу вафель
  const startX = (width - totalWafflesWidth) / 2;
  const startY = (height - waffleHeight) / 2; // Центрируем по высоте

  const waffleGroups = svg
    .selectAll(".waffle-group")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "waffle-group")
    .attr("transform", (d, i) => {
      // Размещаем две вафли рядом
      const x = startX + i * (waffleWidth + waffleSpacing);
      return `translate(${x}, ${startY})`;
    });

  waffleGroups.each(function (d) {
    const group = d3.select(this);
    const numFilled = Math.round(d.avg_out_of_school_pct); // 11.9 -> 12, 6.49 -> 6
    
    // Создаем данные для 100 квадратов
    const waffleData = d3.range(totalSquares).map((i) => {
      return {
        isFilled: i < numFilled,
      };
    });
    
    const isConflict = d.conflict_status === "Conflict";
    const fillColor = isConflict ? COLORS.conflict : COLORS.stable;

    // Название (Conflict / Stable)
    group
      .append("text")
      .attr("x", waffleWidth / 2)
      .attr("y", -20) // Над вафлей
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "600")
      .style("fill", COLORS.text)
      .text(d.conflict_status);
      
    // Процент
    group
      .append("text")
      .attr("x", waffleWidth / 2)
      .attr("y", -5)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", fillColor) // Окрашиваем процент
      .text(`${d.avg_out_of_school_pct.toFixed(1)}%`);


    // Квадраты
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
 * 6. Histogram: Сравнение распределений
 * Файл: histogram.csv
 *
 * Примечание: Данные уже сгруппированы, поэтому мы используем
 * сгруппированный барный график для отображения гистограммы.
 * ========================================================================
 */
async function drawHistogram(container, dataUrl, COLORS) {
  const data = await d3.csv(dataUrl, d3.autoType);

  // 1. Данные уже сгруппированы. Нам нужно преобразовать их.
  const dataByBin = d3.group(data, (d) => d.bin_mid);

  const groupedData = Array.from(dataByBin.entries())
    .map(([bin, values]) => {
      // Создаем читаемую метку бина
      const binStart = values[0].bin_start;
      const binEnd = values[0].bin_end;
      const binLabel = `${binStart.toFixed(0)}–${binEnd.toFixed(0)}%`;

      return {
        bin: binLabel,
        bin_start: binStart, // Для сортировки
        Conflict:
          values.find((d) => d.conflict_status === "Conflict")?.count || 0,
        Stable:
          values.find((d) => d.conflict_status === "Stable")?.count || 0,
      };
    })
    // Сортируем по началу бина, а не по алфавиту
    .sort((a, b) => a.bin_start - b.bin_start);
    
  // 2. Отфильтровываем бины, где оба значения 0, для ясности
  const filteredData = groupedData.filter(d => d.Conflict > 0 || d.Stable > 0);

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

  // Шкала X0 (для бинов)
  const x0 = d3
    .scaleBand()
    .domain(filteredData.map((d) => d.bin))
    .rangeRound([0, width])
    .paddingInner(0.1);

  // Шкала X1 (для 'Conflict' и 'Stable' внутри бина)
  const x1 = d3
    .scaleBand()
    .domain(keys)
    .rangeRound([0, x0.bandwidth()])
    .padding(0.05);

  // Шкала Y
  const y = d3
    .scaleLinear()
    // Используем логарифмическую шкалу, так как 'Stable' имеет очень высокие пики
    .domain([0.1, d3.max(filteredData, (d) => Math.max(d.Conflict, d.Stable))])
    .nice()
    .rangeRound([height, 0]);

  const color = d3
    .scaleOrdinal()
    .domain(keys)
    .range([COLORS.conflict, COLORS.stable]);

  // Ось X
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x0))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end")
    .style("fill", COLORS.text);

  // Ось Y
  svg
    .append("g")
    .call(
      d3
        .axisLeft(y)
        .ticks(5, ".1s") // Формат для лог. шкалы
    )
    .call((g) => g.selectAll(".domain, .tick line").style("stroke", "#555"))
    .call((g) => g.selectAll("text").style("fill", COLORS.text));

  // Подпись оси Y
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

  // Группы столбцов
  const groups = svg
    .selectAll(".group")
    .data(filteredData)
    .enter()
    .append("g")
    .attr("class", "group")
    .attr("transform", (d) => `translate(${x0(d.bin)},0)`);

  // Столбцы
  groups
    .selectAll("rect")
    .data((d) => keys.map((key) => ({ key, value: d[key], bin: d.bin })))
    .enter()
    .append("rect")
    .attr("x", (d) => x1(d.key))
    // Используем y(Math.max(0.1, d.value)) для лог. шкалы, чтобы 0 не ломал график
    .attr("y", (d) => y(Math.max(0.1, d.value)))
    .attr("width", x1.bandwidth())
    .attr("height", (d) => height - y(Math.max(0.1, d.value)))
    .attr("fill", (d) => color(d.key))
    .style("opacity", 0.8) // Добавляем прозрачность для наложения
    .append("title")
    .text((d) => `Bin ${d.bin} (${d.key}): ${d.value.toFixed(0)}`);
  
  // Легенда (как в GroupedBarchart)
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
 * 7. Violin Plot: Полное распределение
 * Файл: violin_box_raw.csv
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

  // Шкала Y (Числовая)
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.out_of_school_pct)])
    .nice()
    .range([height, 0]);
  
  svg
    .append("g")
    .call(d3.axisLeft(y).ticks(5).tickFormat((d) => `${d.toFixed(0)}%`))
    .call((g) => g.selectAll(".domain, .tick line").style("stroke", "#555"))
    .call((g) => g.selectAll("text").style("fill", COLORS.text));

  // Шкала X (Категориальная)
  const x = d3
    .scaleBand()
    .domain(["Conflict", "Stable"])
    .range([0, width])
    .padding(0.2); // Отступ между скрипками
  
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .call((g) => g.selectAll(".domain, .tick line").style("stroke", "#555"))
    .call((g) => g.selectAll("text").style("fill", COLORS.text));

  // --- Создание "скрипок" ---
  // 1. Создаем "bins" (гистограмму) для каждого статуса
  const histogram = d3
    .histogram()
    .domain(y.domain())
    .thresholds(y.ticks(20)) // 20 бинов для гладкости
    .value((d) => d.out_of_school_pct);

  const conflictBins = histogram(data.filter((d) => d.conflict_status === "Conflict"));
  const stableBins = histogram(data.filter((d) => d.conflict_status === "Stable"));

  // 2. Находим максимальную "длину" (кол-во) в бине
  const maxBinLength = Math.max(
    d3.max(conflictBins, (d) => d.length),
    d3.max(stableBins, (d) => d.length)
  );

  // 3. Шкала для "ширины" скрипки
  const violinWidthScale = d3
    .scaleLinear()
    .domain([0, maxBinLength])
    .range([0, x.bandwidth() / 2]); // Ширина от 0 до половины полосы

  // 4. Генератор "области"
  const area = d3
    .area()
    .x0((d) => -violinWidthScale(d.length)) // Левая сторона
    .x1((d) => violinWidthScale(d.length)) // Правая сторона
    .y((d) => y((d.x0 + d.x1) / 2)) // Центр бина
    .curve(d3.curveCatmullRom); // Сглаживание

  // 5. Отрисовка "Conflict"
  svg
    .append("path")
    .datum(conflictBins)
    .attr(
      "transform",
      `translate(${x("Conflict") + x.bandwidth() / 2}, 0)` // Сдвиг в центр
    )
    .attr("d", area)
    .style("fill", COLORS.conflict)
    .style("opacity", 0.7)
    .append("title")
    .text("Conflict Distribution");

  // 6. Отрисовка "Stable"
  svg
    .append("path")
    .datum(stableBins)
    .attr(
      "transform",
      `translate(${x("Stable") + x.bandwidth() / 2}, 0)` // Сдвиг в центр
    )
    .attr("d", area)
    .style("fill", COLORS.stable)
    .style("opacity", 0.7)
    .append("title")
    .text("Stable Distribution");
}

/**
 * ========================================================================
 * 8. Boxplot (Ящик с усами)
 * Файл: box_summary.csv
 *
 * Примечание: Мы используем пред-агрегированные данные.
 * ========================================================================
 */
async function drawBoxplot(container, dataUrl, COLORS) {
  const data = await d3.csv(dataUrl, d3.autoType);

  // 1. Преобразуем "длинные" данные в "широкие"
  // Группируем по 'conflict_status'
  const nested = d3.group(data, d => d.conflict_status);
  
  // Преобразуем в { status: "Conflict", stats: { median: 16.2, q1: 5.4, ... } }
  const summaryData = Array.from(nested.entries()).map(([status, values]) => {
      const stats = {};
      values.forEach(v => {
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

  // Шкала Y (Числовая)
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(summaryData, d => d.stats.whisker_high)])
    .nice()
    .range([height, 0]);
  
  svg
    .append("g")
    .call(d3.axisLeft(y).ticks(5).tickFormat((d) => `${d.toFixed(0)}%`))
    .call((g) => g.selectAll(".domain, .tick line").style("stroke", "#555"))
    .call((g) => g.selectAll("text").style("fill", COLORS.text));

  // Шкала X (Категориальная)
  const x = d3
    .scaleBand()
    .domain(["Conflict", "Stable"])
    .range([0, width])
    .padding(0.4); // Широкий отступ для "ящиков"
  
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .call((g) => g.selectAll(".domain, .tick line").style("stroke", "#555"))
    .call((g) => g.selectAll("text").style("fill", COLORS.text));

  // --- Отрисовка ящиков ---
  const boxWidth = x.bandwidth();

  summaryData.forEach(d => {
    const { status, stats } = d;
    const center = x(status) + boxWidth / 2;
    const color = (status === "Conflict") ? COLORS.conflict : COLORS.stable;

    // Вертикальная линия (усы)
    svg
      .append("line")
      .attr("x1", center)
      .attr("x2", center)
      .attr("y1", y(stats.whisker_low))
      .attr("y2", y(stats.whisker_high))
      .attr("stroke", color)
      .attr("stroke-width", 2);

    // Ящик (IQR)
    svg
      .append("rect")
      .attr("x", x(status))
      .attr("y", y(stats.q3))
      .attr("height", y(stats.q1) - y(stats.q3))
      .attr("width", boxWidth)
      .attr("fill", color)
      .style("opacity", 0.7)
      .append("title")
      .text(`${status} (IQR: ${stats.q1.toFixed(1)}% - ${stats.q3.toFixed(1)}%)`);

    // Линия медианы
    svg
      .append("line")
      .attr("x1", x(status))
      .attr("x2", x(status) + boxWidth)
      .attr("y1", y(stats.median))
      .attr("y2", y(stats.median))
      .attr("stroke", "#FFFFFF") // Белая линия для контраста
      .attr("stroke-width", 2)
      .append("title")
      .text(`${status} (Median: ${stats.median.toFixed(1)}%)`);
      
    // "Засечки" на усах
    svg.append("line")
      .attr("x1", center - boxWidth / 4)
      .attr("x2", center + boxWidth / 4)
      .attr("y1", y(stats.whisker_low))
      .attr("y2", y(stats.whisker_low))
      .attr("stroke", color)
      .attr("stroke-width", 2);
      
    svg.append("line")
      .attr("x1", center - boxWidth / 4)
      .attr("x2", center + boxWidth / 4)
      .attr("y1", y(stats.whisker_high))
      .attr("y2", y(stats.whisker_high))
      .attr("stroke", color)
      .attr("stroke-width", 2);
  });
}