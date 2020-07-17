// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
    // create scales
    
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
        d3.max(data, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;
  
}

// function used for updating y-scale var upon click on axis label
function yScale(data, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenYAxis]) * 0.8,
        d3.max(data, d => d[chosenYAxis]) * 1.2
      ])
      .range([height, 0]);
  
    return yLinearScale;
  
}

function renderYAxes(newXScale, yAxis) {
    var leftAxis = d3.axisLeft(newXScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
}

// function used for updating circles group with a transition to
  // new circles
function renderXCircles(circlesGroup, newXScale, chosenXAxis) {
  
    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
  
    return circlesGroup;
}

function renderYCircles(circlesGroup, newYScale, chosenYAxis) {
  
    circlesGroup.transition()
      .duration(1000)
      .attr("cy", d => newYScale(d[chosenYAxis]))
  
    return circlesGroup;
}

 // function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  
}

function renderXText(circlesGroup, newXScale, chosenXAxis){
    circlesGroup.transition()
        .duration(1000)
        .attr("dx", d=> newXScale(d[chosenXAxis]));

    return circlesGroup;
}

function renderYText(circlesGroup,newYScale,chosenYAxis){
    circlesGroup.transition()
        .duration(1000)
        .attr("dy", d=> newYScale(d[chosenYAxis]));
    return circlesGroup;
}

 // function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
  
    var x_label;
    var y_label;
    //conditionals for X axis 
    //How do Route these from my Flask?

    if (chosenXAxis === "income") {
      x_label = "Avg Income: ";
    }
    else if (chosenXAxis === "age") {
        x_label = "Median Age: ";
      }
    else {
      x_label = "In Poverty: ";
    }

    //conditions for Y axis 
    if (chosenYAxis === "obesity"){
      y_label = "Obesity %: ";
    }

    else if (chosenYAxis == "smokes"){
      y_label = "Smokes: "
    }
    else {
      y_label = "Lacks Healthcare: "
    }
  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>${x_label} ${d[chosenXAxis]} <br> ${y_label} ${d[chosenYAxis]}`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
}


function plotFoodInsecurityAxes(data){
// parse data
  data.forEach(function(d) {
    d.poverty = +d.poverty;
    d.obesity = +d.obesity;
    d.healthcare = +d.healthcare;
    d.income = +d.income;
    d.smokes = +d.smokes;
    d.age = +d.age;
});

  // xLinearScale and yLinearScale function above csv import
  var xLinearScale = xScale(data, chosenXAxis);
  var yLinearScale = yScale(data,chosenYAxis);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    //.classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    //.classed("y-axis",true)
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("g");

  var circlesXY = circlesGroup.append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 17)
    .attr("fill", "orange")
    .attr("opacity", ".4");

  var circlesText = circlesGroup.append("text")
    .text(d => d.abbr)
    .attr("dx", d=> xLinearScale(d[chosenXAxis]))
    .attr("dy",d=> yLinearScale(d[chosenYAxis]))
    .style("text-anchor","middle")
    .style("fill","black")
    .style("font","10px times");
  

  
  

  // Create group for two x-axis labels
  var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("Poverty, Pop (%)");

  var ageLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Median age");

  var incomeLabel = xlabelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 60)
  .attr("value","income") // value to grab for event listener
  .classed("inactive", true)
  .text("Household Median Income");  

  // append y axis
  var ylabelsGroup = chartGroup.append("g");

  var lackshealthcareLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 60 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("value","healthcare")
    .classed("active", true)
    .text("Lacks Healthcare");

  var obesityLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 20 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("value","obesity")
    .classed("inactive", true)
    .text("Obesity"); 

  var smokesLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 40 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("value","smokes")
    .classed("inactive", true)
    .text("Smokes");



  // updateToolTip function above csv import
  circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  // x axis labels event listener
  xlabelsGroup.selectAll("text")
    .on("click", function() {
  //     // get value of selection
      var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {

          // replaces chosenXAxis with value
          chosenXAxis = value;
          console.log(chosenXAxis)

          // functions here found above csv import
          // updates x scale for new data
          xLinearScale = xScale(data, chosenXAxis);

          // updates x axis with transition
          xAxis = renderXAxes(xLinearScale, xAxis);

          // updates circles with new x or y values
          circlesXY = renderXCircles(circlesXY, xLinearScale, chosenXAxis);

          circlesText = renderXText(circlesText, xLinearScale, chosenXAxis);

          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis,chosenYAxis, circlesGroup);

          // changes classes to change bold text
          console.log(chosenXAxis)
          if (chosenXAxis === "income") {
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            incomeLabel
              .classed("active", true)
              .classed("inactive", false);
          } else if (chosenXAxis === "age") {
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            ageLabel
              .classed("active", true)
              .classed("inactive", false);
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
          } else  {
            povertyLabel
              .classed("active", true)
              .classed("inactive", false);
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
          }
        };
  })
  ylabelsGroup.selectAll("text")
    .on("click", function() {
  //     // get value of selection
      var value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {
          // replaces chosenXAxis with value
          chosenYAxis = value;
          console.log(chosenYAxis)

          // functions here found above csv import
          // updates x scale for new data
          yLinearScale = yScale(data, chosenYAxis);

          // updates x axis with transition
          yAxis = renderYAxes(yLinearScale, yAxis);

          // updates circles with new x or y values
          circlesXY = renderYCircles(circlesXY, yLinearScale, chosenYAxis);

          circlesText = renderYText(circlesText, yLinearScale, chosenYAxis);
          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis,chosenYAxis, circlesGroup);

          // changes classes to change bold text
          console.log(chosenYAxis)

          if (chosenYAxis === "obesity") {
            obesityLabel
              .classed("active", true)
              .classed("inactive", false);
            smokesLabel
              .classed("active", false)
              .classed("inactive", true);
            lackshealthcareLabel
              .classed("active", false)
              .classed("inactive", true);
          } else if (chosenYAxis === "smokes") {
            obesityLabel
              .classed("active", false)
              .classed("inactive", true);
            smokesLabel
              .classed("active", true)
              .classed("inactive", false);
            lackshealthcareLabel
              .classed("active", false)
              .classed("inactive", true);
          } else  {
            obesityLabel
              .classed("active", false)
              .classed("inactive", true);
            smokesLabel
              .classed("active", false)
              .classed("inactive", true);
            lackshealthcareLabel
              .classed("active", true)
              .classed("inactive", false);
          }

        }
});

};