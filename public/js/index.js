$(document).ready(() => {
    // alert('PLEASE NOTE\n\nPlease save the sheet that will be used as Sheet1')
    $('#rules').show();
    if (window.File && window.FileReader && window.FileList && window.Blob) {

        let customButton = $('#customButton');
        let customText = $('#customText');
        let uploadButton = $('#uploadButton');
        let dropZone = document.getElementById('dropZone');
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
            file = e.dataTransfer.files[0];
            customText.html(file.name)
        }, false);

        //uploading the file for processing
        uploadButton.click(() => {
            let c = document.getElementById('output').children;
            if (c.length !== 0){
                document.getElementById('output').innerHTML = "";
            }
            if (file) {
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
                       let sYear = jsonStr.data.dataTable[i][1].value.split("-")[0];
                       let sMonth = jsonStr.data.dataTable[i][1].value.split("-")[1];
                       let sDay = jsonStr.data.dataTable[i][1].value.split("-")[2];

                       let eYear = jsonStr.data.dataTable[i][2].value.split("-")[0];
                       let eMonth = jsonStr.data.dataTable[i][2].value.split("-")[1];
                       let eDay = jsonStr.data.dataTable[i][2].value.split("-")[2];
                        obj = {
                            id: i,
                            name: jsonStr.data.dataTable[i][0].value,
                            start:Date.UTC(sYear, sMonth, sDay),
                            end: Date.UTC(eYear, eMonth, eDay)
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

        $('.popupCloseButton').click(function(){
            $('.hover_bkgr_fricc').hide();
        });

        getResults.click(()=>{
             Highcharts.ganttChart('outputDiv', {
                 title: {
                     text: 'Gantt Chart'
                 },
                 series: [{
                     name: 'Project 1',
                     data: csvArr
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

