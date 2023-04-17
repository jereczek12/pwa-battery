if ('getBattery' in navigator || ('battery' in navigator && 'Promise' in window)) {
    var target = document.getElementById('target');
  
    function handleChange(change) {
      var timeBadge = new Date().toTimeString().split(' ')[0];
      var newState = document.createElement('p');
      newState.innerHTML = '' + timeBadge + ' ' + change + '.';
      target.appendChild(newState);
    }
    
    function onChargingChange() {
      handleChange('Battery charging changed to ' + (this.charging ? 'charging' : 'discharging') + '')
    }
    function onChargingTimeChange() {
      handleChange('Battery charging time changed to ' + this.chargingTime + ' s');
    }
    function onDischargingTimeChange() {
      handleChange('Battery discharging time changed to ' + this.dischargingTime + ' s');
    }
    function onLevelChange() {
      handleChange('Battery level changed to ' + this.level + '');
    }
  
    var batteryPromise;
    
    if ('getBattery' in navigator) {
      batteryPromise = navigator.getBattery();
    } else {
      batteryPromise = Promise.resolve(navigator.battery);
    }
    
    batteryPromise.then(function (battery) {
      document.getElementById('charging').innerHTML = battery.charging ? 'charging' : 'discharging';
      document.getElementById('chargingTime').innerHTML = battery.chargingTime + ' s';
      document.getElementById('dischargingTime').innerHTML = battery.dischargingTime + ' s';
      document.getElementById('level').innerHTML = battery.level;
      
      battery.addEventListener('chargingchange', onChargingChange);
      battery.addEventListener('chargingtimechange', onChargingTimeChange);
      battery.addEventListener('dischargingtimechange', onDischargingTimeChange);
      battery.addEventListener('levelchange', onLevelChange);
      var elem = document.getElementById("myBar");
    var width=battery.level*100;
    elem.style.width = width + "%";
    elem.innerHTML = width + "%";
    })

    function getUserMedia(constraints) {
      // if Promise-based API is available, use it
      if (navigator.mediaDevices) {
        return navigator.mediaDevices.getUserMedia(constraints);
      }
        
      // otherwise try falling back to old, possibly prefixed API...
      var legacyApi = navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia;
        
      if (legacyApi) {
        // ...and promisify it
        return new Promise(function (resolve, reject) {
          legacyApi.bind(navigator)(constraints, resolve, reject);
        });
      }
    }
    
    function getStream (type) {
      if (!navigator.mediaDevices && !navigator.getUserMedia && !navigator.webkitGetUserMedia &&
        !navigator.mozGetUserMedia && !navigator.msGetUserMedia) {
        alert('User Media API not supported.');
        return;
      }
    
      var constraints = {};
      constraints[type] = true;
      
      getUserMedia(constraints)
        .then(function (stream) {
          var mediaControl = document.querySelector(type);
          
          if ('srcObject' in mediaControl) {
            mediaControl.srcObject = stream;
          } else if (navigator.mozGetUserMedia) {
            mediaControl.mozSrcObject = stream;
          } else {
            mediaControl.src = (window.URL || window.webkitURL).createObjectURL(stream);
          }
          
          mediaControl.play();
        })
        .catch(function (err) {
          alert('Error: ' + err);
        });
    }
    

};
