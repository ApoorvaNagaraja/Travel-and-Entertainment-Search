function myFunctionEnable() 
{
      document.getElementById("location").disabled = false;
      var location_text = document.getElementById("location").value;
      var submit = document.getElementById("submit");
      if(!document.getElementById("location").disabled)
      {
        if(!/\S/.test(location_text))
        {
          
           submit.disabled=true;
        }
        else
        {
           submit.disabled=false;
        }
      }
     else
     {
       submit.disabled=true;
     }

     
}

function myFunctionDisable()
{
    document.getElementById("location").disabled=true;
    var text = document.getElementById("keyword").value;
    var submit = document.getElementById("submit");
    if(!/\S/.test(text))
    {
        
         submit.disabled=true;
    }
    else
    {
         submit.disabled=false;
    }
}

var btn_placeID="";
var btn_fav_placeID;
var JSONresults;
var PageNo;
var GlobalDetail;
var FavPage =1;
function getGeoLoc()
{
             $.ajax({
              type: 'GET',// added,
              url: 'http://ip-api.com/json',
              dataType: 'json'
              })
               .done(function (data) {
                var ipResponse= JSON.stringify(data);
                var response = JSON.parse(ipResponse);
                getGeoLoc.responseLat=response.lat;
                getGeoLoc.responseLon=response.lon;
                console.log(getGeoLoc.responseLon);
                console.log(getGeoLoc.responseLat);
                
              })
                .fail(function (jqXHR, textStatus, err) {
                    console.log('error' + textStatus);
                });
            
}
      getGeoLoc.responseLat="";
      getGeoLoc.responseLon="";


function get()
  {

    clearOnSearch();
    $("#proid").show();
    $("#pbar").show();
    $(".progress-bar").css("width","50%");
    if($("#distance").val()=="")
    {
      $("#distance").val('10');
    }
    a=$("#distance").val()*1609.34;
    if($("#location").val()=="")
    {
      $.ajax({
      type: 'GET',// added,
      url: 'http://webassignment-env.us-east-2.elasticbeanstalk.com/place',
      dataType: 'json',
      data:
      {
        p1:getGeoLoc.responseLat,
        p2:getGeoLoc.responseLon,
        keyword: $("#keyword").val(),
        distance :a,
        category: $("#category").val()
      }
      })
      .done(function (data) {
        JSONresults =data;
            parse(data);

    })
      .fail(function (jqXHR, textStatus, err) {
          console.log('error: ' + textStatus);
      });
    }
else
  {

    $.ajax({
    type: 'GET',// added,
    url: 'http://webassignment-env.us-east-2.elasticbeanstalk.com/location',
    dataType: 'json',
    data:
    {
        address: $("#location").val(),
        keyword: $("#keyword").val(),
        distance :a,
        category: $("#category").val()
    }
    })
     .done(function (data) {
      JSONresults =data;
        parse(data);
    })
      .fail(function (jqXHR, textStatus, err) {
          console.log('error' + textStatus);
      });
        }
}

function parse(data)
{

        current = 1;
       // var numberOfPages = 20;
        var response= JSON.stringify(data);
       // console.log(response);
        var jsonResponse=JSON.parse(response);
        //console.log(jsonResponse);
        result = jsonResponse;
        document.getElementById("main").style.display="block";
        document.getElementById("details_btn").style.visibility="visible";
        document.getElementById("buttons_next").style.display="block";
        document.getElementById("details").style.display="none";
        document.getElementById("detailsID").style.display="none";
        if(result.length ==0)
        {
          document.getElementById("details_btn").style.visibility="hidden";
          var html_text="<html><table class='table border alert-warning'>";
          html_text+="<td>No Records</td>"
          html_text += "</tr>";
          html_text+= "</table></html>";
          document.getElementById("tableID").innerHTML=html_text;
          $("#proid").hide();
          $("#pbar").hide();
          $(".progress-bar").css("width","0%");
        }
        else
        {

        document.getElementById("details_btn").style.visibility="visible";
        getPage(1);
        btn_next.onclick=next;
        btn_prev.onclick=previous;

       

      }
}
 function getPage(page)
        {
          var btn_next = document.getElementById("btn_next");
          var btn_prev = document.getElementById("btn_prev");
          var tableID = document.getElementById("tableID");
          
          if (page < 1) page = 1;
          if (page > getNumber()) page = getNumber();

          tableID.innerHTML = "";
          var html_text ="<html><table class='table' id='table1'>";
          html_text += "<thead><tr>"+
          "<th>#</th>"+
          "<th>Category</th>"+
          "<th>Name</th>"+
          "<th>Address</th>"+
          "<th>Favorite</th>"+
          "<th>Details</th></tr>";
          var j=1;
          if(result.length<(page * 20))
          {
           for (var i = (page-1) * 20; i < result.length; i++) 
            {
               var nodeList=result[i];
               html_text+="<td>"+j+"</td>";
               html_text+="<td><center><img src='"+nodeList.icon+"' style='max-width:65px;max-height:35px'></center></td>"; 
               html_text+="<td>"+nodeList.name+"</td>"
               html_text+="<td>"+nodeList.vicinity+"</td>"
               html_text+="<td><button class='btn btn-light'><span id='star"+i+"' class='fa fa-star-o'"
               html_text+="onclick='favorite(result["+i+"]);if($( this ).hasClass( \"fa-star\" )){$(this).css({\"color\":\"black\"}).removeClass(\"fa-star\").addClass(\"fa-star-o\")} else{ $(this).css({\"color\": \"yellow\"}).removeClass(\"fa-star-o\").addClass(\"fa-star\")}'"
               html_text+="></span></button></td>"
               html_text+="<td><button class='btn btn-light' id='buttonDetails' onclick='setGlobal(result["+i+"]);GlobalDetail=result["+i+"];detailFunc(\""+nodeList.place_id+"\")'><span class='fa fa-chevron-right'></span></button</td>"
               html_text+="</tr>" 
               j++;
            }
             html_text+= "</table></html>";
             $("#proid").hide();
             $("#pbar").hide();
             $(".progress-bar").css("width","0%");
             tableID.innerHTML=html_text;
            if(window.localStorage.length !=0 )
            {
             for (var i = (page-1) * 20; i < result.length; i++) 
             {
              var arr =JSON.parse(localStorage.getItem('fav'));
                nodeList=result[i];
                placeid =nodeList.place_id;
                //console.log(placeid);
                var found = arr.some(function (el) {
                if(el.placeid == placeid)
                {
                   var starId = "star"+i;
                   $("#"+starId).css({"color": "yellow"}).removeClass("fa-star-o").addClass("fa-star");
                 }
               });
             }
           }

           
           if(btn_placeID!="")
           {
             var j=1;
           for (var i = (page-1) * 20; i < result.length; i++) 
             {
                
                nodeList=result[i];
                var placeId =nodeList.place_id;
                var vari="empty";
               if(placeId == btn_placeID)
                {
                    vari= j;
                }
                j++;
                $('tr td').each(function() {
                if($(this).text() == vari )
                {
                     //console.log($(this).text())
                     $(this).closest('tr').css('background-color', '#ffdb58')
                }
               });
               
             }
           }

          }
          else
          {
          for (var i = (page-1) * 20; i < (page * 20); i++) 
          {
               var nodeList=result[i];
               html_text+="<td>"+j+"</td>";
               html_text+="<td><center><img src='"+nodeList.icon+"' style='max-width:65px;max-height:35px'></center></td>"; 
               html_text+="<td>"+nodeList.name+"</td>"
               html_text+="<td>"+nodeList.vicinity+"</td>"
               html_text+="<td><button class='btn btn-light'><span id='star"+i+"' class='fa fa-star-o'"
               html_text+="onclick='favorite(result["+i+"]);if($( this ).hasClass( \"fa-star\" )){$(this).css({\"color\":\"black\"}).removeClass(\"fa-star\").addClass(\"fa-star-o\")} else{ $(this).css({\"color\": \"yellow\"}).removeClass(\"fa-star-o\").addClass(\"fa-star\")}'"
               html_text+="></span></button></td>"
               html_text+="<td><button class='btn btn-light' id='buttonDetails' onclick='setGlobal(result["+i+"]);detailFunc(\""+nodeList.place_id+"\")'><span class='fa fa-chevron-right'></span></button></td>"
               html_text+="</tr>" 
               j++;
            }
             html_text+= "</table></html>";
             $("#proid").hide();
             $("#pbar").hide();
             $(".progress-bar").css("width","0%");
             tableID.innerHTML=html_text;
             if(window.localStorage.length !=0 )
            {
              for (var i = (page-1) * 20; i < (page * 20); i++) 
              {
                var arr =JSON.parse(localStorage.getItem('fav'));
                nodeList=result[i];
                placeid =nodeList.place_id;
                var found = arr.some(function (el) {
                if(el.placeid == placeid)
                {
                   
                   var starId = "star"+i;
                   $("#"+starId).css({"color": "yellow"}).removeClass("fa-star-o").addClass("fa-star");
                }
              });
            }
           }
              //console.log(btn_placeID);
           if(btn_placeID!="")
           {
            console.log(btn_placeID);
            var j=1;
              for (var i = (page-1) * 20; i < (page * 20); i++) 
             {

                nodeList=result[i];
                var placeId =nodeList.place_id;
                var vari="empty";
                if(placeId == btn_placeID)
                {
                    vari= j;
                }
                j++;
                $('tr td').each(function() {
                if($(this).text() == vari )
                {
                     //console.log($(this).text())
                     $(this).closest('tr').css('background-color', '#ffdb58')
                }
              });
            }
            
           }

         }
             PageNo=page;
            if (page == 1) {
             btn_prev.style.visibility = "hidden";
            } 
            else {
                btn_prev.style.visibility = "visible";
            }

            if (page == getNumber()) {
              btn_next.style.visibility = "hidden";
             } 
             else {
              btn_next.style.visibility = "visible";
             }
         }
         function getNumber()
         {
              return Math.ceil(result.length / 20);
         }

function previous()
{
  if (current > 1) {
  current--;
  getPage(current);
  }
}
          function next()
          {
            if (current < getNumber()) {
              current++;
              getPage(current);
             }
          }

function detailFunc(obj)
{
  //console.log(obj);
  var details = document.getElementById('details');
  details.style.display="block";
  var detailsID = document.getElementById("detailsID"); 
  detailsID.style.display ="block";
  if(window.localStorage.length != 0)
  {
   var arr =JSON.parse(localStorage.getItem('fav'));
                placeid =obj;
            var found = arr.some(function (el) {
             if(el.placeid == placeid)
             {
                 //console.log("found");
                 $("#detailStar").css({"color": "yellow"}).removeClass("fa-star-o").addClass("fa-star");
                            
              }
             return el.placeid == placeid;
            });
            if (!found) 
            { 
                
                //console.log("notfound")
                $("#detailStar").css({"color": "black"}).removeClass("fa-star").addClass("fa-star-o")
            }


    }



 
  var request= {
  placeId: obj
 };
 
 var service = new google.maps.places.PlacesService(details);
 service.getDetails(request, callback);

 function callback(place,status)
 {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
      
      document.getElementById("main").style.display="none";
      document.getElementById("btn_prev").style.visibility="hidden";
      document.getElementById("btn_next").style.visibility="hidden";
      document.getElementById("btn_fav_prev").style.visibility="hidden";
      document.getElementById("btn_fav_next").style.visibility="hidden";
      document.getElementById("fav").style.display="none";
     
      var node = document.createElement("p");
      var textnode = document.createTextNode(place.name);
      node.setAttribute("align","center");
      node.setAttribute("id","name");
      node.appendChild(textnode);
      details.appendChild(node);
      document.getElementById("name").style.fontWeight='bold';

      var details_btn = document.getElementById("details_btn");
      if(details_btn.disabled==true)
      { 
        details_btn.disabled=false;
      }
      btn_placeID = obj;

      var details_fav_btn = document.getElementById("details_fav_btn");
      if(details_fav_btn.disabled==true)
      { 
            details_fav_btn.disabled=false;
      }
      btn_fav_placeID = obj;


      if(document.getElementById("radios").checked)
      {
        document.getElementById("from").value="Your location";
      }
      else if(document.getElementById("radios1").checked)
      {
        document.getElementById("from").value=document.getElementById("location").value;
      }
      document.getElementById("to").value= place.name+','+place.formatted_address;

      if(place.website)
      {
        var tweet =place.website;
      }
      else
      {
         var tweet = place.url; 
      }
     document.getElementById("twitterImage").href="https://twitter.com/intent/tweet?text=Check out "+place.name+" located at "+place.formatted_address+" Website:"+"&url="+tweet+"&hashtags="+"TravelAndEntertainmentSearch";
    
      var modal = document.getElementById('myModal');
      var text= "<table class='table table-striped'>";
      if(place.formatted_address)
      {
       text+= "<tr><td><b>Address</b></td><td>"+place.formatted_address+"</td></tr>"
      }
      if(place.international_phone_number)
      {
        text+= "<tr><td><b>Phone Number</b></td><td>"+place.international_phone_number+"</td></tr>"
      }
      if(place.price_level)
      {
          var dollar="";
          for(var i=1;i<=place.price_level;i++)
          {
            dollar += "$"
          }
          text+= "<tr><td><b>Price Level</b></td><td>"+dollar+"</td></tr>"
      }
      if(place.rating)
      {
       
        text+= "<tr><td><b>Rating</b></td><td>"+place.rating+"<span class='rateYo' id='a1' style='display:inline-block;'></span>"+"</td></tr>"
      }
      if(place.url)
      {
        text+= "<tr><td><b>Google Page</b></td><td><a target='_blank' href="+ place.url +">"+place.url+"</a></td></tr>"
      }
      if(place.website)
      {
        text+= "<tr><td><b>Website</b></td><td><a target='_blank' href="+place.website+">"+place.website+"</a></td></tr>"
      }
      if(place.opening_hours)
      {
        var week_day =moment(moment().format()).utcOffset(+place.utc_offset).day();
        if(place.opening_hours.open_now==false)
        {
          var open="Closed";
        }
        else
        {
          var str = place.opening_hours.weekday_text[week_day-1];
          var res = str.split(/ (.*)/);
          var open ="Open now:"+ res[1];
        }
        text+= "<tr><td><b>Hours</b></td><td>"+open+"&nbsp;<a style='color:blue;text-decoration:underline'id='myModal' data-toggle='modal' data-target='#myModal'>"+"Daily open hours"+"</td></tr>"
        var modal_text="<table class='table'>";
        var modalstr = place.opening_hours.weekday_text[week_day-1];
        var modalres = modalstr.split(/:(.*)/);
        modal_text+="<tr><th>"+modalres[0]+"</th><th>"+modalres[1]+"</th></tr>"
        for(var j=week_day+1 ;j <=7 ;j++)
        {
          var modalstr1 = place.opening_hours.weekday_text[j-1];
          var modalres1 = modalstr1.split(/:(.*)/);
          modal_text+="<tr><td>"+modalres1[0]+"</td><td>"+modalres1[1]+"</td></tr>"
        }
        for(var k=1; k<week_day;k++ )
        {
          var modalstr1 = place.opening_hours.weekday_text[k-1];
          var modalres1 = modalstr1.split(/:(.*)/);
          modal_text+="<tr><td>"+modalres1[0]+"</td><td>"+modalres1[1]+"</td></tr>"
        }
        modal_text+="</table>"
        document.getElementById("modalbody").innerHTML=modal_text;
      }
      text+= "</table>";
      document.getElementById("nav-info").innerHTML=text;
       $(".rateYo").rateYo({
            rating: place.rating,
            normalFill:"transparent",
            starWidth:"15px",
            readOnly:true

        });
       
    

    if(place.photos)
      {
        
        var col1="", col2="",col3="",col4="";
        var photoGroup="<div class='row'>";
        col1+="<div class='column'>";
        col2+="<div class='column'>";
        col3+="<div class='column'>";
        col4+="<div class='column'>";

        for(var i=0;i<place.photos.length;i++)
        {
           var pics=place.photos[i].getUrl({'maxWidth':place.photos[i].width,'maxHeight':place.photos[i].height});
          if(i%4==0)
          {
            col1+= "<img class='img-thumbnail' src="+pics+" style='width:100%' onclick='window.open(\""+pics+"\")'>";
          }
          else if(i%4==1)
          {
            col2+="<img class='img-thumbnail'src="+pics+"  style='width:100%' onclick='window.open(\""+pics+"\")'>";
          }
          else if(i%4==2)
          {
            col3+="<img class='img-thumbnail' src="+pics+ " style='width:100%' onclick='window.open(\""+pics+"\")'>";
          }
          else if(i%4==3)
          {
            col4+="<img class='img-thumbnail' src="+pics+" style='width:100%' onclick='window.open(\""+pics+"\")'>";
          }
        }
        col1 +="</div>"
        col2 +="</div>"
        col3 +="</div>"
        col4 +="</div>"
        
        photoGroup += col1+col2+col3+col4+"</row>"
        document.getElementById("nav-photos").innerHTML=photoGroup;
      }
      else
      {
          var pic_text="<html><table class='table border alert-warning'>";
          pic_text+="<td>No records</td>"
          pic_text += "</tr>";
          pic_text+= "</table></html>";
          document.getElementById("nav-photos").innerHTML=pic_text;
      }
     if(place.reviews)
     {
      $("#opt").text("Google Reviews");
      $("#opt1").text("Default Order");
      var rev_text="";
      var ratings=[];
      var reviews = place.reviews;
      var yelp_result;
      for(var i=0;i<place.reviews.length;i++)
      {
        rev_text += "<div class='row border container'><div><img style='max-width:60px;max-height:60px' onclick='window.open(\""+place.reviews[i].author_url+"\")' src="+place.reviews[i].profile_photo_url+"></div>";
        rev_text += "<div class='col'><a target='_blank' href="+place.reviews[i].author_url+">"+place.reviews[i].author_name+"</a></br>";
        var date = new Date(new Date(place.reviews[i].time*1000));
        var month = date.getMonth() + 1;
          if (month <10)
          {
            month= '0'+month;
          }
          var day = date.getDate();
          if (day <10)
          {
            day= '0'+day;
          }
            rev_text += "<span id='a3' class='google"+i+"' style='display:inline-block;'></span>&nbsp;"+date.getFullYear() + "-" +
              month + "-" +
              day + " " +
              
              date.getHours() + ":" +
              date.getMinutes() + ":" +
              date.getSeconds()+"</br>" ;
        rev_text += place.reviews[i].text;
        rev_text += "</div></div>";
      }
      document.getElementById("review").innerHTML=rev_text;
      for(var i=0;i<place.reviews.length;i++)
      {
        var g_id= "google"+i;
        $("."+g_id).rateYo({
                      rating: place.reviews[i].rating,
                      normalFill:"#ffffff",
                      starWidth:"15px",
                      readOnly:true
                     })

      }

      $("#1").unbind().click(function () {
      
        $("#opt").text($(this).text());
        
         if($("#opt1").text()=="Default Order")
          {
            document.getElementById("review").innerHTML="";
            displayReviews();
          }
          if($("#opt1").text()=="Highest Rating")
          {
                reviews.sort(function(a, b){
              return a.rating < b.rating;
             });
             document.getElementById("review").innerHTML="";
             displayReviews();
          }
          if($("#opt1").text()=="Lowest Rating")
          {
              reviews.sort(function(a, b){
              return a.rating > b.rating;
             });
              document.getElementById("review").innerHTML="";
              displayReviews();
          }
          if($("#opt1").text()=="Most Recent")
          {
            reviews.sort(function(a, b){
            return a.time < b.time;
           });
            document.getElementById("review").innerHTML="";
            displayReviews();
          }
           if($("#opt1").text()=="Least Recent")
          {
             reviews.sort(function(a, b){
            return a.time > b.time;
           });
            document.getElementById("review").innerHTML="";
            displayReviews();
          }
         
      });

      $("#2").unbind().click(function () {
            $("#opt").text($(this).text());
            var address_comp =place.address_components;
            var str = place.formatted_address;
            var res = str.split(",");
            address1 =res[0];
            for(var i =0; i<address_comp.length;i++)
            {
              if(address_comp[i].types[0]=="country")
              {
                country=address_comp[i].short_name;
              
              }

               if(address_comp[i].types[0]=="postal_code")
              {
                postal_code=address_comp[i].short_name;
            
              }

              if(address_comp[i].types[0]=="administrative_area_level_1")
              {
                state=address_comp[i].short_name;
              
              }

              if(address_comp[i].types[0]=="locality")
              {
                locality=address_comp[i].short_name;
              }
            }
          //  console.log(address1);
           $.ajax({
           type: 'GET',
           url: 'http://webassignment-env.us-east-2.elasticbeanstalk.com/yelp',
           dataType: 'json',
            data:
            {
              name:place.name,
              locality:locality,
              postal_code:postal_code,
              country:country,
              state:state,
              address1:address1
             }
            })
            .done(function (data) {

                  if(data=="No")
                  {
                    yelp_result="No";
                    var rev_text="<html><table class='table border alert-warning'>";
                    rev_text+="<td>No records</td>"
                    rev_text += "</tr>";
                    rev_text+= "</table></html>";
                    document.getElementById("review").innerHTML=rev_text;
                  }
                  else
                  {
                  var response= JSON.stringify(data);
                  var jsonResponse=JSON.parse(response);
                  console.log(jsonResponse);
                  yelp_result = jsonResponse;
                  
                  if(yelp_result.length==0 )
                  {
                    console.log(yelp_result.length);
                    var rev_text="<html><table class='table border alert-warning'>";
                    rev_text+="<td>No records</td>"
                    rev_text += "</tr>";
                    rev_text+= "</table></html>";
                    document.getElementById("review").innerHTML=rev_text;

                  }
                  else
                  {
                    
                      if($("#opt1").text()=="Default Order")
                      {
                        document.getElementById("review").innerHTML="";
                        console.log("hello");
                        displayYelpReviews();
                      }
                      if($("#opt1").text()=="Highest Rating")
                      {
                            yelp_result.sort(function(a, b){
                          return a.rating < b.rating;
                         });
                         document.getElementById("review").innerHTML="";
                         displayYelpReviews();
                      }
                      if($("#opt1").text()=="Lowest Rating")
                      {
                          yelp_result.sort(function(a, b){
                          return a.rating > b.rating;
                         });
                         document.getElementById("review").innerHTML="";
                         displayYelpReviews();
                        
                      }
                      if($("#opt1").text()=="Most Recent")
                      {
                          yelp_result.sort(function(a, b){
                          return moment(a.time_created).unix() < moment(b.time_created).unix();
                         });
                         document.getElementById("review").innerHTML="";
                         displayYelpReviews();
                      }
                       if($("#opt1").text()=="Least Recent")
                      {
                          yelp_result.sort(function(a, b){
                          return moment(a.time_created).unix() > moment(b.time_created).unix();
                         });
                         document.getElementById("review").innerHTML="";
                         displayYelpReviews();
                      }
         

                  }

                }

          })
            .fail(function (jqXHR, textStatus, err) {
                console.log('error: ' + textStatus);
        });
});

        $("#3").unbind().click(function () {
        $("#opt1").text($(this).text());
        document.getElementById("review").innerHTML="";
       if($("#opt").text()=="Google Reviews")
        {
          displayReviews();
        }
        else
          displayYelpReviews();
      });

      $("#4").unbind().click(function () {
        $("#opt1").text($(this).text());
        if($("#opt").text()=="Google Reviews")
        {
          reviews.sort(function(a, b){
          return a.rating < b.rating;
         });
         document.getElementById("review").innerHTML="";
         displayReviews();
        }
        else
        {
          if(yelp_result!="No")
          {
          yelp_result.sort(function(a, b){
          return a.rating < b.rating;
         });
        }
         document.getElementById("review").innerHTML="";
         displayYelpReviews();
        }
      });

      $("#5").unbind().click(function () {
        $("#opt1").text($(this).text());
        if($("#opt").text()=="Google Reviews")
        {
          reviews.sort(function(a, b){
          return a.rating > b.rating;
         });
          document.getElementById("review").innerHTML="";
          displayReviews();
        }
        else
        {
          if(yelp_result!="No")
          {
          yelp_result.sort(function(a, b){
          return a.rating > b.rating;
         });
        }
         document.getElementById("review").innerHTML="";
         displayYelpReviews();
        }
      });

      $("#6").unbind().click(function () {
        $("#opt1").text($(this).text());
        if($("#opt").text()=="Google Reviews")
        {
            reviews.sort(function(a, b){
            return a.time < b.time;
           });
            document.getElementById("review").innerHTML="";
            displayReviews();
        }
        else
        {
          if(yelp_result!="No")
          {
          yelp_result.sort(function(a, b){
          return moment(a.time_created).unix() < moment(b.time_created).unix();
         });
        }
         document.getElementById("review").innerHTML="";
         displayYelpReviews();
        }

       });

      $("#7").unbind().click(function () {
        $("#opt1").text($(this).text());
        if($("#opt").text() =="Google Reviews")
        {
          reviews.sort(function(a, b){
          return a.time > b.time;
         });
          document.getElementById("review").innerHTML="";
          displayReviews();
        }
        else
        {
          if(yelp_result!="No")
          {
          yelp_result.sort(function(a, b){
          return moment(a.time_created).unix() > moment(b.time_created).unix();
         });
        }
         document.getElementById("review").innerHTML="";
         displayYelpReviews();
        }
      });


      function displayReviews()
      {
        var drop_text="";
        for(var i=0;i<place.reviews.length;i++)
        {
          drop_text += "<div class='row border container'><div><img style='max-width:60px;max-height:60px' onclick='window.open(\""+place.reviews[i].author_url+"\")' src="+place.reviews[i].profile_photo_url+"></div>";
          drop_text += "<div class='col'><a target='_blank' href="+place.reviews[i].author_url+">"+place.reviews[i].author_name+"</a></br>";
          var date = new Date(new Date(place.reviews[i].time*1000));
          var month = date.getMonth() + 1;      
          if (month <10)
          {
            month= '0'+month;
          }
          var day = date.getDate();
          if (day <10)
          {
            day= '0'+day;
          }
          drop_text +=  "<span id='a4' class='n_google"+i+"' style='display:inline-block;'></span>&nbsp;"+ date.getFullYear() + "-" +
              month + "-" +
              day + " " +
              
              date.getHours() + ":" +
              date.getMinutes() + ":" +
              date.getSeconds()+"</br>";
          drop_text += place.reviews[i].text;
          drop_text += "</div></div>";
        }
        document.getElementById("review").innerHTML=drop_text;
      
      for(var i=0;i<place.reviews.length;i++)
      {
        var googleID ="n_google"+i;
        $("."+googleID).rateYo({
                      rating: place.reviews[i].rating,
                      normalFill:"#ffffff",
                      starWidth:"15px",
                      readOnly:true
                     });

      }
    }
  }
     else
      {
          var rev_text="<html><table class='table border alert-warning'>";
          rev_text+= "<tr><td>No records</td>"
          rev_text += "</tr>";
          rev_text+= "</table></html>";
          document.getElementById("review").innerHTML=rev_text;
      }

      function displayYelpReviews() 
      {
        var yelp_text="";
        document.getElementById("review").innerHTML="";
        console.log(yelp_result.length)
        if(yelp_result.length==0 || yelp_result=="No")
        {
                    var rev_text="<html><table class='table border alert-warning'>";
                    rev_text+="<td>No records</td>"
                    rev_text += "</tr>";
                    rev_text+= "</table></html>";
                    document.getElementById("review").innerHTML=rev_text;

        }
        else
        {
          console.log(yelp_result.length);
          for(var i=0;i<yelp_result.length;i++)
                {

                      yelp_text = "<div class='row border container'><div>";
                      if(yelp_result[i].user.image_url)
                      {
                        yelp_text += "<p><img style='max-width:60px;max-height:60px' onclick='window.open(\""+yelp_result[i].url+"\")' src="+yelp_result[i].user.image_url+">";
                      }
                      console.log(yelp_result[i].user.name);
                      yelp_text += "</div><div class='col'><a target='_blank' href="+yelp_result[i].url+">"+yelp_result[i].user.name+"</a></br>";
                      yelp_text +=  "<span id='a2' class='yelp"+i+"' style='display:inline-block;'></span>&nbsp;"+yelp_result[i].time_created+"<br>";
                      yelp_text +=  yelp_result[i].text+"</p>";
                      yelp_text += "</div></div>";
                  }
                  document.getElementById("review").innerHTML=yelp_text;          
            for(var i=0;i<yelp_result.length;i++)
            {
              var id2="yelp"+i;
              $("."+id2).rateYo({
              rating: yelp_result[i].rating,
              normalFill:"#ffffff",
              starWidth:"15px",
              readOnly:true
             });
           }
        }
      }
    

    
    var lats=place.geometry.location.lat();
    var lngs= place.geometry.location.lng();
    initMap(lats,lngs);
    }
  }
}

function showPrev()
{
  
      getPage(PageNo);
  
  if($("#pills-favourite").hasClass("active show"))
  {
    getFav();
  }
  document.getElementById("detailsID").style.display="none";
  document.getElementById("details").style.display="none";
  document.getElementById("buttons_next").style.display="block";
  document.getElementById("main").style.display="block";
}

function initMap(lats,lngs) {

  document.getElementById("direction-panel").innerHTML="";
  var directionsDisplay = new google.maps.DirectionsRenderer;
  var directionsService = new google.maps.DirectionsService;
  var uluru = {lat: lats, lng: lngs};
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: uluru,
    streetViewControl: false
  });
    marker = new google.maps.Marker({
    position: uluru,
    map: map
  });

  panorama = map.getStreetView();
  panorama.setPosition(uluru);
  panorama.setPov(({
    heading: 265,
    pitch: 0
  }));

directionsDisplay.setMap(map);
directionsDisplay.setPanel(document.getElementById('direction-panel'));

document.getElementById("getDirections").addEventListener('click', function() {
    marker.setMap(null);
    calculateAndDisplayRoute(directionsService, directionsDisplay,uluru);
  });
}

function calculateAndDisplayRoute(directionsService, directionsDisplay,uluru) 
{
        marker.setMap(null);
        var selectedMode = document.getElementById('travelmode').value;
         if(document.getElementById("from").value == "Your location"|| document.getElementById("from").value == "My location")
        {
          var place={lat:getGeoLoc.responseLat, lng:getGeoLoc.responseLon};
        }
        else
        {
          place =document.getElementById("from").value;
        }
       

        directionsService.route({
          origin: place,
          destination:uluru,
          travelMode: google.maps.TravelMode[selectedMode],
          provideRouteAlternatives: true
        }, function(response, status) {
          if (status === 'OK') {
            directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
}

function changeImage()
{
  var toggle = panorama.getVisible();
   if( document.getElementById("pegman").src=="http://cs-server.usc.edu:45678/hw/hw8/images/Pegman.png" && (toggle == false))
    {
        marker.setMap(null);
        document.getElementById("pegman").src="http://cs-server.usc.edu:45678/hw/hw8/images/Map.png";
        panorama.setVisible(true);
    }
    else
    {
      
       if($('#direction-panel').html() == "")
       {
        marker.setMap(map);
      }
      document.getElementById("pegman").src="http://cs-server.usc.edu:45678/hw/hw8/images/Pegman.png";
      panorama.setVisible(false);
    }
}
function checkButton()
{ 
  var formvalue = document.getElementById("from").value;
  var getDirections = document.getElementById("getDirections");
      if(!/\S/.test(formvalue))
      {
        getDirections.disabled=true;
      }
      else
        getDirections.disabled=false;
}

 $(document).ready(function(){
 $('#keyword').on('keyup focusout',function()
 {

  var text = document.getElementById("keyword").value;
  var submit = document.getElementById("submit");
  var location=document.getElementById("location");
  var location_text =document.getElementById("location").value;
 
      if(!/\S/.test(text))
      {
         $("#keyword").addClass("errormsg");
         $("#keyword").removeClass("noError");
         $("#invalid").show();
         submit.disabled=true;
      }
      else
      {
        $("#keyword").removeClass("errormsg");
        $("#keyword").addClass("noError");
        $("#invalid").hide();
        submit.disabled=false;
 }

});

$('#location').on('keyup focusout',function()
 {

  var submit = document.getElementById("submit");
  var location_text =document.getElementById("location").value;
 
      if(!/\S/.test(location_text))
      {
         $("#location").addClass("errormsg");
         $("#location").removeClass("noError");
         $("#invalid1").show();
         submit.disabled=true;
      }
      else
      {
        $("#location").removeClass("errormsg");
        $("#location").addClass("noError");
        $("#invalid1").hide();
        submit.disabled=false;
      }
 });

$("#detailStarButton").unbind().click(function () {
    console.log("inside");
    if($("#detailStar").hasClass("fa-star-o"))
    {
      $("#detailStar").css({"color": "yellow"}).removeClass("fa-star-o").addClass("fa-star")
      console.log("hi");
      favorite(GlobalDetail);
      detailFunc(btn_placeID);
    }
    else
    {
      console.log("hello");
      $("#detailStar").css({"color": "black"}).removeClass("fa-star").addClass("fa-star-o");
      var arr=JSON.parse(localStorage.getItem('fav'));
       index = arr.map(function(item) {
          return item.placeid
      }).indexOf(placeid);

      arr.splice(index, 1);
      localStorage.setItem('fav', JSON.stringify(arr));
      detailFunc(btn_placeID);
    }
  });

});
function favorite(nodeList)
{
  icon = nodeList.icon;
  name= nodeList.name;
  placeid= nodeList.place_id;
  vicinity= nodeList.vicinity;
  console.log(nodeList);
  if (window.localStorage.length==0) 
  {  
    addItem(icon, name,vicinity,placeid);
  }
  else
  {
    var arr =JSON.parse(localStorage.getItem('fav'));
    checkIcon(arr,placeid);
  }
}
function checkIcon(arr,placeid)
{
  var found = arr.some(function (el) {
   if(el.placeid == placeid)
   {
      index = arr.map(function(item) {
          return item.placeid
      }).indexOf(placeid);

      arr.splice(index, 1);
      localStorage.setItem('fav', JSON.stringify(arr));
      getFav();
    }
   return el.placeid == placeid;
  });
  if (!found) 
  { 
      //console.log("not found");
      addItem(icon, name,vicinity,placeid); 
  }
}

function addItem(icon,name,vicinity,placeid) 
{
    var oldItems = JSON.parse(localStorage.getItem('fav')) || [];
    
    var newItem = {
        'icon': icon,
        'name': name,
        'vicinity': vicinity,
        'placeid':placeid
    };
    
    oldItems.push(newItem);
    
    localStorage.setItem('fav', JSON.stringify(oldItems));
    getFav();
}

function getFav()
{
   var current = 1;
   var numberOfPages = 20;
   var arr=JSON.parse(localStorage.getItem('fav'));
   document.getElementById("details").style.display="none";
   document.getElementById("detailsID").style.display="none";
   document.getElementById("fav").style.display="block";
   document.getElementById("details_fav_btn").style.visibility="visible";
  if(window.localStorage.length == 0)
  {
          document.getElementById("details_fav_btn").style.visibility="hidden";
          var html_text="<html><table class='table border alert-warning'>";
          html_text+="<td>No Records</td>"
          html_text += "</tr>";
          html_text+= "</table></html>";
          document.getElementById("favTable").innerHTML=html_text;
  }
  else if(arr.length == 0 )
  {
          document.getElementById("details_fav_btn").style.visibility="hidden";
          var html_text="<html><table class='table border alert-warning'>";
          html_text+="<td>No Records</td>"
          html_text += "</tr>";
          html_text+= "</table></html>";
          document.getElementById("favTable").innerHTML=html_text;
  }
  else
  {
   getPageFav(FavPage);
   function getPageFav(page)
   {
          var btn_fav_prev = document.getElementById("btn_fav_prev");
          var btn_fav_next = document.getElementById("btn_fav_next");
          var favTable = document.getElementById("favTable");
          
          if (page < 1) page = 1;
          if (page > getNumberFav()) page = getNumberFav();
          
         
          favTable.innerHTML = "";
          var html_text ="<html><table class='table'>";
          html_text += "<thead><tr>"+
          "<th>#</th>"+
          "<th>Category</th>"+
          "<th>Name</th>"+
          "<th>Address</th>"+
          "<th>Favorite</th>"+
          "<th>Details</th></tr>";
          var j=1;
          if(arr.length<(page * numberOfPages))
          {
           for (var i = (page-1) * numberOfPages; i < arr.length; i++) 
            {
               nodeList=arr[i];
               html_text+="<td>"+j+"</td>";
               html_text+="<td><center><img src='"+nodeList.icon+"' style='max-width:65px;max-height:35px'></center></td>"; 
               html_text+="<td>"+nodeList.name+"</td>"
               html_text+="<td>"+nodeList.vicinity+"</td>"
               html_text+="<td><button 'class='btn btn-light'><span class='fa fa-trash' onclick='removeFunc(\""+nodeList.placeid+"\")'>"
               html_text+="</span></button></td>"
               html_text+="<td><button class='btn btn-light' id='buttonDetails' onclick='detailFavFunc(\""+nodeList.placeid+"\");highlight(this)'><span class='fa fa-chevron-right'></span></span></button</td>"
               html_text+="</tr>" 
               j++;
            }
             html_text+= "</table></html>";
             favTable.innerHTML=html_text;
             if(btn_placeID!="")
            {
               var j=1;
           for (var i = (page-1) * 20; i < arr.length; i++) 
             {
                
                nodeList=arr[i];
                var placeId =nodeList.placeid;
                var vari="empty";
                if(placeId == btn_placeID)
                {
                    vari= j;
                }
                j++;
                $('tr td').each(function() {
                if($(this).text() == vari )
                {
                     console.log($(this).text())
                     $(this).closest('tr').css('background-color', '#ffdb58')
                }
               });
               
             }
           }

          }
          else
          {
          for (var i = (page-1) * numberOfPages; i < (page * numberOfPages); i++) 
          {
               nodeList=arr[i];
               html_text+="<td>"+j+"</td>";
               html_text+="<td><center><img src='"+nodeList.icon+"' style='max-width:65px;max-height:35px'></center></td>"; 
               html_text+="<td>"+nodeList.name+"</td>"
               html_text+="<td>"+nodeList.vicinity+"</td>"
               html_text+="<td><button class='btn btn-light'><span class='fa fa-trash' onclick='removeFunc(\""+nodeList.placeid+"\")'>"
               html_text+="</span></button></td>"
               html_text+="<td><button class='btn btn-light' id='buttonDetails' onclick='detailFavFunc(\""+nodeList.placeid+"\");highlight(this)'><span class='fa fa-chevron-right'></span></button></td>"
               html_text+="</tr>" 
               j++;
            }
             html_text+= "</table></html>";
             favTable.innerHTML=html_text;

              if(btn_placeID!="")
           {
            var j=1;
              for (var i = (page-1) * 20; i < (page * 20); i++) 
             {

                nodeList=arr[i];
                var placeId =nodeList.placeid;
                var vari="empty";
                if(placeId == btn_placeID)
                {
                    vari= j;
                }
                j++;
                $('tr td').each(function() {
                if($(this).text() == vari )
                {
                     console.log($(this).text())
                     $(this).closest('tr').css('background-color', '#ffdb58')
                }
              });
            }
          }
         }
             FavPage=page;
            if (page == 1) {
             btn_fav_prev.style.visibility = "hidden";
            } 
            else {
             btn_fav_prev.style.visibility = "visible";
            }

            if (page == getNumberFav()) {
              btn_fav_next.style.visibility = "hidden";
             } 
             else {
              btn_fav_next.style.visibility = "visible";
             }
         }
         function getNumberFav()
         {
              return Math.ceil(arr.length / numberOfPages);
         }
          
          btn_fav_next.onclick=nextFav;
          btn_fav_prev.onclick=previousFav;

         function previousFav()
          {
          if (current > 1) {
              current--;
              getPageFav(current);
            }
          }
          function nextFav()
          {
            if (current < getNumberFav()) {
              current++;
              getPageFav(current);
            }
          }
        
      }

}
function removeFunc(placeid)
{
  var arr=JSON.parse(localStorage.getItem('fav'));
   index = arr.map(function(item) {
          return item.placeid
      }).indexOf(placeid);

      arr.splice(index, 1);
      localStorage.setItem('fav', JSON.stringify(arr));
      getFav();
}

function detailFavFunc(placeid)
{

      document.getElementById("fav").style.display="none";
      detailFunc(placeid);
}

function clearAll()
{
      document.getElementById("travelform").reset();
      document.getElementById("submit").disabled=true;
      document.getElementById("details_btn").disabled="true";
      document.getElementById("details_fav_btn").disabled=true;
      $("#location").removeClass("errormsg");
      $("#keyword").removeClass("errormsg");
      $("#invalid1").hide();
      $("#invalid").hide();
      document.getElementById("main").style.display="none";
      document.getElementById("fav").style.display="none";
      document.getElementById("buttons_next").style.display="none";
      document.getElementById("tableID").innerHTML="";
      document.getElementById("detailsID").style.display="none";
      document.getElementById("details").style.display="none";
      document.getElementById("error").style.display="none";
      document.getElementById("btn_prev").style.visibility="hidden";
      document.getElementById("btn_next").style.visibility="hidden";
      document.getElementById("btn_fav_prev").style.visibility="hidden";
      document.getElementById("btn_fav_next").style.visibility="hidden";
      document.getElementById("direction-panel").innerHTML="";
      document.getElementById("pegman").src="http://cs-server.usc.edu:45678/hw/hw8/images/Pegman.png"
      $("#pills-results-tab").addClass('active show');
      $("#pills-favourite-tab").removeClass('active show');
      $("#pills-results").addClass('active show');
      $("#pills-favourite").removeClass('active show');
      $("#nav-info-tab").addClass('active show');
      $("#nav-info").addClass('active show');
      $("#nav-photos-tab").removeClass('active show');
      $("#nav-photos").removeClass('active show');
      $("#nav-maps-tab").removeClass('active show');
      $("#nav-maps").removeClass('active show');
      $("#nav-review-tab").removeClass('active show');
      $("#nav-review").removeClass('active show');

      btn_placeID="";
}
function highlight(light)
{
    $("table tr").css("background", "#fff");
    var parent=light.parentNode.parentNode;
   parent.style.background='#ffdb58';
 

}

 function clearOnSearch()
 {
     document.getElementById("details_btn").disabled="true";
      document.getElementById("details_fav_btn").disabled=true;
      $("#location").removeClass("errormsg");
      $("#keyword").removeClass("errormsg");
      $("#invalid1").hide();
      $("#invalid").hide();
      document.getElementById("main").style.display="none";
      document.getElementById("fav").style.display="none";
      document.getElementById("buttons_next").style.display="none";
      document.getElementById("tableID").innerHTML="";
      document.getElementById("detailsID").style.display="none";
      document.getElementById("details").style.display="none";
      document.getElementById("error").style.display="none";
      document.getElementById("btn_prev").style.visibility="hidden";
      document.getElementById("btn_next").style.visibility="hidden";
      document.getElementById("btn_fav_prev").style.visibility="hidden";
      document.getElementById("btn_fav_next").style.visibility="hidden";
      document.getElementById("direction-panel").innerHTML="";
      document.getElementById("pegman").src="http://cs-server.usc.edu:45678/hw/hw8/images/Pegman.png"
      $("#pills-results-tab").addClass('active show');
      $("#pills-favourite-tab").removeClass('active show');
      $("#pills-results").addClass('active show');
      $("#pills-favourite").removeClass('active show');
      $("#nav-info-tab").addClass('active show');
      $("#nav-info").addClass('active show');
      $("#nav-photos-tab").removeClass('active show');
      $("#nav-photos").removeClass('active show');
      $("#nav-maps-tab").removeClass('active show');
      $("#nav-maps").removeClass('active show');
      $("#nav-review-tab").removeClass('active show');
      $("#nav-review").removeClass('active show');

      btn_placeID="";
 }

function init()
{
  var input = document.getElementById('location');
  autocomplete = new google.maps.places.Autocomplete(input);
  var input2 =document.getElementById("from");
  autocomplete = new google.maps.places.Autocomplete(input2);
 }


function setGlobal(global)
{
  GlobalDetail=global;
}

var mailme = function() {
   document.getElementById("main").style.display="none";
      document.getElementById("fav").style.display="none";
      document.getElementById("buttons_next").style.display="none";
      document.getElementById("tableID").innerHTML="";
      document.getElementById("detailsID").style.display="none";
      document.getElementById("details").style.display="none";
      document.getElementById("btn_prev").style.visibility="hidden";
      document.getElementById("btn_next").style.visibility="hidden";
      document.getElementById("btn_fav_prev").style.visibility="hidden";
      document.getElementById("btn_fav_next").style.visibility="hidden";
      $("#proid").hide();
      $("#pbar").hide();
      $(".progress-bar").css("width","0%");

    var err_text="<html><table class='table border alert-danger'>";
          err_text+="<td>Failed to get search results</td>"
          err_text += "</tr>";
          err_text+= "</table></html>";
          document.getElementById("error").innerHTML=err_text;
}

window.addEventListener('error', function(e) {
    var ie = window.event || {};
    var errMsg = e.message || ie.errorMessage || "404 error on " + window.location;
    var errSrc = (e.filename || ie.errorUrl) + ': ' + (e.lineno || ie.errorLine);
    mailme([errMsg, errSrc]);
}, true);

 google.maps.event.addDomListener(window, 'load', init);


