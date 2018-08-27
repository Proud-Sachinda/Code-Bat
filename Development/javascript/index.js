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
                        doc.save(file.name + "pdf");
                        break;
                    case "png":
                        domtoimage.toBlob(theOutput)
                            .then(function(blob) {
                                window.saveAs(blob, 'my-node.png');
                            });
                    case "pps":

                        break;
                        alert("to save as pps");
                        break;

                    default:
                        break;
                }
            }
        })



    } else {
        alert('The File APIs are not fully supported in this browser');
    }
})
