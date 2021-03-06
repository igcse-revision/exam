  // Client ID and API key from the Developer Console
      var CLIENT_ID = '364879519218-p5nnfrs24cf1efg8i6av9mo3b0jf6mdk.apps.googleusercontent.com';
      var API_KEY = 'AIzaSyDpIPPq8xmjDkKPSY4RcSzxojWUCs31tMs';

      // Array of API discovery doc URLs for APIs used by the quickstart
      var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

      // Authorization scopes required by the API; multiple scopes can be
      // included, separated by spaces.
      var SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';

      var authorizeButton = document.getElementById('authorize_button');
      var signoutButton = document.getElementById('signout_button');
      
      var DRIVE_SCRIPTS = ["1PN0qM-uQkLj3mlRWbG9LRnAmHMn14O_V", "1d1uu39OYhnukwAugf1akDoJbMMglbG86", "1YbwFTnQCCPd1vsHBOwvQ2PgSROdfxJN-"
      ,"1H-67tEF4RmtGGS7wC-1Q8bs8bu_9yXlW"];

    //   var DRIVE_SCRIPTS = ["1PN0qM-uQkLj3mlRWbG9LRnAmHMn14O_V", "1d1uu39OYhnukwAugf1akDoJbMMglbG86", "1YbwFTnQCCPd1vsHBOwvQ2PgSROdfxJN-"
    //   ,"1H-67tEF4RmtGGS7wC-1Q8bs8bu_9yXlW", "1DOLl0-jtgv4HZniNgQI2xsoPl1M_GkgI", "14gBbei5tIUOsyHJ_9Gtm-fmknJgtz3qH"];

      /**
       *  On load, called to load the auth2 library and API client library.
       */
      function handleClientLoad() {
        gapi.load('client:auth2', initClient);
      }

      /**
       *  Initializes the API client library and sets up sign-in state
       *  listeners.
       */
      function initClient() {
        gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES
        }).then(function () {
          // Listen for sign-in state changes.
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

          // Handle the initial sign-in state.
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
          authorizeButton.onclick = handleAuthClick;
          signoutButton.onclick = handleSignoutClick;
        }, function(error) {
          appendPre(JSON.stringify(error, null, 2));
        });
      }

      /**
       *  Called when the signed in status changes, to update the UI
       *  appropriately. After a sign-in, the API is called.
       */
      function updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
          authorizeButton.style.display = 'none';
          signoutButton.style.display = 'block';
          loadScripts();
          listFiles();
          
        } else {
          authorizeButton.style.display = 'block';
          signoutButton.style.display = 'none';
        }
      }

      /**
       *  Sign in the user upon button click.
       */
      function handleAuthClick(event) {
        gapi.auth2.getAuthInstance().signIn();
      }

      /**
       *  Sign out the user upon button click.
       */
      function handleSignoutClick(event) {
        gapi.auth2.getAuthInstance().signOut();
      }

      /**
       * Append a pre element to the body containing the given message
       * as its text node. Used to display the results of the API call.
       *
       * @param {string} message Text to be placed in pre element.
       */
      function appendPre(message) {
        var pre = document.getElementById('content');
        var textContent = document.createTextNode(message + '\n');
        pre.appendChild(textContent);
      }

      /**
       * Print files.
       */
      function listFiles() {
        gapi.client.drive.files.list({
          'pageSize': 10,
          'fields': "nextPageToken, files(id, name)"
        }).then(function(response) {
          appendPre('Files:');
          var files = response.result.files;
          if (files && files.length > 0) {
            for (var i = 0; i < files.length; i++) {
              var file = files[i];
              appendPre(file.name + ' (' + file.id + ')');
            }
          } else {
            appendPre('No files found.');
          }
        });
      }
      
      function loadScripts() {
        if(DRIVE_SCRIPTS.length == 0) {
            console.log("All scripts loaded");
            loadData();
            return;
        }
        
        loadScript("https://docs.google.com/uc?id="+DRIVE_SCRIPTS.pop(), function(){
            loadScripts();
        });
      }
      
      function loadScript(url, callback) {
          console.log("Loading Script: "+url);
        var script = document.createElement("script")
        script.type = "text/javascript";
    
        if (script.readyState){  //IE
            script.onreadystatechange = function(){
                if (script.readyState == "loaded" ||
                        script.readyState == "complete"){
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else {  //Others
            script.onload = function(){
                callback();
            };
        }
    
        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
      }