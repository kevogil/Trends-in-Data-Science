// Make the choropleth for the avg_salary nationwide
d3.json("/db_url/careers").then(function(rows) {
    console.log(rows);
    function unpack(rows, key) {
        return rows.map(function(row) { return row[key]; });
    }
    
    var data = [{
        type: 'choropleth',
        locationmode: 'USA-states',
        locations: unpack(rows, 'us_state'),
        z: rows.map(row => parseInt(row["avg_salary"])),
        text: unpack(rows, 'us_state'),
        zmin: 0,
        zmax: 150000,
        colorscale: [
            [0, 'rgb(242,240,247)'], [0.2, 'rgb(218,218,235)'],
            [0.4, 'rgb(188,189,220)'], [0.6, 'rgb(158,154,200)'],
            [0.8, 'rgb(117,107,177)'], [1, 'rgb(84,39,143)']
        ],
        colorbar: {
            title: 'Salary',
            thickness: 1.0
        },
        marker: {
            line:{
                color: 'rgb(255,255,255)',
                width: 2
            }
        }
    }];

    var layout = {
        title: 'Data Science Jobs in USA',
        geo:{
            scope: 'usa',
            showlakes: true,
            lakecolor: 'rgb(255,255,255)'
        }
    };

    Plotly.newPlot("bubble", data, layout, {showLink: false});
});



// Make a bar graph demonstrating the salary over the years and the increase in data science jobs
d3.json("/db_url/careers").then(function(feature) {

    var feature2 = feature.filter(row => row["company_founded"] != "NULL");
    
      
      var result = [];
      feature2.reduce(function(res, value) {
        if (!res[value.company_founded]) {
          res[value.company_founded] = { company_founded: value.company_founded, qty: 0 };
          result.push(res[value.company_founded])
        }
        
            res[value.company_founded].qty += 1 ;
        return res;
      }, {});

      result.sort( function(a,b){a["qty"] - b["qty"]}) ; 
      console.log(result)
      var trace2 = {
        x: result.map(row => row["company_founded"]),
        y: result.map(row => row["qty"]),
        mode: 'markers',
        marker: {
            color: "orchid",
            opacity: [0.8]
            },
        type: 'bar'
        };
        var layout = {       
            xaxis: {
              title: 'years',
            },
            yaxis: {   
              title: 'Number of Jobs',
              range: [0, 120]
            },
            title:'Number of Jobs per Year Nationwide'
          };
    
    var scatterData = [trace2];
    Plotly.newPlot('scatter', scatterData, layout)
});


// Make a Histogram for each state showing Salary distribution
function init(){
    d3.json("/db_url/careers").then(function(feature) {
        console.log(feature)
        
        var selector = d3.select("#selDataset"); 
        let unique = [...new Set(feature.map(row => row["us_state"]))];
        console.log(unique);
        unique.forEach((row) => {
            selector
              .append("option")
              .text(row)
              .property("value", row);
          });
        
        var state = unique[0];
        
        var state_salary = feature.filter(row => row["us_state"]== state);
    
        var trace = {
            x: state_salary.map(row => row["avg_salary"]),
            type: 'histogram',
            marker: {
                color: "grey",
                opacity: [0.6]}
            
        };
        var data = [trace];
        Plotly.newPlot('myDiv', data);
    });
}


function optionChanged(dropdownvalue){ 
    console.log(dropdownvalue)
    d3.json("/db_url/careers").then(function(feature) {
        var state_salary = feature.filter(row => row["us_state"]== dropdownvalue)
        Plotly.restyle("myDiv", "x",[state_salary.map(row => row["avg_salary"])]);
    });
};

init();


  
