$(document).ready(() => {
    alert('PLEASE NOTE\n\nPlease save the sheet that will be used as Sheet1')
    

    if (window.File && window.FileReader && window.FileList && window.Blob) {

        let customButton = $('#customButton');
        let customText = $('#customText');
        let uploadButton = $('#uploadButton');
        let dropZone = document.getElementById('dropZone');
        let exportBtn = $('#exportBtn');
        let getResults = $("#getResults");
        let updateBtn = $("#updateBtn")
        let file;
        let workBook, excelIO;
        let csvArr;

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
            // if (!e.dataTransfer.files[0].type==='xlsx'){ //to check if the file uploaded is of the correct type
            //     alert('we can only take xlsl files')
            // }
            file = e.dataTransfer.files[0];
            customText.html(file.name)
                //console.log(e.dataTransfer.files[0])
        }, false)

        //uploading the file for processing
        uploadButton.click(() => {
            let c = document.getElementById('output').children;
            if (c.length !== 0){
                document.getElementById('output').innerHTML = "";
            }
            if (file) {

                /*DO NOT REMOVE THIS CODE AS YET. IN CASE THE SPREADJS THINNGING DOES NOT WORK */
                // var fileReader = new FileReader();

                // fileReader.onload = (e) => {
                //     let data = new Uint8Array(fileReader.result);

                //     let wb = XLSX.read(data, { type: 'array' });

                //     let htmlStr = XLSX.write(wb, { sheet: 'SalesOrders', type: 'binary', bookType: 'html' });
                //     $('#output').html(htmlStr)
                // }

                // fileReader.onerror = function(ex) {
                //     console.log(ex);
                // };

                // fileReader.readAsArrayBuffer(file)
                workBook = new GC.Spread.Sheets.Workbook(document.getElementById("output"));
                excelIO = new GC.Spread.Excel.IO();
                excelIO.open(file, (json)=>{
                    let workBookObj= json;
                    
                    workBook.fromJSON(workBookObj);
                   // console.log(workBook)
                    workBook.setActiveSheet("Sheet1");
                    let jsonStr = JSON.parse(JSON.stringify(workBook.sheets["1"]))
                    let rowCount = jsonStr.rows.length;
                    csvArr = [];
                    let obj = null;
                    for(let i = 1; i < rowCount; i++){
                       // console.log(jsonStr.data.dataTable[i])
                        obj = {
                            task: jsonStr.data.dataTable[i][0].value,
                            start: jsonStr.data.dataTable[i][1].value,
                            end: jsonStr.data.dataTable[i][2].value
                        };
                        csvArr.push(obj);
                    }
                    $("#getResults").prop("disabled", false);
                    
                }, (e)=>{
                    console.log(e)
                })
            } else {
                alert('no file selected')
            }
        });
        //displaying output as pop up 
        // $(".trigger_popup_fricc").click(function(){
        //     $('.hover_bkgr_fricc').show();
        // });
        // $('.hover_bkgr_fricc').click(function(){
        //     $('.hover_bkgr_fricc').hide();
        // });
        $('.popupCloseButton').click(function(){
            $('.hover_bkgr_fricc').hide();
        });

        getResults.click(()=>{
            //to add Gant Chart plotting functionality 
            // $("#example").empty();
            // let data = csvArr;
              
            //   var colorScale = new Plottable.Scales.Color();
              
            //   var xScale = new Plottable.Scales.Time();
            //   var xAxis = new Plottable.Axes.Time(xScale, "bottom");
              
            //   var yScale = new Plottable.Scales.Category();
            //   var yAxis = new Plottable.Axes.Category(yScale, "left");
              
            //   var plot = new Plottable.Plots.Rectangle()
            //     .x(function(d) { return new Date(d.start); }, xScale)
            //     .x2(function(d) { return new Date(d.end); })
            //     .y(function(d) { return d.task; }, yScale)
            //     .attr("fill", function(d) { return d.task; }, colorScale)
            //     .addDataset(new Plottable.Dataset(data));
              
            //   var chart = new Plottable.Components.Table([
            //     [yAxis, plot],
            //     [null, xAxis]
            //   ]);
            
            
             // chart.renderTo("svg#outputSVG");
             Highcharts.ganttChart('outputDiv', {
                 title: {
                     text: 'Example Gannt Chart'
                 },
                 series: [{
                     name: 'Project 1',
                     data: [
                         {
                             id: 's',
                             name: 'Start Prototype',
                             start: Date.UTC(2014, 10,10),
                             end: Date.UTC(2014, 10, 20)
                         },
                         {
                            id: 'b',
                            name: 'Develop',
                            start: Date.UTC(2014, 10,20),
                            end: Date.UTC(2014, 10, 25)
                        },
                        {
                            id: 'a',
                            name: 'Run Acceptance Tests',
                            start: Date.UTC(2014, 10,23),
                            end: Date.UTC(2014, 10, 26)
                        },
                        {
                            name: 'Test Prototype',
                            start: Date.UTC(2014, 10,17),
                            end: Date.UTC(2014, 10, 29),
                            dependency: ['a', 'b']
                        },
                     ]
                 }]
             });
             $('.hover_bkgr_fricc').show();

        })

        //update the user's changes on the workbook
        updateBtn.click(()=>{
            if (file){
                let json = JSON.stringify(workBook.toJSON())
                excelIO.save(json, (blob)=>{
                    file = blob;
                    excelIO.open(file, (json)=>{
                    
                        workBook.fromJSON(json);
                        workBook.setActiveSheet("Sheet1");
                    }, (e)=>{
                        console.log(e)
                    })
                }, (e)=>{
                    if (e.errorCode ===1){
                        alert(e.errorMessage);
                    }
                });
                
            }else{
                alert("Please select file")
            }
        })

        let doc = new jsPDF();
        let specialElementHandlers = {
            "#editor": (element, renderer) => {
                return true;
            }

        };
        //download the results based on the user's preferred file type
        exportBtn.click(() => {
            if (file) {

                let select = document.getElementById('exportAs');
                let selectedOption = select.options[select.selectedIndex].value;
                let theOutput = document.getElementById('outputSVG');

                switch (selectedOption) {
                    case "pdf":
                        // doc.fromHTML(theOutput, 20, 20, {
                        //     'width': 170,
                        //     'elementHandlers': specialElementHandlers
                        // });
                        const svgElement = document.getElementById('outputSVG');
                        let pdf = new jsPDF();
                        svgElementToPdf(svgElement, pdf, {
                        scale: 72/96, // this is the ratio of px to pt units
                        removeInvalid: true // this removes elements that could not be translated to pdf from the source svg
                    });
                    pdf.output('datauri');
                        // const width = 300, height = 200;

                        // // create a new jsPDF instance
                        // const pdf = new jsPDF('l', 'pt', [width, height]);

                        // // render the svg element
                        // svg2pdf(svgElement, pdf, {
                        //     xOffset: 0,
                        //     yOffset: 0,
                        //     scale: 1
                        // });

                        // // get the data URI
                        // const uri = pdf.output('datauristring');

                        // // or simply safe the created pdf
                        // pdf.save('myPDF.pdf');
                        
                        // var fileName = file.name;
                        // var res = fileName.split(".");

                        // doc.save(res[0] + ".pdf");
                        break;

                    case "png":
                        let element = document.getElementById('outputHalf');
                        html2canvas(element).then((canvas)=>{
                            // var fileName = file.name;
                            // var res = fileName.split(".");
                            // if (navigator.userAgent.indexOf("MSIE ") > 0 || navigator.userAgent.match(/Trident.*IV\:11\./)){
                            //     let blob = canvas.msToBlob();
                            //     window.navigator.msSaveBlob(blob,res[0]+"png")
                            // }else{
                            //     $("#test").attr("href", canvas.toDataURL("image/png"));
                            //     $("#test").attr("download",res[0]+ 'png');
                            //     $("#test")[0].click();
                            // }
                        	let base64Image = canvas.toDataURL("image/png");
                        	var block = base64Image.split(";");
			    			var mimeType  = block[0].split(":")[1];
			    			var realData = block[1].split(",")[1];
                            var canvasBlob = b64toBlob(realData, mimeType);
                            
                        	var fileName = file.name;
                            var res = fileName.split(".");

                        	window.saveAs(canvasBlob, res[0]+ ".png");
                        })
                        //saveSvgAsPng(document.getElementById("outputSVG"), "diagram.png");
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
//convert array of obbjects to csv
function convertArrayOfObjectsToCSV(args) {
    var result, ctr, keys, columnDelimiter, lineDelimiter, data;

    data = args.data || null;
    if (data == null || !data.length) {
        return null;
    }

    columnDelimiter = args.columnDelimiter || ',';
    lineDelimiter = args.lineDelimiter || '\n';

    keys = Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach(function(item) {
        ctr = 0;
        keys.forEach(function(key) {
            if (ctr > 0) result += columnDelimiter;

            result += item[key];
            ctr++;
        });
        result += lineDelimiter;
    });

    return result;
}

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

