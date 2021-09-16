const URL = ""; // google teachable machine model url
            let model, webcam, labelContainer, maxPredictions;
            let name = "";
            let isIos = false; 
            if (window.navigator.userAgent.indexOf('iPhone') > -1) {
              isIos = true;
              }
    
            async function init() {
                const modelURL = URL + "model.json";
                const metadataURL = URL + "metadata.json";
                model = await tmImage.load(modelURL, metadataURL);
                maxPredictions = model.getTotalClasses();
        
                const flip = true;
                 
                webcam = new tmImage.Webcam(500, 500, flip); 
                await webcam.setup();

                if (isIos) {
                  document.getElementById('kamera').appendChild(webcam.webcam);
                  const webCamVideo = document.getElementsByTagName('video')[0];
                  webCamVideo.setAttribute("playsinline", true);
                  webCamVideo.muted = "true";
                  webCamVideo.style.width = 500 + 'px';
                  webCamVideo.style.height = 500 + 'px';
                } else {
                  document.getElementById("kamera").appendChild(webcam.canvas);
                }
                await webcam.play();
                window.requestAnimationFrame(loop);
                //document.getElementById("kamera").appendChild(webcam.canvas);
            }
            
            init()
            
            async function loop() {
                webcam.update();
                await predict();
                window.requestAnimationFrame(loop);
            }
        
            async function predict() {
                const prediction = await model.predict(webcam.canvas);
                maskevar = 0;
                maskeyok = 0;
                for (let i = 0; i < maxPredictions; i++) {
                    //console.log(prediction);
                    last = prediction[i].probability.toFixed(2)*100 + "%"
                    switch(prediction[i].className){
                        case "Maske VAR":
                         document.getElementById("maskevar").style.width = last;
                         document.getElementById("maskevar").textContent = last;
                         maskevar = last;
                         break;
                        case "Maske YOK":
                         document.getElementById("maskeyok").style.width = last;
                         document.getElementById("maskeyok").textContent = last;
                         maskeyok = last;
                         break;
                    }
                }

                if(maskevar > maskeyok){
                  document.getElementById("status").textContent = "Maske var";
                  document.getElementById("status").style.color = "green";
                  //await fetch("http://192.168.1.9/ledon")
                }else{
                  document.getElementById("status").textContent = "Maske yok";
                  document.getElementById("status").style.color = "red";
                  //await fetch("http://192.168.1.9/ledoff")
              }
            }