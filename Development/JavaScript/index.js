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
            file = e.target.files[0];
            console.log(file);
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
            file = e.dataTransfer.files[0];
            console.log(file);
            customText.html(file.name)
            //console.log(e.dataTransfer.files[0])
        },false)

        //uploading the file for processing
        uploadButton.click(()=>{
            if (file){
               var fileReader = new FileReader();

               fileReader.onload = (e)=>{
                let data = new Uint8Array(fileReader.result);

                let wb = XLSX.read(data, {type: 'array'});

                let htmlStr = XLSX.write(wb, {sheet: 'SalesOrders', type: 'binary', bookType:'html'});
                $('#output').html(htmlStr)
               }

                fileReader.onerror = function(ex) {
                  console.log(ex);
                };

                fileReader.readAsArrayBuffer(file)
            }else{
                alert('no file selected')
            }
        })
    }else{
        alert('The File APIs are not fully supported in this browser');
    }
});
