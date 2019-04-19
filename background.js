// chrome.runtime.onInstalled.addListener(function() {
//     chrome.storage.sync.set({color: '#3aa757'}, function() {
//       console.log("The color is green.");
//     });
//     chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
//         chrome.declarativeContent.onPageChanged.addRules([{
//           conditions: [new chrome.declarativeContent.PageStateMatcher({
//             pageUrl: {hostEquals: 'developer.chrome.com'},
//           })
//           ],
//               actions: [new chrome.declarativeContent.ShowPageAction()]
//         }]);
//       });
//       chrome.tabs.query({url: "*://docs.google.com/*"}, function(results) {
//         //console.log(results);
//         chrome.storage.sync.set({docsTabs: results}, function(){
//             console.log("Set: ", results);
//         });
//       });
//   });

chrome.browserAction.onClicked.addListener(function(activeTab)
{
    chrome.tabs.query({url: "*://docs.google.com/*"}, function(results) {
        //console.log(results);
        chrome.storage.sync.set({docsTabs: results}, function(){
            console.log("Set: ", results);
        });
      });
});
