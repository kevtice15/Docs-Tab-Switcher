// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

// let changeColor = document.getElementById('changeColor');
// chrome.storage.sync.get('color', function(data) {
//   changeColor.style.backgroundColor = data.color;
//   changeColor.setAttribute('value', data.color);
// });

// changeColor.onclick = function(element) {
//   let color = element.target.value;
//   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     chrome.tabs.executeScript(
//         tabs[0].id,
//         {code: 'document.body.style.backgroundColor = "' + color + '";'});
//   });
// };


//Get the tabs that matcht the google docs url
chrome.tabs.query({url: "*://docs.google.com/*"}, function(results) {
  //console.log(results);
  chrome.storage.sync.set({docsTabs: results}, function(){
    console.log("Set: ", results);
  });
});

//Get the container for the extension
let container = document.getElementById('ext-container');

//Get the data for the tabs
//TODO: Don't need storage API
chrome.storage.sync.get('docsTabs', function(data){
  console.log("Data back: ", data);
  //If no gDocs tabs were found / the array has no items
  if(data.docsTabs.length === 0) {
    var emptyMessageP = document.createElement("p");
    emptyMessageP.innerHTML = ("No Google Docs tabs were found. Maybe you're using a tab suspender?");
    container.append(emptyMessageP);
  }
  //Else display the tabs in a list of buttons
  else {
    var docTabList = document.createElement("ul");
    for(var item of data.docsTabs){
      console.log("Daters:", item);
      var newLi = document.createElement("li");
      var newFavicon = document.createElement("img");
      newFavicon.setAttribute("src", item.favIconUrl);
      newFavicon.className = "docFavicon";
      var newP = document.createElement("div");
      console.log(newFavicon);
      console.log(item.favIconUrl);
      console.log("New favicon after attribute: ", newFavicon);
      var newItem = document.createElement("button");
      newItem.className="docListItem";
      newItem.setAttribute("data-tabId", item.id);
      newItem.setAttribute("data-windowId", item.windowId);
      newItem.append(newFavicon);
      newP.innerHTML = (item.title);
      newP.className="docTextDiv";
      newItem.append(newP);
      newLi.append(newItem);
      docTabList.append(newLi);
    }
    container.append(docTabList);
  }
});


document.addEventListener('click', function buttonClicked (event){
  if(event.target.matches('.docListItem')){
    console.log(typeof event.target.dataset.tabid);
    console.log(event.target.dataset.tabid);
    var tabIdNo = parseInt(event.target.dataset.tabid);
    var windowIdNo = parseInt(event.target.dataset.windowid);
    chrome.windows.getLastFocused(function(oldWindow){
      console.log("Old Window: ", oldWindow);
        chrome.windows.update(windowIdNo, {focused: true}, function(window){
          console.log(window);
          chrome.tabs.update(tabIdNo, {active: true}, function(tab){
            console.log(tab);
          });
        });
    });
  }
});


