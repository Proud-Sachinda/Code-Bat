$(document).ready(() => {

    if (window.File && window.FileReader && window.FileList && window.Blob) {

        let customButton = $('#customButton');
        let customText = $('#customText');
        let uploadButton = $('#uploadButton');
        let dropZone = document.getElementById('dropZone');
        let exportBtn = $('#exportBtn');
        let file;
        let getPlotBtn = $("#getPlot");
        let getCanvas;
	      let csv;

        customButton.click(() => {
            $('#file').click();
        });
        $('#file').change((e) => {
            file = e.target.files[0]
            if ($('#file').val()) {
                // console.log($('#file').val())
                customText.html(file.name)
            } else {
                customText.html('No File Chosen')
            }
        });

        dropZone.addEventListener('dragover', (e) => {
            e.stopPropagation();
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        }, false);
        dropZone.addEventListener('drop', (e) => {
            e.stopPropagation();
            e.preventDefault();
            // if (!e.dataTransfer.files[0].type==='xlsx'){
            //     alert('we can only take xlsl files')
            // }
            file = e.dataTransfer.files[0];
            customText.html(file.name)
                //console.log(e.dataTransfer.files[0])
        }, false)

        //uploading the file for processing
        uploadButton.click(() => {
            if (file) {
                var fileReader = new FileReader();

                fileReader.onload = (e) => {
                    let data = new Uint8Array(fileReader.result);

                    let wb = XLSX.read(data, { type: 'array' });

                    let htmlStr = XLSX.write(wb, { sheet: 'Sheet1', type: 'binary', bookType: 'html' });
			const opts = {
			  type: 'binary',
			  bookType: 'csv',
			  sheet: 'Sheet1'
			};
			csv = XLSX.write(wb, opts);

			console.log(csv)
                    $('#output').html(htmlStr)
                }

                fileReader.onerror = function(ex) {
                    console.log(ex);
                };

                fileReader.readAsArrayBuffer(file)
            } else {
                alert('no file selected')
            }
        });

trace1 = {
  x: ['2009-01-01', '2009-02-30'],
  y: [0, 0],
  marker: {color: 'white'},
  name: '',
  type: 'scatter'
};
trace2 = {
  x: ['2009-03-05', '2009-04-15'],
  y: [1, 1],
  marker: {color: 'white'},
  name: '',
  type: 'scatter'
};
trace3 = {
  x: ['2009-02-20', '2009-05-30'],
  y: [2, 2],
  marker: {color: 'white'},
  name: '',
  type: 'scatter'
};
data = [trace1, trace2, trace3];

layout = {
  height: 600,
  hovermode: 'closest',
  shapes: [
    {
      fillcolor: 'rgb(31.0, 119.0, 180.0)',
      line: {width: 0},
      opacity: 1,
      type: 'rect',
      x0: '2009-01-01',
      x1: '2009-02-30',
      xref: 'x',
      y0: -0.2,
      y1: 0.2,
      yref: 'y'
    },
    {
      fillcolor: 'rgb(255.0, 127.0, 14.0)',
      line: {width: 0},
      opacity: 1,
      type: 'rect',
      x0: '2009-03-05',
      x1: '2009-04-15',
      xref: 'x',
      y0: 0.8,
      y1: 1.2,
      yref: 'y'
    },
    {
      fillcolor: 'rgb(44.0, 160.0, 44.0)',
      line: {width: 0},
      opacity: 1,
      type: 'rect',
      x0: '2009-02-20',
      x1: '2009-05-30',
      xref: 'x',
      y0: 1.8,
      y1: 2.2,
      yref: 'y'
    }
  ],
  showlegend: false,
  title: 'Gantt Chart',
  width: 900,
  xaxis: {
    rangeselector: {buttons: [
        {
          count: 7,
          label: '1w',
          step: 'day',
          stepmode: 'backward'
        },
        {
          count: 1,
          label: '1m',
          step: 'month',
          stepmode: 'backward'
        },
        {
          count: 6,
          label: '6m',
          step: 'month',
          stepmode: 'backward'
        },
        {
          count: 1,
          label: 'YTD',
          step: 'year',
          stepmode: 'todate'
        },
        {
          count: 1,
          label: '1y',
          step: 'year',
          stepmode: 'backward'
        },
        {step: 'all'}
      ]},
    showgrid: false,
    type: 'date',
    zeroline: false
  },
  yaxis: {
    autorange: false,
    range: [-1, 4],
    showgrid: false,
    ticktext: ['Job A', 'Job B', 'Job C'],
    tickvals: [0, 1, 2],
    zeroline: false
  }
};

        let doc = new jsPDF();
        let specialElementHandlers = {
            "#editor": (element, renderer) => {
                return true;
            }

        };
	    getPlotBtn.click(() => {

  		Plotly.plot('output1',{
  		data: data,//csvJSON(csv),
      		layout: layout
      } );
      Plotly.plot('fullscreen',{
  		data: data,//csvJSON(csv),
      		layout: layout
      } );
      })


function csvJSON(csv){

  var lines=csv.split("\n");

  var result = [];

  var headers=lines[0].split(",");

  for(var i=1;i<lines.length;i++){

      var obj = {};
      var currentline=lines[i].split(",");

      for(var j=0;j<headers.length;j++){
          obj[headers[j]] = currentline[j];
      }

      result.push(obj);

  }

  //return result; //JavaScript object
  return JSON.stringify(result); //JSON
}
        exportBtn.click(() => {
            if (file) {

                let select = document.getElementById('exportAs');
                let selectedOption = select.options[select.selectedIndex].value;
                let theOutput = document.getElementById('output1');

                switch (selectedOption) {
                    case "pdf":
                        doc.fromHTML(theOutput, 20, 20, {
                            'width': 170,
                            'elementHandlers': specialElementHandlers
                        });

                        var fileName = file.name;
                        var res = fileName.split(".");

                        doc.save(res[0] + ".pdf");
                        break;

                    case "png":
                        let element = document.getElementById('output1');
                        html2canvas(element).then((canvas) => {
                            let base64Image = canvas.toDataURL("image/png");
                            var block = base64Image.split(";");
                            var mimeType = block[0].split(":")[1];
                            var realData = block[1].split(",")[1];
                            var canvasBlob = b64toBlob(realData, mimeType);

                            var fileName = file.name;
                            var res = fileName.split(".");

                            window.saveAs(canvasBlob, res[0] + ".png");
                        })
                        break;

                    case "Download As:":
                        alert('Select File You Would Like To Export To');
                        break;


                    case "pps":

                        alert("to save as pps");
                        break;

                    default:
                        break;
                }
            }
        })


            /**
             * Convert a base64 string in a Blob according to the data and contentType.
             *
             * @param b64Data {String} Pure base64 string without contentType
             * @param contentType {String} the content type of the file i.e (image/jpeg - image/png - text/plain)
             * @param sliceSize {Int} SliceSize to process the byteCharacters
             * @see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
             * @return Blob
             */
        function b64toBlob(b64Data, contentType, sliceSize) {
            contentType = contentType || '';
            sliceSize = sliceSize || 512;

            var byteCharacters = atob(b64Data);
            var byteArrays = [];

            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                var slice = byteCharacters.slice(offset, offset + sliceSize);

                var byteNumbers = new Array(slice.length);
                for (var i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                var byteArray = new Uint8Array(byteNumbers);

                byteArrays.push(byteArray);
            }

            var blob = new Blob(byteArrays, { type: contentType });
            return blob;
        }



    } else {
        alert('The File APIs are not fully supported in this browser');
    }
})

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}


// Get the modal
var modal = document.getElementById('myModal');
var btn = document.getElementById("myBtn"); // Get the button that opens the modal

var span = document.getElementsByClassName("close")[0]; // Get the <span> element that closes the modal

// When the user clicks the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
