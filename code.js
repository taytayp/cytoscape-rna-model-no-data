
var makeDiv = function(text){
  var div = document.createElement('div');
  div.classList.add('popper-div');
  div.innerHTML = text;
  div.classList.add("toolTip");
  document.body.appendChild( div );
  return div;
};

function removeDivs() {
  var toRemove = document.getElementsByClassName("popper-div");
  for (var i = toRemove.length - 1; i >= 0; --i) {
    toRemove[i].remove();
  }
 };


function onetimeTap(event) {
  var ab = cy.getElementById(event.target._private.data.id);
  var allData = ab._private.data.allData;
  if (allData === undefined) return;
  var popperAB = ab.popper({
    content: function(){ return makeDiv(ab._private.data.allData); }
  });
  var updateAB = function(){ popperAB.scheduleUpdate();};
  ab.connectedNodes().on('position', updateAB);
  cy.on('pan zoom resize', updateAB);
}

function newCy(cyDivId, dataPath) {
  var cy = cytoscape({
    container: document.getElementById(cyDivId),

    layout: {
      name: 'cola',
      refresh: 2,
      maxSimulationTime: 2500,
      nodeDimensionsIncludeLabels: true,
      randomize: true,
    },

    style: fetch('js/cy-style.json').then(function(res){
      return res.json();
    }),

    elements: fetch(dataPath).then(function(res){
      return res.json();
    })

  });
  cy.on('tap', function(event){
    var evtTarget = event.target;
    if( evtTarget !== cy ){
      onetimeTap(event);
    }   
  });

  cy.style()
    .selector('edge')
      .style({
	'line-color': function ( ele ) { 
	  var deltaG = parseFloat(ele.data('deltaG'));
	  var color = "#999999"
	  if (deltaG >= -25) {
	    color = "#ffff00";
	  } else if (deltaG >= -27.5 && deltaG < -25) {
	    color = "#ffc500";
	  } else if (deltaG >= -30 && deltaG < -27.5) {
	    color = "#ff8400";
	  } else if (deltaG < -30) {
	    color = "#ff0000";
	  }
	  return color;
	}
      })
  .update() // indicate the end of your new stylesheet so that it can be updated on elements
  ;
  return cy;
}

// decide data
if (window.location.pathname === "/index.html") {
  var cy = newCy("cy", "js/data/miRNA_3UTR_final_out.txt");
} else if (window.location.pathname === "/lung_index.html") {
  var cy = newCy("cy", "js/data/miRNA_Lung_final_out.txt");
} else if (window.location.pathname === "/discontutr.html") {
  var cy = newCy("cy", "js/data/sgRNA_3UTR_final_out.txt");
} else if (window.location.pathname === "/discontlung.html") {
  var cy = newCy("cy", "js/data/results_targetRNA_LungEnhancers_sgRNA_final_out.txt");
} else if (window.location.pathname === "/random.html") {
  var cy = newCy("cy", "js/data/miRNA_random_final_out.txt");
} else {
  var cy = newCy("cy", "js/data/miRNA_Lung_final_out.txt");
}

