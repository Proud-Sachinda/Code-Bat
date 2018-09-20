$(document).ready(() => {

    if (window.File && window.FileReader && window.FileList && window.Blob) {

        let customButton = $('#customButton');
        let customText = $('#customText');
        let uploadButton = $('#uploadButton');
        let dropZone = document.getElementById('dropZone');
        let exportBtn = $('#exportBtn');
        let file;
        let getCanvas;

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

                    let htmlStr = XLSX.write(wb, { sheet: 'SalesOrders', type: 'binary', bookType: 'html' });
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

        let doc = new jsPDF();
        let specialElementHandlers = {
            "#editor": (element, renderer) => {
                return true;
            }

        };

        exportBtn.click(() => {
            if (file) {

                let select = document.getElementById('exportAs');
                let selectedOption = select.options[select.selectedIndex].value;
                let theOutput = document.getElementById('output');

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
                        let element = document.getElementById('output');
                        html2canvas(element).then((canvas)=>{
                        	let base64Image = canvas.toDataURL("image/png");
                        	var block = base64Image.split(";");
			    			var mimeType  = block[0].split(":")[1];
			    			var realData = block[1].split(",")[1];
                            var canvasBlob = b64toBlob(realData, mimeType);
                            
                        	var fileName = file.name;
                            var res = fileName.split(".");

                        	window.saveAs(canvasBlob, res[0]+ ".png");
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

      var blob = new Blob(byteArrays, {type: contentType});
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

