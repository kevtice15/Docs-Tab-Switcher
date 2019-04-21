// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

//Get the tabs that matcht the google docs url
chrome.tabs.query({url: "*://docs.google.com/*"}, function(results) {
  //console.log(results);
  //Get the container for the extension
  let container = document.getElementById('ext-container');
  console.log("Data back: ", results);
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
      console.log("Daters:", item);
      //Make the li tag
      var newLi = document.createElement("li");
      //Make the favicon img tag, set it to the favicon, give it a css class
      var newFavicon = document.createElement("img");
      newFavicon.setAttribute("src", item.favIconUrl);
      newFavicon.className = "docFavicon";

      //Make the div that will hold the tab title
      var newP = document.createElement("div");
      newP.className="docTextDiv";

      //Make the button that will trigger the window and tab switch, put the window and tab ids on the tag  and give it a css class
      var newItem = document.createElement("button");
      newItem.className="docListItem";
      newItem.setAttribute("data-tabId", item.id);
      newItem.setAttribute("data-windowId", item.windowId);
      //Put the favicon in the button
      newItem.append(newFavicon);
      //Put the title of the tab in the div
      newP.innerHTML = (item.title);
      //Put the div in the button
      newItem.append(newP);
      //Put the button in the li
      newLi.append(newItem);
      //Put the li in the ul
      docTabList.append(newLi);
    }
    //Put the ul in the overall container div.
    container.append(docTabList);
  }
});

document.addEventListener('click', function buttonClicked (event){
  console.log("Is anything happening?:", event);
  if(event.target.matches('.docListItem')){
    console.log(typeof event.target.dataset.tabid);
    console.log(event.target.dataset.tabid);
    var tabIdNo = parseInt(event.target.dataset.tabid);
    var windowIdNo = parseInt(event.target.dataset.windowid);
      chrome.windows.getCurrent({}, function(w){
        console.log("Inner Window: ", w);

        //if the tab is in the current window, just change the tab
        if(windowIdNo === w.id){
          chrome.tabs.update(tabIdNo, {active: true}, function(tab){
            console.log(tab);
          });
        }
        //if different window, change window then change tab
        else{
          chrome.windows.update(windowIdNo, {focused: true}, function(w){
            console.log(w);
            chrome.tabs.update(tabIdNo, {active: true}, function(tab){
              console.log(tab);
              window.close();
            });
          }); 
        }
    });
  }
});


