
// Initializes the page with a default plot
function init() {

  //Assign a reference to the drop down select 
  var selector = d3.select("#selDataset");
  
  //use the list of samples to populate the options
  d3.json(json).then((data) => {
    var ids = data.names

    //need help here/////////////////////////////
    id = ids.forEach(function(name) {
      selector
        .append("option")
        .text(name)
        .property("value");
    });

    buildMetadata(ids[0]);
    buildchart(ids[0]);
    
  });  
  
};

function buildMetadata(sampleID){
  d3.json(json).then((data) => {
    var metadata = data.metadata;

    //filter meta data info by id
    var result = metadata.filter(m => m.id.toString() === sampleID)[0];

    //select hte panel 
    var demoPanel = d3.select("#sample-metadata");
    //clear the panel before adding the new info
    demoPanel.html("");
    Object.entries(result).forEach((key) => {
      demoPanel.append("h5").text(key[0]+" : " + key[1]);
    });
  });
};

function optionChanged(sampleID){
  buildMetadata(sampleID);
  buildchart(sampleID);
}

function buildchart(sampleID){

  d3.json(json).then((data) => {

    var sampleDataset = data.samples;
    var sampleData = sampleDataset.filter(m=> m.id.toString() === sampleID);

    var result = sampleData[0];

    //get the top 10 OTU and convert to desired form
    var otu_top = result.otu_ids.slice(0,10).reverse();
    var otu_ids = otu_top.map(d => "OTU " + d);

    //get the top 10 sample values 
    var sample_top = result.sample_values.slice(0,10).reverse();

    //get the top 10 labels for the plot
    var otu_labels = result.otu_labels.slice(0,10);

    //create trace
    var trace = {
      x: sample_top,
      y: otu_ids,
      text: otu_labels,
      type: "bar",
      orientation: "h",
    }
    //create data variable 
    var data = [trace]

    //create layout
    var layout = {
      margine:{
        l: 100,
        r: 100,
        t: 100, 
        b: 100
      }
    };

    Plotly.newPlot("barchart",data, layout);

    //Object.entries(sample.id).forEach(([key,value]){
    //   panel.append('h5',`${key}: ${value}`)
    // });

    console.log(result.otu_ids);
    console.log(result.sample_values);
    
    
    //Create the bubble chart
     var bubbleTrace = {
       x: result.otu_ids,
       y: result.sample_values,
       mode : "markers",
       marker: {
        size: result.sample_values,
        color: result.otu_ids,
      },
      text: result.otu_labels
     };

     var data = [bubbleTrace];

     var layout = {
       showlegend: false,
       height:600,
       width: 600
     };

    Plotly.newPlot("bubblechart",data,layout);
    
  });
};

var json = "/plotly-challenge/data/samples.json";

init();
