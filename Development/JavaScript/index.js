
$(document).ready(()=>{

    if (window.File && window.FileReader && window.FileList && window.Blob){

        let customButton = $('#customButton');
        let customText = $('#customText');
        let uploadButton = $('#uploadButton');
         let dropZone = document.getElementById('dropZone');
         let output = $('#output');
        
        let file;
    


        customButton.click(()=>{
           $('#file').click();
        });
        $('#file').change((e)=>{
            file = e.target.files[0]
            if($('#file').val()){
               // console.log($('#file').val())
                customText.html(file.name)
            }else{
                customText.html('No File Chosen')
            }
        });

        dropZone.addEventListener('dragover', (e)=>{
               e.stopPropagation();
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy' ;
        },false);
        dropZone.addEventListener('drop',(e)=>{
                 e.stopPropagation();
            e.preventDefault();
            // if (!e.dataTransfer.files[0].type==='xlsx'){
            //     alert('we can only take xlsl files')
            // }
            file = e.dataTransfer.files[0];
            customText.html(file.name)
            //console.log(e.dataTransfer.files[0])
        },false)

        //uploading the file for processing
        uploadButton.click(()=>{
            if (file){
               var fileReader = new FileReader();
               fileReader.onload = (e) =>{
                   let data = e.target.result;
                  
                   var workbook = XLSX.read(data, {
                    type: 'binary'
                  });
                  workbook.SheetNames.forEach(function(sheetName) {
                    // Here is your object
                    var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                    var json_object = JSON.stringify(XL_row_object);
                    console.log(json_object);
            
                  })
            
                };
            
                fileReader.onerror = function(ex) {
                  console.log(ex);
                };
            
                fileReader.readAsBinaryString(file);
            }else{
                alert('no file selected')
            }
        })
    }else{
        alert('The File APIs are not fully supported in this browser');
    }
});
    
