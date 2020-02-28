var data = {};
var yearGroupedData = {};
var years = [];
var winnerData;
var diameter = 700;
var format = d3.format(",d");
var player_stats;

var margin = {top: 100, right: 100, bottom: 100, left: 100},
    width = Math.min(500, window.innerWidth - 10) - margin.left - margin.right,
    height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);

window.onload = function(){
    defaultViz();
};


function modalViz(playerName){
    debugger;
    var playerModal = d3.select("#myModal");
    var playerModalContent = d3.select(".modal-content");
    playerModalContent.append("h1").attr("id", "playerName").text(playerName);
    playerModalContent.append("h2").attr("id", "playerTitles").text("Titles won: "+ player_stats[playerName]['champion']);
    var player_data = {'name': playerName, 'axes':[]};
    var data = [];
    var temp_player_stats = []
    var player_stats_object = player_stats[playerName];
    for(prop in player_stats_object){
        if(prop!='champion'){
            // if(prop!='ace' && prop!='double'){
            //     temp_player_stats.push({
            //         'axis': prop.charAt(0).toUpperCase() + prop.slice(1).toLowerCase(),
            //         'value':Math.round(player_stats_object[prop])/10
            //     });
            // }else{
                temp_player_stats.push({
                    'axis': prop.charAt(0).toUpperCase() + prop.slice(1).toLowerCase(),
                    'value':Math.round(player_stats_object[prop])/100
                });

        }

    }
    player_data['axes'] = temp_player_stats;
    data.push(player_data);
    var color = d3.scaleOrdinal()
        .range(["#EDC951","#CC333F","#00A0B0"]);

    var radarChartOptions = {
        w: 290,
        h: 350,
        margin: margin,
        levels: 5,
        roundStrokes: false,
        color: d3.scaleOrdinal().range(["#26AF32", "#762712", "#2a2fd4"]),
        // format: '.0f'
    };
    RadarChart(".modal-content", data, radarChartOptions);

    playerModal.style("display", "block");

    // var playerModalSvg = playerModal
    //     .append("svg")
    //     .attr("width", diameter)
    //     .attr("height", diameter)
    //     .attr("id", "playerModal")
}

function defaultViz(){
    var tooltip = d3.select("body")
        .append("div")
        .attr("class", "mytooltip")
        .style("opacity", "0")
        .style("display", "none");

    function setTooltip(d){
        tooltip
            .style("top", (d3.event.pageY-10)+"px")
            .style("left",(d3.event.pageX+10)+"px")
            .style("opacity", "1")
            .style("display", "block")

        tooltip
            .html(
                "<span>" + d.data.winner + "<br/>" + "Matches won: " + format(d.data.count) +"</span>")
    }

    d3.csv('winner_count.csv', function(error, winner_data, columns){
        winnerData = {"children":winner_data};
        var color = d3.scaleOrdinal(d3.schemeCategory20);

        var bubble = d3.pack(winnerData)
            .size([diameter, diameter])
            .padding(1.3);

        var svg = d3.select("div#container")
            .append("svg")
            .attr("width", diameter)
            .attr("height", diameter)
            .attr("class", "bubble")
            .attr("id", "winner_bubble");

        var nodes = d3.hierarchy(winnerData)
            .sum(function(d) { return parseInt(d.count); });


        var node = svg.selectAll(".node")
            .data(bubble(nodes).descendants())
            .enter()
            .filter(function(d){
                return  !d.children
            })
            .append("g")
            .attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        // node.append("title")
        //     .text(function(d) {
        //         debugger;
        //         return d.data.winner + ": " + parseInt(d.data.count);
        //     });

        node.append("circle")
            .attr("r", function(d) {
                return d.r;
            })
            .style("fill", function(d,i) {
                return color(i);
            })
            .on("mouseover", function(d) {
                x = d.x;
                y = d.y;
                d3.select(this)
                    .transition()
                    .duration(500)
                    .style("cursor", "pointer")
                    .attr("width", 60)
                setTooltip(d)
            })
            .on("mousemove", function() {
                return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
            })
            .on("mouseout", function(d){
                tooltip
                    .style("opacity", "0")
                    .style("display", "none")
            })
            .on('click', function(d){
                modalViz(d.data.winner);
            })

        node.append("text")
            .attr("dy", ".2em")
            .style("text-anchor", "middle")
            .text(function(d) {
                return d.data.winner;//.substring(0, d.r / 3);
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", function(d){
                return d.r/5;
            })
            .attr("fill", "white");

        node.append("text")
            .attr("dy", "1.3em")
            .style("text-anchor", "middle")
            .text(function(d) {
                return parseInt(d.data.count);
            })
            .attr("font-family",  "Gill Sans", "Gill Sans MT")
            .attr("font-size", function(d){
                return d.r/5;
            })
            .attr("fill", "white");

        d3.select(self.frameElement)
            .style("height", diameter + "px");

        d3.json('./player_stats.json', function(error, data, columns){
            debugger;
            player_stats = data;
        })
    });
}

function plot(){

    d3.csv("10yearAUSOpenMatches.csv", function(error,data,columns){
        yearGroupedData = d3.nest().key(function(d){ return d.year;})
            .sortKeys(d3.ascending)
            .entries(data);
        yearGroupedData.forEach(function(yearData){
            years.push(yearData['key']);
            yearMatchGroupData = d3.nest().key(function(d){ return d.round;})

        });

    });
}