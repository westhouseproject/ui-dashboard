﻿var h = 1435;
var w = 2030;
var svg;
var infoPanel;
var energyGoalProgress = 0.4;
var gasGoalProgress = 0;
var energyGoalProgressToday = 0.02;
var gasGoalProgressToday = 0;

var energyProducedToday = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
var energyProducedAve = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
var energyProducedYes = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
var energyProducedMon = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
var energyProducedYear = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

var energyConsumedToday = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
var energyConsumedAve = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
var energyConsumedYes = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
var energyConsumedMon = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
var energyConsumedYear = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

var gasToday = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
var gasAve = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
var gasYes = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
var gasMon = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
var gasYear = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

var currentTime = new Date();
var weatherToday = new Array("sunny","sunny","cloudy","cloudy","cloudy","sunny","sunny","sunny","sunny","sunny","sunny","sunny",
                     "sunny","sunny","sunny","sunny","sunny","sunny","cloudy","cloudy","rain","rain","rain","shower");

var selectedEnergyTotal = 1;
var selectedEnergyCon = 0;
var selectedEnergyPro = 0;
var selectedEnergyAve = 0;
var selectedEnergyYes = 0;
var selectedEnergyMon = 0;
var selectedEnergyYear = 0;
var selectedGasAve = 0;
var selectedGasYes = 0;
var selectedGasMon = 0;
var selectedGasYear = 0;

var energyChart, gasChart;


$(function() {
    // If we want production data, then the time series is solar_pv_power
	
    var client = new DBMSClient('admin', 'blahblah', 'http://142.58.183.207:4427');
    console.log("loading data...");
    client.getData('energy_consumption', { interval:'1h', from:'2d' }, function (err, data) { 
        if (err) { 
            return alert('Data Access Error'); 
        }    
        getDayData(data);

        client.getData('energy_consumption', { from:'1mo', groupbyhour:'mean' }, function (err, data) { 
            if (err) { 
                return alert('Data Access Error'); 
            }    
            getAveData(data, 'month');

            client.getData('energy_consumption', { from:'1y', groupbyhour:'mean' }, function (err, data) { 
                if (err) { 
                    return alert('Data Access Error'); 
                }    
                getAveData(data, 'year');
                
                client.getData('energy_consumption', { groupbyhour:'mean' }, function (err, data) { 
                    if (err) { 
                        return alert('Data Access Error'); 
                    }    
                    getAveData(data, 'all');

                    client.getData('solar_pv_power', { interval:'1h', from:'2d' }, function (err, data) { 
	                    if (err) { 
	                        return alert('Data Access Error'); 
	                    } 
	                    getProDayData(data)

	                    client.getData('solar_pv_power', { from:'1mo', groupbyhour:'mean' }, function (err, data) { 
				            if (err) { 
				                return alert('Data Access Error'); 
				            }    
				            getProAveData(data, 'month');

				            client.getData('solar_pv_power', { from:'1y', groupbyhour:'mean' }, function (err, data) { 
				                if (err) { 
				                    return alert('Data Access Error'); 
				                }    
				                getProAveData(data, 'year');
				                
				                client.getData('solar_pv_power', { groupbyhour:'mean' }, function (err, data) { 
				                    if (err) { 
				                        return alert('Data Access Error'); 
				                    }    
				                    getProAveData(data, 'all');
	                    

				                    console.log("consumed today: "+energyConsumedToday);
				                    console.log("consumed yes: "+energyConsumedYes);
				                    console.log("consumed month: "+energyConsumedMon);
				                    console.log("consumed year: "+energyConsumedYear);
				                    console.log("consumed ave: "+energyConsumedAve);
				                    console.log("produced today: "+energyProducedToday);
				                    console.log("produced yes: "+energyProducedYes);
				                    console.log("produced month: "+energyProducedMon);
				                    console.log("produced year: "+energyProducedYear);
				                    console.log("produced ave: "+energyProducedAve);
				                    drawDashboard("body");

				                    var interval = setInterval(function() {
				                        client.getData('energy_consumption', { interval:'1h' }, function (err, data) { 
				                            if (err) { 
				                                return alert('Data Access Error'); 
				                            }    
				                            getDayData(data);

				                            client.getData('energy_consumption', { from:'1mo', groupbyhour:'mean' }, function (err, data) { 
				                                if (err) { 
				                                    return alert('Data Access Error'); 
				                                }    
				                                getAveData(data, 'month');

				                                client.getData('energy_consumption', { from:'1y', groupbyhour:'mean' }, function (err, data) { 
				                                    if (err) { 
				                                        return alert('Data Access Error'); 
				                                    }    
				                                    getAveData(data, 'year');
				                                    
				                                    client.getData('energy_consumption', { groupbyhour:'mean' }, function (err, data) { 
				                                        if (err) { 
				                                            return alert('Data Access Error'); 
				                                        }    
				                                        getAveData(data, 'all');
				                                            
									                    console.log("consumed today: "+energyConsumedToday);
									                    console.log("consumed yes: "+energyConsumedYes);
									                    console.log("consumed month: "+energyConsumedMon);
									                    console.log("consumed year: "+energyConsumedYear);
									                    console.log("consumed ave: "+energyConsumedAve);
									                    console.log("produced today: "+energyProducedToday);
									                    console.log("produced yes: "+energyProducedYes);
									                    console.log("produced month: "+energyProducedMon);
									                    console.log("produced year: "+energyProducedYear);
									                    console.log("produced ave: "+energyProducedAve);
				                                        updateDashboard();  
				                                    });
				                                });
				                            });    
				                        });
				                    }, 100000);
								});
							});
						});
					});
                });
            });
        });   
    });
});



function updateDashboard() {
	drawEnergyLineChart(energyChart);
	drawGasLineChart(gasChart);
}

function getDayData(data) {
	var n = data.length;

	for(var i = 0; i < n; i++) {
		var date = new Date(data[i].time);
		var yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		var h = date.getHours();
		if(date.getDate() == currentTime.getDate())
			energyConsumedToday[h] = data[i].value;
		else if(date.getDate() == yesterday.getDate()){
			energyConsumedYes[h] = data[i].value;
		}
			
	}
}

function getProDayData(data) {
	var n = data.length;
	    console.log(data);
	for(var i = 0; i < n; i++) {
		var date = new Date(data[i].time);
		var yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		var h = date.getHours();
		if(date.getDate() == currentTime.getDate())
			energyProducedToday[h] = data[i].value;
		else if(date.getDate() == yesterday.getDate()){
			energyProducedYes[h] = data[i].value;
		}
			
	}
}

function getAveData(data, interval) {
    var n = data.length;
    for(var i = 0; i < n; i++) {
        if(interval == "month"){    
            energyConsumedMon[i] = data[i].value;        
        }
        if(interval == "year"){
            energyConsumedYear[i] = data[i].value;           
        }
        if(interval == "all"){
            energyConsumedAve[i] = data[i].value;            
        }
    }
}

function getProAveData(data, interval) {
    var n = data.length;
    for(var i = 0; i < n; i++) {
        if(interval == "month"){    
            energyProducedMon[i] = data[i].value;        
        }
        if(interval == "year"){
            energyProducedYear[i] = data[i].value;           
        }
        if(interval == "all"){
            energyProducedAve[i] = data[i].value;            
        }
    }
}


function findMax(data, data1, data2, data3, data4) {
    var max = 0;
    for(var i = 0; i < currentTime.getHours(); i++) {
        if (Math.abs(data[i]) > max)
            max = Math.abs(data[i]); 
    }
    for(var i = 0; i < currentTime.getHours(); i++) {
        if (Math.abs(data1[i]) > max)
            max = Math.abs(data1[i]); 
    }
    for(var i = 0; i < currentTime.getHours(); i++) {
        if (Math.abs(data2[i]) > max)
            max = Math.abs(data2[i]); 
    }
    for(var i = 0; i < currentTime.getHours(); i++) {
        if (Math.abs(data3[i]) > max)
            max = Math.abs(data3[i]); 
    }
    for(var i = 0; i < currentTime.getHours(); i++) {
        if (Math.abs(data4[i]) > max)
            max = Math.abs(data4[i]); 
    }
	if(max == 0)
		max = 1;
    return max;
}


function drawDashboard(dom) {
    svg = d3.select(dom)
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    drawMid(); 
}


function drawMid() {
    svg.append("rect")
       .attr("x", 0)
       .attr("y", 0)
       .attr("width", w)
       .attr("height", h)
       .attr("class", "bgmid");   
 
     svg.append("rect")
       .attr("x", w*59/198)
       .attr("y", 0)
       .attr("width", w*139/198)
       .attr("height", h)
       .attr("class", "bgchart"); 
 
     svg.append("line")
       .attr("x1", 0)
       .attr("y1", h*63/147)
       .attr("x2", w)
       .attr("y2", h*63/147)
       .attr("class", "seg"); 
       
    drawEnergyChart(); 
    drawGasChart();
    
    drawEnergyGoal();
    drawGasGoal();
}

function drawInfo(type){
	var infoString;
	var gx = w*20/198; 
	var gy = h*10/147;
	var gl = w*158/198;
	var gh = h*107/147;
	
	if(infoPanel != null)
		infoPanel.remove();
		
	infoPanel = svg.append("svg:g");
	infoPanel.append("rect")
    	.attr("x", gx)
    	.attr("y", gy)
    	.attr("width", gl)
    	.attr("height", gh);
		
	closeBtn = infoPanel.append("text")
		.attr("x", w*99/198)
		.attr("y", h*110/147)
		.attr("class", "closeBtn")
		.attr("text-anchor", "middle")
		.text("CLOSE")
		.style("cursor", "pointer");
		
	closeBtn.on("mouseup", function(evt){
		closeBtn.attr("opacity", 1);
		infoPanel.remove();
	});
		
	if (type == "energyGoal"){
		infoString = "energy goal";
		infoPanel.select("rect").attr("class", "energyInfo"); 
	}
	else if (type == "gasGoal"){
		infoString = "gas goal";
		infoPanel.select("rect").attr("class", "gasInfo"); 
	}
	else if (type == "energyChart"){
		infoString = "energy chart";
		infoPanel.select("rect").attr("class", "energyInfo"); 
	}
	else if (type == "gasChart"){
		infoString = "gas chart";
		infoPanel.select("rect").attr("class", "gasInfo"); 
	}

	
}

function drawEnergyGoal() {
    var offSetX = 0;
    var offSetY = h/147;
    var wd = w*55/198;
    var ht = h*55/147;
    energyGoal = svg.append("svg:g").attr("transform", "translate(" + offSetX + "," + offSetY + ")").attr("class", "energyGoal");
 
    energyGoal.append("text")
        .text("YOUR ELECTRICITY GOAL")
        .attr("x", w/198)
        .attr("y", h*4/147)
        .attr("font-size", h*4/147)
        .attr("font-family", "sans-serif")
        .attr("fill", "#716e72");
        
    infoButton = energyGoal.append("image")
        .attr("x", w*53/198)
        .attr("y", -h*0.5/147)
        .attr("width", w*5/198)
        .attr("height", h*5/147)
        .attr("xlink:href", "./images/info.png")
        .style("cursor", "pointer");   
        
    infoButton.on("mouseup", function(evt){
        //alert('Info');
		drawInfo("energyGoal");
    });
        
   var arc = d3.svg.arc()
        .outerRadius(w*23/198)
        .innerRadius(w*17/198)
        .startAngle(0);
        
    var meter = energyGoal.append("g")
        .attr("class", "progress")
        .attr("transform", "translate(" + (w*29/198) + "," + (h*29/147) + ")");

    meter.append("path")
        .attr("class", "energyGoalBg")
        .attr("d", arc.endAngle(2 * Math.PI));        

    var totalprogress = 2 * Math.PI * (energyGoalProgress + energyGoalProgressToday);
    meter.append("path")
        .attr("class", "energyGoalFgT")
        .attr("d", arc.endAngle(totalprogress));   
        
    var progress = 2 * Math.PI * energyGoalProgress;
    meter.append("path")
        .attr("class", "energyGoalFg")
        .attr("d", arc.endAngle(progress));   
        
    energyGoal.append("text")
        .text("CURRENT PROGRESS: " + ((energyGoalProgress + energyGoalProgressToday)*100).toFixed(2) + "%")
        .attr("x", w/198)
        .attr("y", h*57/147)
        .attr("font-size", h*3/147)
        .attr("font-family", "sans-serif")
		.attr("class", "energyGoalText1");
 
    energyGoal.append("text")
        .text("YOU HAVE")
        .attr("x", w*21/198)
        .attr("y", h*18/147)
        .attr("font-size", h*3/147)
        .attr("font-family", "sans-serif")
        .attr("class", "energyGoalText1");

    energyGoal.append("text")
        .text("CONTRIBUTED")
        .attr("x", w*18/198)
        .attr("y", h*22/147)
        .attr("font-size", h*3/147)
        .attr("font-family", "sans-serif")
        .attr("class", "energyGoalText1");

  energyGoal.append("text")
        .text((energyGoalProgressToday*100).toFixed(2)+"%")
        .attr("x", w*17.5/198)
        .attr("y", h*32/147)
        .attr("font-size", h*9/147)
        .attr("font-family", "sans-serif")
		.attr("class", "energyGoalText2");

  energyGoal.append("text")
        .text("TODAY")
        .attr("x", w*22/198)
        .attr("y", h*39/147)
        .attr("font-size", h*4/147)
        .attr("font-family", "sans-serif")
        .attr("class", "energyGoalText1");
}

function drawGasGoal() {
    var offSetX = 0;
    var offSetY = h*66/147;
    var wd = w*55/198;
    var ht = h*55/147;
    gasGoal = svg.append("svg:g").attr("transform", "translate(" + offSetX + "," + offSetY + ")").attr("class", "gasGoal");

    gasGoal.append("text")
        .text("YOUR GAS GOAL")
        .attr("x", w/198)
        .attr("y", h*3/147)
        .attr("font-size", h*4/147)
        .attr("font-family", "sans-serif")
        .attr("fill", "#716e72");
        
    infoButton = gasGoal.append("image")
        .attr("x", w*53/198)
        .attr("y", -h*1.5/147)
        .attr("width", w*5/198)
        .attr("height", h*5/147)
        .attr("xlink:href", "./images/info.png")
        .style("cursor", "pointer"); 
        
    infoButton.on("mouseup", function(evt){
        //alert('Info');
		drawInfo("gasGoal");
    });
        
   var arc = d3.svg.arc()
        .outerRadius(w*23/198)
        .innerRadius(w*17/198)
        .startAngle(0);
        
    var meter = gasGoal.append("g")
        .attr("class", "progress")
        .attr("transform", "translate(" + (w*29/198) + "," + (h*29/147) + ")");

    meter.append("path")
        .attr("class", "gasGoalBg")
        .attr("d", arc.endAngle(2 * Math.PI));  
 
    var totalprogress = 2 * Math.PI * (gasGoalProgress + gasGoalProgressToday);
    meter.append("path")
        .attr("class", "gasGoalFgT")
        .attr("d", arc.endAngle(totalprogress));  
        
    var progress = 2 * Math.PI * gasGoalProgress;
    meter.append("path")
        .attr("class", "gasGoalFg")
        .attr("d", arc.endAngle(progress));   
        
   gasGoal.append("text")
        .text("CURRENT PROGRESS: " + ((gasGoalProgress + gasGoalProgressToday)*100).toFixed(2) + "%")
        .attr("x", w/198)
        .attr("y", h*57/147)
        .attr("font-size", h*3/147)
        .attr("font-family", "sans-serif")
		.attr("class", "gasGoalText1");

  gasGoal.append("text")
        .text("YOU HAVE")
        .attr("x", w*21/198)
        .attr("y", h*18/147)
        .attr("font-size", h*3/147)
        .attr("font-family", "sans-serif")
        .attr("class", "gasGoalText1");

  gasGoal.append("text")
        .text("CONTRIBUTED")
        .attr("x", w*18/198)
        .attr("y", h*22/147)
        .attr("font-size", h*3/147)
        .attr("font-family", "sans-serif")
        .attr("class", "gasGoalText1");

  gasGoal.append("text")
        .text((gasGoalProgressToday*100).toFixed(2)+"%")
        .attr("x", w*17.5/198)
        .attr("y", h*32/147)
        .attr("font-size", h*9/147)
        .attr("font-family", "sans-serif")
		.attr("class", "gasGoalText2");

  gasGoal.append("text")
        .text("TODAY")
        .attr("x", w*22/198)
        .attr("y", h*39/147)
        .attr("font-size", h*4/147)
        .attr("font-family", "sans-serif")
        .attr("class", "gasGoalText1");
}

function drawEnergyChart() {
    var offSetX = w*59/198;
    var offSetY = h/147;

    energyChart = svg.append("svg:g").attr("transform", "translate(" + offSetX + "," + offSetY + ")").attr("class", "energyChart");
    
    energyChart.append("text")
        .text("TODAY'S ELECTRICITY ACTIVITY (kWh)")
        .attr("x", w/198)
        .attr("y", h*4/147)
        .attr("font-size", h*4/147)
        .attr("font-family", "sans-serif")
        .attr("fill", "#716e72");
 
    infoButton = energyChart.append("image")
        .attr("x", w*134/198)
        .attr("y", -h*0.5/147)
        .attr("width", w*5/198)
        .attr("height", h*5/147)
        .attr("xlink:href", "./images/info.png")
        .style("cursor", "pointer"); 
    
    infoButton.on("mouseup", function(evt){
        //alert('Info');
		drawInfo("energyChart");
    });
        
    drawEnergyLineChart(energyChart);
    
    drawEnergyControls(energyChart);
}

function drawGasChart() {
    var offSetX = w*59/198;
    var offSetY = h*66/147;

    gasChart = svg.append("svg:g").attr("transform", "translate(" + offSetX + "," + offSetY + ")").attr("class", "gasChart");
    
    gasChart.append("text")
        .text("TODAY'S GAS ACTIVITY (GJ)")
        .attr("x", w/198)
        .attr("y", h*3/147)
        .attr("font-size", h*4/147)
        .attr("font-family", "sans-serif")
        .attr("fill", "#716e72");
 
    infoButton = gasChart.append("image")
        .attr("x", w*134/198)
        .attr("y", -h*1.5/147)
        .attr("width", w*5/198)
        .attr("height", h*5/147)
        .attr("xlink:href", "./images/info.png")
        .style("cursor", "pointer"); 
  
    infoButton.on("mouseup", function(evt){
        //alert('Info');
		drawInfo("gasChart");
    });

    drawGasLineChart(gasChart);
    
    drawGasControls(gasChart);
}

var curEnergyLineChart;

function drawEnergyLineChart(svg) {
    if(curEnergyLineChart != null)
        curEnergyLineChart.remove();
    
    var chart = svg.append("g").attr("class", "energyLineChart"); 
    curEnergyLineChart = chart;
    
    var data = new Array(); 
    var data1 = new Array(); 
    var data2 = new Array(); 
    var data3 = new Array(); 
    var data4 = new Array(); 
                    
    if (selectedEnergyTotal == 1) {
        //for(var i = 0; i < currentTime.getHours(); i++)  {
		for(var i = 0; i < 24; i++)  {
            data.push(energyProducedToday[i]-energyConsumedToday[i]);
            data1.push(energyProducedAve[i]-energyConsumedAve[i]);
            data2.push(energyProducedYes[i]-energyConsumedYes[i]);
            data3.push(energyProducedMon[i]-energyConsumedMon[i]);
            data4.push(energyProducedYear[i]-energyConsumedYear[i]);
        }
    }
    else if (selectedEnergyCon == 1) {
        data = energyConsumedToday;
        data1 = energyConsumedAve;
        data2 = energyConsumedYes;
        data3 = energyConsumedMon;
        data4 = energyConsumedYear;
    }
    else if (selectedEnergyPro == 1) {
        data = energyProducedToday;
        data1 = energyProducedAve;
        data2 = energyProducedYes;
        data3 = energyProducedMon;
        data4 = energyProducedYear;
    }

    var max = findMax(data, data1, data2, data3, data4);  
    

    if (selectedEnergyAve == 1)
        energyLineChart(chart, max, data1, "#878986", "#f5f7f7");
    if (selectedEnergyYes == 1)
        energyLineChart(chart, max, data2, "#878986", "#f5f7f7");
    if (selectedEnergyMon == 1)
        energyLineChart(chart, max, data3, "#878986", "#f5f7f7");
    if (selectedEnergyYear == 1)
        energyLineChart(chart, max, data4, "#878986", "#f5f7f7");

    energyLineChart(chart, max, data, "#4d9db4", "#a1e7f6");  
    
    energyLineChartAxis(chart);
}

function energyLineChartAxis(svg) {
    var wd = w*135/198;
    var ht = h*48/147;
    var maxh = ht/2;
    var startX = w*3/147;
    var interval = wd/25;
    
    svg.append("line")
       .attr("x1", w/198)
       .attr("y1", h*29/147)
       .attr("x2", w*138/198)
       .attr("y2", h*29/147)
       .attr("class", "seg");    
       
   for(var i = 0; i < 24; i = i+3) {
        svg.append("text")
            .text(i+":00")
            .attr("x", startX+i*interval)
            .attr("y", h*33/147)
            .attr("font-size", h*3/147)
            .attr("font-family", "sans-serif")
            .attr("fill", "#716e72");
    }   
}


function energyLineChart(chart, max, data, c1, c2) {
    var wd = w*135/198;
    var ht = h*48/147;
    var maxh = ht/2;
    var startX = w*3/147;
    var interval = wd/25;
    var d, x, y;
    x = startX;
    y = h*29/147 - data[0]*maxh/max;
		
    d = "M " +  x + " " + y + " ";
    for(var i = 0; i < 23; i++) {
        x = startX + (i+1)*interval;
        y = h*29/147 - data[i+1]*maxh/max;
        d = d + "L " + x + " " + y + " ";
        chart.append("circle")
        .attr("cx", startX + i*interval)
        .attr("cy", h*29/147 - data[i]*maxh/max)
        .attr("r", 10)
        .attr("fill", c1)
        .attr("opacity", 0)
        .append("svg:title")
        .text(data[i]+"kwh");
        chart.append("circle")
        .attr("cx", startX + i*interval)
        .attr("cy", h*29/147 - data[i]*maxh/max)
        .attr("r", 2)
        .attr("fill", c1)
        .attr("opacity", 0.6);
    }
    y = h*29/147;
    d = d + "L " + x + " " + y ;
    x = startX;
    d = d + "L " + x + " " + y  + " z";
    chart.append("path")
        .attr("d", d)
        .attr("stroke-width", 2)
        .attr("stroke", c1)
        .attr("fill", c2)
        .attr("opacity", 0.7);
}

var curGasLineChart;
function drawGasLineChart(svg) {
    if(curGasLineChart != null)
        curGasLineChart.remove();
        
    var chart = svg.append("g").attr("class", "gasLineChart"); 
    curGasLineChart = chart;
    
    var data = new Array(); 
    var data1 = new Array(); 
    var data2 = new Array(); 
    var data3 = new Array(); 
    var data4 = new Array(); 

    data = gasToday;
    data1 = gasAve;
    data2 = gasYes;
    data3 = gasMon;
    data4 = gasYear;
    
    var max = findMax(data, data1, data2, data3, data4);
    
    if (selectedGasAve == 1)
        gasLineChart(chart, max, data1, "#878986", "#f5f7f7");
    if (selectedGasYes == 1)
        gasLineChart(chart, max, data2, "#878986", "#f5f7f7");
    if (selectedGasMon == 1)
        gasLineChart(chart, max, data2, "#878986", "#f5f7f7");
    if (selectedGasYear == 1)
        gasLineChart(chart, max, data4, "#878986", "#f5f7f7");
        
    gasLineChart(chart, max, data, "#709c45", "#daebb8");
        
    gasLineChartAxis(chart);

}

function gasLineChartAxis(svg) {
    var wd = w*135/198;
    var ht = h*48/147;
    var maxh = ht/2;
    var startX = w*3/147;
    var interval = wd/25;
    
    svg.append("line")
       .attr("x1", w/198)
       .attr("y1", h*29/147)
       .attr("x2", w*138/198)
       .attr("y2", h*29/147)
       .attr("class", "seg");   
       
   for(var i = 0; i < 24; i = i+3) {
        svg.append("image")
            .attr("x", startX + i*interval)
            .attr("y", h*32/147)
            .attr("width", w*6/198)
            .attr("height", h*6/147)
            .attr("xlink:href", "./images/" + weatherToday[i]+".png"); 
        svg.append("text")
            .text(i+":00")
            .attr("x", startX+i*interval)
            .attr("y", h*33/147)
            .attr("font-size", h*3/147)
            .attr("font-family", "sans-serif")
            .attr("fill", "#716e72");
    }   
}

function gasLineChart(chart, max, data, c1, c2) {
    var wd = w*135/198;
    var ht = h*48/147;
    var maxh = ht/2;
    var startX = w*3/147;
    var interval = wd/25;
    var d, x, y;
    x = startX;
    y = h*29/147 - data[0]*maxh/max;
    d = "M " +  x + " " + y + " ";
    for(var i = 0; i < 23; i++) {
        x = startX + (i+1)*interval;
        y = h*29/147 - data[i+1]*maxh/max;
        d = d + "L " + x + " " + y + " ";
        chart.append("circle")
            .attr("cx", startX + i*interval)
            .attr("cy", h*29/147 - data[i+1]*maxh/max)
            .attr("r", 10)
            .attr("fill", c1)
            .attr("opacity", 0)
            .append("svg:title")
            .text((data[i]));
        chart.append("circle")
            .attr("cx", startX + i*interval)
            .attr("cy", h*29/147 - (data[i])*maxh/max)
            .attr("r", 2)
            .attr("fill", c1)
            .attr("opacity", 0.6);
    }
    y = h*29/147;
    d = d + "L " + x + " " + y ;
    x = startX;
    d = d + "L " + x + " " + y  + " z";
    chart.append("path")
        .attr("d", d)
        .attr("stroke-width", 2)
        .attr("stroke", c1)
        .attr("fill", c2)
        .attr("opacity", 0.7);
}

function drawEnergyControls(svg) {
    var totalButton = svg.append("g")
        .attr("class", "energyButton")
        .style("cursor", "pointer"); 
        
    totalButton.append("rect")
        .attr("x", w/198)
        .attr("y", h*54/147)
        .attr("rx", 3)
        .attr("ry", 3)
        .attr("width", w*9/198)
        .attr("height", h*3/147)
        .attr("class", "energyButtonBg");
        
    totalButton.append("text")
        .text("TOTAL")
        .attr("x", w*2/198)
        .attr("y", h*56.5/147)
        .attr("font-size", h*2/147)
        .attr("font-family", "sans-serif")
        .attr("class", "energyButtonBg");
    
    if (selectedEnergyTotal == 1)
         totalButton.attr("opacity", 0.6);

    totalButton.on("mouseup", function(evt){
        selectedEnergyTotal = 1;
        selectedEnergyCon = 0;
        selectedEnergyPro = 0;
        totalButton.attr("opacity", 0.6);
        consumptionButton.attr("opacity", 1);
        productionButton.attr("opacity", 1);
        drawEnergyLineChart(energyChart);
    });

    var consumptionButton = svg.append("g")
        .attr("class", "energyButton")
        .style("cursor", "pointer"); 
        
    consumptionButton.append("rect")
        .attr("x", w*12/198)
        .attr("y", h*54/147)
        .attr("rx", 3)
        .attr("ry", 3)
        .attr("width", w*18/198)
        .attr("height", h*3/147)
        .attr("class", "energyButtonBg");
        
    consumptionButton.append("text")
        .text("CONSUMPTION")
        .attr("x", w*13/198)
        .attr("y", h*56.5/147)
        .attr("font-size", h*2/147)
        .attr("font-family", "sans-serif")
        .attr("class", "energyButtonBg");

    consumptionButton.on("mouseup", function(evt){
        selectedEnergyTotal = 0;
        selectedEnergyCon = 1;
        selectedEnergyPro = 0;
        consumptionButton.attr("opacity", 0.6);
        totalButton.attr("opacity", 1);
        productionButton.attr("opacity", 1);
        drawEnergyLineChart(energyChart);
    });

    var productionButton = svg.append("g")
        .attr("class", "energyButton")
        .style("cursor", "pointer"); 
        
    productionButton.append("rect")
        .attr("x", w*32/198)
        .attr("y", h*54/147)
        .attr("rx", 3)
        .attr("ry", 3)
        .attr("width", w*15/198)
        .attr("height", h*3/147)
        .attr("class", "energyButtonBg");
        
    productionButton.append("text")
        .text("PRODCTION")
        .attr("x", w*33/198)
        .attr("y", h*56.5/147)
        .attr("font-size", h*2/147)
        .attr("font-family", "sans-serif")
        .attr("class", "energyButtonBg");

    productionButton.on("mouseup", function(evt){
        selectedEnergyTotal = 0;
        selectedEnergyCon = 0;
        selectedEnergyPro = 1;
        productionButton.attr("opacity", 0.6);
        totalButton.attr("opacity", 1);
        consumptionButton.attr("opacity", 1);
        drawEnergyLineChart(energyChart);
    });

    svg.append("text")
        .text("COMPARE TO:")
        .attr("x", w*55/198)
        .attr("y", h*56.7/147)
        .attr("font-size", h*2.4/147)
        .attr("font-family", "sans-serif")
        .attr("class", "energyLabel");   
        
    var averageButton = svg.append("g")
        .attr("class", "energyButton")
        .style("cursor", "pointer"); 
        
    averageButton.append("rect")
        .attr("x", w*73/198)
        .attr("y", h*54/147)
        .attr("rx", 3)
        .attr("ry", 3)
        .attr("width", w*12/198)
        .attr("height", h*3/147)
        .attr("class", "energyButtonBg");
        
    averageButton.append("text")
        .text("AVERAGE")
        .attr("x", w*74/198)
        .attr("y", h*56.5/147)
        .attr("font-size", h*2/147)
        .attr("font-family", "sans-serif")
        .attr("class", "energyButtonBg");

    if (selectedEnergyAve == 1)
         totalButton.attr("opacity", 0.6);
         
    averageButton.on("mouseup", function(evt){
         if (selectedEnergyAve == 0) {
            averageButton.attr("opacity", 0.6);
            selectedEnergyAve = 1;
            drawEnergyLineChart(energyChart);
         }
         else {
            averageButton.attr("opacity", 1);
            selectedEnergyAve = 0;
            drawEnergyLineChart(energyChart);
         }
    });

    var yesterdayButton = svg.append("g")
        .attr("class", "energyButton")
        .style("cursor", "pointer"); 
        
    yesterdayButton.append("rect")
        .attr("x", w*87/198)
        .attr("y", h*54/147)
        .attr("rx", 3)
        .attr("ry", 3)
        .attr("width", w*15/198)
        .attr("height", h*3/147)
        .attr("class", "energyButtonBg");
        
    yesterdayButton.append("text")
        .text("YESTERDAY")
        .attr("x", w*88/198)
        .attr("y", h*56.5/147)
        .attr("font-size", h*2/147)
        .attr("font-family", "sans-serif")
        .attr("class", "energyButtonBg");

    yesterdayButton.on("mouseup", function(evt){
         if (selectedEnergyYes == 0) {
            yesterdayButton.attr("opacity", 0.6);
            selectedEnergyYes = 1;
            drawEnergyLineChart(energyChart);
         }
         else {
            yesterdayButton.attr("opacity", 1);
            selectedEnergyYes = 0;
            drawEnergyLineChart(energyChart);
         }
    });

    var lastmonthButton = svg.append("g")
        .attr("class", "energyButton")
        .style("cursor", "pointer"); 
        
    lastmonthButton.append("rect")
        .attr("x", w*104/198)
        .attr("y", h*54/147)
        .attr("rx", 3)
        .attr("ry", 3)
        .attr("width", w*15/198)
        .attr("height", h*3/147)
        .attr("class", "energyButtonBg");
        
    lastmonthButton.append("text")
        .text("LAST MONTH")
        .attr("x", w*105/198)
        .attr("y", h*56.5/147)
        .attr("font-size", h*2/147)
        .attr("font-family", "sans-serif")
        .attr("class", "energyButtonBg");

    lastmonthButton.on("mouseup", function(evt){
         if (selectedEnergyMon == 0) {
            lastmonthButton.attr("opacity", 0.6);
            selectedEnergyMon = 1;
            drawEnergyLineChart(energyChart);
         }
         else {
            lastmonthButton.attr("opacity", 1);
            selectedEnergyMon = 0;
            drawEnergyLineChart(energyChart);
         }
    });

    var lastyearButton = svg.append("g")
        .attr("class", "energyButton")
        .style("cursor", "pointer"); 
        
    lastyearButton.append("rect")
        .attr("x", w*121/198)
        .attr("y", h*54/147)
        .attr("rx", 3)
        .attr("ry", 3)
        .attr("width", w*14/198)
        .attr("height", h*3/147)
        .attr("class", "energyButtonBg");
        
    lastyearButton.append("text")
        .text("LAST YEAR")
        .attr("x", w*122/198)
        .attr("y", h*56.5/147)
        .attr("font-size", h*2/147)
        .attr("font-family", "sans-serif")
        .attr("class", "energyButtonBg");

    lastyearButton.on("mouseup", function(evt){
         if (selectedEnergyYear == 0) {
            lastyearButton.attr("opacity", 0.6);
            selectedEnergyYear = 1;
            drawEnergyLineChart(energyChart);
         }
         else {
            lastyearButton.attr("opacity", 1);
            selectedEnergyYear = 0;
            drawEnergyLineChart(energyChart);
         }
    });
}

function drawGasControls(svg) {
    svg.append("text")
        .text("COMPARE TO:")
        .attr("x", w*55/198)
        .attr("y", h*56.7/147)
        .attr("font-size", h*2.4/147)
        .attr("font-family", "sans-serif")
        .attr("class", "gasLabel");   

    var averageButton = svg.append("g")
        .attr("class", "gasButton")
        .style("cursor", "pointer"); 
        
    averageButton.append("rect")
        .attr("x", w*73/198)
        .attr("y", h*54/147)
        .attr("rx", 3)
        .attr("ry", 3)
        .attr("width", w*12/198)
        .attr("height", h*3/147)
        .attr("class", "gasButtonBg");
        
    averageButton.append("text")
        .text("AVERAGE")
        .attr("x", w*74/198)
        .attr("y", h*56.5/147)
        .attr("font-size", h*2/147)
        .attr("font-family", "sans-serif")
        .attr("class", "gasButtonBg");

    averageButton.on("mouseup", function(evt){
         if (selectedGasAve == 0) {
            averageButton.attr("opacity", 0.6);
            selectedGasAve = 1;
            drawGasLineChart(gasChart);
         }
         else {
            averageButton.attr("opacity", 1);
            selectedGasAve = 0;
            drawGasLineChart(gasChart);
         }
    });

    var yesterdayButton = svg.append("g")
        .attr("class", "gasButton")
        .style("cursor", "pointer"); 
        
    yesterdayButton.append("rect")
        .attr("x", w*87/198)
        .attr("y", h*54/147)
        .attr("rx", 3)
        .attr("ry", 3)
        .attr("width", w*15/198)
        .attr("height", h*3/147)
        .attr("class", "gasButtonBg");
        
    yesterdayButton.append("text")
        .text("YESTERDAY")
        .attr("x", w*88/198)
        .attr("y", h*56.5/147)
        .attr("font-size", h*2/147)
        .attr("font-family", "sans-serif")
        .attr("class", "gasButtonBg");

    yesterdayButton.on("mouseup", function(evt){
         if (selectedGasYes == 0) {
            yesterdayButton.attr("opacity", 0.6);
            selectedGasYes = 1;
            drawGasLineChart(gasChart);
         }
         else {
            yesterdayButton.attr("opacity", 1);
            selectedGasYes = 0;
            drawGasLineChart(gasChart);
         }
    });

    var lastmonthButton = svg.append("g")
        .attr("class", "gasButton")
        .style("cursor", "pointer"); 
        
    lastmonthButton.append("rect")
        .attr("x", w*104/198)
        .attr("y", h*54/147)
        .attr("rx", 3)
        .attr("ry", 3)
        .attr("width", w*15/198)
        .attr("height", h*3/147)
        .attr("class", "gasButtonBg");
        
    lastmonthButton.append("text")
        .text("LAST MONTH")
        .attr("x", w*105/198)
        .attr("y", h*56.5/147)
        .attr("font-size", h*2/147)
        .attr("font-family", "sans-serif")
        .attr("class", "gasButtonBg");

    lastmonthButton.on("mouseup", function(evt){
         if (selectedGasMon == 0) {
            lastmonthButton.attr("opacity", 0.6);
            selectedGasMon = 1;
            drawGasLineChart(gasChart);
         }
         else {
            lastmonthButton.attr("opacity", 1);
            selectedGasMon = 0;
            drawGasLineChart(gasChart);
         }
    });

    var lastyearButton = svg.append("g")
        .attr("class", "gasButton")
        .style("cursor", "pointer"); 
        
    lastyearButton.append("rect")
        .attr("x", w*121/198)
        .attr("y", h*54/147)
        .attr("rx", 3)
        .attr("ry", 3)
        .attr("width", w*14/198)
        .attr("height", h*3/147)
        .attr("class", "gasButtonBg");
        
    lastyearButton.append("text")
        .text("LAST YEAR")
        .attr("x", w*122/198)
        .attr("y", h*56.5/147)
        .attr("font-size", h*2/147)
        .attr("font-family", "sans-serif")
        .attr("class", "gasButtonBg");

    lastyearButton.on("mouseup", function(evt){
         if (selectedGasYear == 0) {
            lastyearButton.attr("opacity", 0.6);
            selectedGasYear = 1;
            drawGasLineChart(gasChart);
         }
         else {
            lastyearButton.attr("opacity", 1);
            selectedGasYear = 0;
            drawGasLineChart(gasChart);
         }
    });
}




