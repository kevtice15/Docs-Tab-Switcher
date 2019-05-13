// Copyright 2019 KeVon Ticer
'use strict';

//Get the tabs that match the google docs url
chrome.tabs.query({url: "*://docs.google.com/*"}, function(results) {
  //console.log(results);
  //Get the container for the extension
  let container = document.getElementById('ext-container');
  // console.log("Data back: ", results);
  //If no gDocs tabs were found / the array has no items
  if(results.length === 0) {
    var emptyMessageP = document.createElement("p");
    emptyMessageP.innerHTML = ("No Google Docs tabs were found. Maybe you're using a tab suspender?");
    emptyMessageP.className = "empty-message";
    container.append(emptyMessageP);
  }
  //Else display the tabs in a list of buttons
  else {
    var docTabList = document.createElement("ul");
    for(var item of results){
      // console.log("Daters:", item);
      //Make the li tag
      var newLi = document.createElement("li");
      //Make the favicon img tag, set it to the favicon, give it a css class
      var newFavicon = document.createElement("img");
      newFavicon.setAttribute("src", item.favIconUrl);
      newFavicon.className = "docFavicon";

      //Make the div that will hold the tab title
      var newP = document.createElement("div");
      newP.className="docTextDiv";

      //Make the button that will trigger the window and tab switch
      var newItem = document.createElement("button");
      newItem.className="docListItem";

      //Put the favicon in the button
      newItem.append(newFavicon);
      //Put the title of the tab in the div
      newP.innerHTML = (item.title);
      //Put the div in the button
      newItem.append(newP);

      //Put the button in the li, put the window and tab ids on the tag  and give it a css class
      newLi.append(newItem);
      newLi.setAttribute("data-tabId", item.id);
      newLi.setAttribute("data-windowId", item.windowId);

      var closeButton = document.createElement("button");
      closeButton.innerHTML = "Close";
      closeButton.id = "close-button"; 
      newLi.append(closeButton);


      //Put the li in the ul
      docTabList.append(newLi);
    }
    //Put the ul in the overall container div.
    container.append(docTabList);
  }
});

document.addEventListener('click', function buttonClicked (event){
  //console.log("Is anything happening?:", event);
  console.log("TYPEOF:", typeof event.target.dataset.tabid);
  console.log(event);
  var tabIdNo = parseInt(event.target.parentNode.dataset.tabid);
  var windowIdNo = parseInt(event.target.parentNode.dataset.windowid);
  if(event.target.matches('.docListItem')){
    console.log(typeof event.target.dataset.tabid);
    // console.log(event.target.dataset.tabid);
    // var tabIdNo = parseInt(event.target.dataset.tabid);
    // var windowIdNo = parseInt(event.target.dataset.windowid);
      chrome.windows.getCurrent({}, function(w){
        //console.log("Inner Window: ", w);

        //if the tab is in the current window, just change the tab
        if(windowIdNo === w.id){
          chrome.tabs.update(tabIdNo, {active: true}, function(tab){
            //console.log(tab);
          });
        }
        //if different window, change window then change tab
        else{
          chrome.windows.update(windowIdNo, {focused: true}, function(w){
            // console.log(w);
            chrome.tabs.update(tabIdNo, {active: true}, function(tab){
              //console.log(tab);
              
            });
          }); 
        }
    });
  }
  else if (event.target.matches('#close-button')){
    chrome.tabs.remove(tabIdNo);
    location.reload();
    //TODO: something if the tab doesn't exist
  }
});



// document.addEventListener('mouseover', function hoveredButton(event) {
//   console.log("Enter:", event);
//   if (event.target.matches('.docListItem')){
//     console.log(event.target);
//     var closeButton = document.createElement("button");
//     closeButton.innerHTML = "Close";
//     closeButton.id = "close-button"; 
//     //Add the close button after the target _as a sibling_
//     event.target.parentNode.append(closeButton);
    
//   }
// });

// document.addEventListener('mouseout', function hoveredButton(event) {
//   if (event.target.matches('.docListItem')){
//     console.log("LEAVE:", event.target);
//     var cB = document.getElementById("close-button");
//     event.target.parentNode.removeChild(cB);
//   }
// });

// document.addEventListener('mouseover', function overCloseButton(event){
//   if(event.target.matches('#close-button')){
//     console.log("IS THIS WORKING??");
//   }
// })

// document.addEventListener('click', function closeClick(event) {
//   if (event.target.matches('#close-button')){
//     console.log("Close click");
//     // var tabIdNo = parseInt(event.target.dataset.tabid);
//     // chrome.tabs.remove(tabIdNo, function(tab){
//     //   console.log ("Closed tab", tab);
//     // })
//   }
// })