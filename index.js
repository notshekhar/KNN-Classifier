let video = document.querySelector('.video')
let canvas = document.createElement('canvas')
let screen = canvas.getContext('2d')
let trainButton = document.querySelectorAll('.train')
let knn = ml5.KNNClassifier()
let featureExtractor = ml5.featureExtractor('MobileNet', modelReady);
let tf = false
let i = new Image()
let exampleAdded = false
let counters = document.querySelectorAll('.count')
let rc=0, gc=0, bc=0
//playing video
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({
    video: true
  }).then(function (stream) {
    video.srcObject = stream
    video.play()
  })
}
function modelReady(){
  document.querySelector('.preload').style.display = "none"
  document.querySelector('.body').style.display = "block"
  console.log('model loaded')
  tf = true
}

trainButton[0].onclick = () => {
  rc++
  counters[0].innerHTML = rc
  screen.drawImage(video, 0, 0, canvas.width, canvas.height)
  let url = canvas.toDataURL()
  i.src = url
  addFeature(i, 'red')
}
trainButton[1].onclick = () => {
  gc++
  counters[1].innerHTML = gc
  screen.drawImage(video, 0, 0, canvas.width, canvas.height)
  let url = canvas.toDataURL()
  i.src = url
  addFeature(i, 'green')
}
trainButton[2].onclick = () => {
  bc++
  counters[2].innerHTML = bc
  screen.drawImage(video, 0, 0, canvas.width, canvas.height)
  let url = canvas.toDataURL()
  i.src = url
  addFeature(i, 'blue')
}
function addFeature(i, c){
  if(tf){
    console.log(`added ${c}`)
    if(!exampleAdded){
      exampleAdded = true
    }
    let feature = featureExtractor.infer(i)
    knn.addExample(feature, c)
  }else{
    console.log('model is not loaded yet')
  }
}
function startClassification(i){
  if(tf && exampleAdded){
    let feature = featureExtractor.infer(i)
    knn.classify(feature, (err, result) => {
      let rsl = result
      if(rsl){
        document.querySelectorAll('.p').forEach(e=>{
          e.style.width = "0%"
        })
        let element = document.querySelector(`.${rsl.label}`)
        let confidence = rsl.confidencesByLabel[rsl.label]
        element.style.width = `${confidence*100}%`
      }
    })
  }
}
setInterval(()=>{
  screen.drawImage(video, 0, 0, canvas.width, canvas.height)
  let url = canvas.toDataURL()
  i.src = url
  startClassification(i)
}, 21)
