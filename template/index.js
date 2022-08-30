var markersArray =[];
var gridArray = [];
var heatdata = [];
var map;
var jso = [];
var iconq;
var dat;
var dats;
var heatmap;

var pricees = [];

function clearOverlays() {
    if (markersArray) {
        for (var i = 0; i < markersArray.length; i++) {
            markersArray[i].setMap(null);
        }
        markersArray.splice(0, markersArray.length);
    }
    clearPolygons();
    clearHeat();


}

function clearPolygons() {
    if (gridArray) {
        for (var i = 0; i < gridArray.length; i++) {
            gridArray[i].setMap(null);
        }
        gridArray.splice(0, gridArray.length);
    }
}

function clearHeat()
        {
          
          if(heatmap)
          {
            heatmap.setMap(null);
            heatdata.length=0;

          }
        }





function startMap(){

  
  map = new google.maps.Map(document.getElementById("map"),{
      zoom: 12,
      center: { lat: 12.9716, lng:77.5946},
    });


    google.maps.event.addListener(map, 'click', function( event ){
      clearOverlays()
      var lat=  event.latLng.lat();
      var lon = event.latLng.lng() ; 

      $.ajax({
        type:"GET",
        url:'http://localhost:3001/grid?lat='+lat+'&lon='+lon,
        success:function(data)
        {


          data = data[0]
          rectangle = new google.maps.Rectangle({
            strokeColor: '#808080',
            strokeOpacity: 1,
            strokeWeight: 2,
            fillColor: '#808080',
            geodesic: true,
            fillOpacity: 0.35,
            map: map,
            bounds: new google.maps.LatLngBounds(
                    {lat:parseFloat(data['MinLatitude']),lng:parseFloat(data['MinLongitude'])},
                {lat:parseFloat(data['MaxLatitude']),lng:parseFloat(data['MaxLongitude'])}
            ),
            
        });

        
        clickdata(data);
       
        gridArray.push(rectangle);
        
       

        const shape = {
          coords: [1, 1, 1, 20, 18, 20, 18, 1],
          type: "poly",
        };

        var marker = new google.maps.Marker({
          position: { lat: parseFloat(lat), lng: parseFloat(lon)},
          map,
          icon:"https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
          shape: shape,
          clickable:true,
          
          animation: google.maps.Animation.DROP
  
        });
        markersArray.push(marker)


        
        }
      })
    });
  
}



function clickdata(res){

 
  // var start = $("#start").val()
  // var end = $("#end").val()
  // var first = $("#first").val()
  // var last = $("#last").val()
  
  // var src1 = $('#source1').prop('checked') 
  // var src2 = $('#source2').prop('checked') 
  // var src3 = $('#source3').prop('checked') 
  
        var id = res['gridId']
  
      $.ajax({
        type:"GET",
        url : 'http://localhost:3001/touch?id='+id,
        
  
        success:function(out)
        {
          
          // setMarkers(out);
          var tables = "";
          console.log(out)
          out = out[0]
          tables += 
          "<tbody>"+
          "<tr>" +
          "<th>" + "1 BHk"+"</th>" +
          "<th>" + "2 BHk"+"</th>" +
          "<th>" + "3 BHk"+"</th>" +
          "<th>" + "Average of 1 BHk"+"</th>" +
          "<th>" + "Average of 2 BHk"+"</th>" +
          "<th>" + "Average of 3 BHk"+"</th>" +
          "<th>" + "Top Loc of 1 BHk"+"</th>" +
          "<th>" + "Top Loc of 2 BHk"+"</th>" +
          "<th>" + "Top Loc of 3 BHk"+"</th>" +
            "</tr>" 
            + "<tr>"+
          "<td>" + out['1_Bhk'] + "</td>" +
          "<td>" + out['2_Bhk'] + "</td>" +
          "<td>" + out['3_Bhk'] + "</td>" +
          "<td>" + Math.round(out['Average_1Bhk'],-2) + "</td>" +
          "<td>" + Math.round(out['Average_2Bhk'],-2)+ "</td>" +
          "<td>" + Math.round(out['Average_3Bhk'],-2) + "</td>" +
          "<td>" + out['Locality_1Bhk'] + "</td>" +
          "<td>" + out['Locality_2Bhk'] + "</td>" +
          "<td>" + out['Locality_3Bhk'] + "</td>" +
          "</tr>"+ "<tbody>";
          document.getElementById("demo").innerHTML = '<table>' + tables + '</table>';
        }
      })
  
      }
  
  
  


function refresh(){

  clearOverlays()


  
  alert("working !!!!!!!!!!!!")
  var room = $("#rooms").val()

  // var end = $("#end").val()
  // var first = $("#first").val()
  // var last = $("#last").val()
  // var locality = $("#locality").val()
  // var src1 = $('#source1').prop('checked') 
  // var src2 = $('#source2').prop('checked') 
  // var src3 = $('#source3').prop('checked') 
  var type = $('#type').val()
  var maptype = $('#Maptype').val()
  var id = $('#rec_mode').val()



$.ajax({
  type:"GET",
  url : 'http://localhost:3001/db?room='+room+'&type='+type+'&id='+id,
  

  success:function(data)
  {
    
    // console.log(data)
    if (id='all')
    {
      $.ajax({
        type:"GET",
        url : 'http://localhost:3001/totalgrid',
        
    
        success:function(grid)
        {
          console.log("Getting the grids?")
          // console.log(grid,data,maptype)
          initMap(grid,data,maptype)
        }
      })

    }
    else
    {
      $.ajax({
        type:"GET",
        url:'http://localhost:3001/grid?lat='+lat+'&lon='+lon+'&id'+id,
        success:function(gridd)
        {

          $.ajax({
        type:"GET",
        url : 'http://localhost:3001/touch?id='+gridd,
        
  
        success:function(out)
        {
          if (type=='HeatMap'){
            heatmaps(out);
                              }
          else{
              setMarkers(out);
              }
        }

        })
        }
      })
    }
      

    
  }
})



var check =0;

function initMap(grid, data,type) 
{

  console.log("coming in init maps")
  
  for (let i = 0; i < grid.length-1; i++) {
      const box = grid[i];
      
      
      rectangle = new google.maps.Rectangle({
      strokeColor: '#808080',
      strokeOpacity: 1,
      strokeWeight: 2,
      fillColor: '#808080',
      geodesic: true,
      fillOpacity: 0.35,
      map: map,
      bounds: new google.maps.LatLngBounds(
              {lat:parseFloat(box['minLatitude']),lng:parseFloat(box['minLongitude'])},
          {lat:parseFloat(box['maxLatitude']),lng:parseFloat(box['maxLongitude'])}
      ),
      id:box['gridid']
  });
  gridArray.push(rectangle)

  
    }
    // console.log("choose the option")
    if (type=='HeatMap'){
      heatmaps(data);
    }
    else{
        setMarkers(data);
        }
    
  }
var icons = ["http://maps.google.com/mapfiles/ms/icons/yellow.png",
    "http://maps.google.com/mapfiles/ms/icons/red.png",
    "https://maps.google.com/mapfiles/ms/icons/purple.png"
];

function heatmaps(data)
{
     
      
      for (let i = 0; i < data.length-1; i++)
      {
          const place = data[i]
          if ((parseFloat(place['Latitude']) < 12 )  | (parseFloat(place['Latitude']) > 14)  | (parseFloat(place['Longitude']) > 78 ) | (parseFloat(place['Longitude']) < 77))
          {
              
          }
          else
          {
          heatdata.push(new google.maps.LatLng(parseFloat(place['Latitude']),parseFloat(place['Longitude'])))
          }
      }
  
    heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatdata,
        dissipating: true});

        // console.log(heatdata)
        heatmap.setMap(map);
    }  

    


function setMarkers(data) {
 
    const shape = {
      coords: [1, 1, 1, 20, 18, 20, 18, 1],
      type: "poly",
    };

    
  var infowindow = new google.maps.InfoWindow();


    var c;

    for (let i = 0; i < data.length-1; i++) {
      const place = data[i];
      

      if (place['Rooms']==1)
      {
        c = icons[0]
      }

      else if (place['Rooms']==2)
      {
        c = icons[1]
      }

      else if (place['Rooms']==3)
      {
        c = icons[2]
      }
      


      var marker = new google.maps.Marker({
        position: { lat: parseFloat(place["Latitude"]), lng: parseFloat(place["Longitude"])},
        map,
        icon:c,
        shape: shape,
        clickable:true,
        
        animation: google.maps.Animation.DROP,
        title: place["Name"],

      });

      var content = `<p> This place is <h3>${place["Name"]}</h3></p><p><The Rooms Available are <h3>${place["Rooms"]} </h3></p>`
      
      pricees.push(place["Prices"])
      
      markersArray.push(marker);


    google.maps.event.addListener(marker,'click', (function(marker,content,infowindow){ 
        return function() {
          
           infowindow.setContent(content);
           infowindow.open(map,marker);
           
           
        };
    })(marker,content,infowindow)); 


    }
  
  
}
}

window.startMap = startMap;