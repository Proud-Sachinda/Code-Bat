
$(document).ready(()=>{

    if (window.File && window.FileReader && window.FileList && window.Blob){

        let customButton = $('#customButton');
        let customText = $('#customText');
        let uploadButton = $('#uploadText');
         let dropZone = document.getElementById('dropZone');
        let file;


        customButton.click(()=>{
           $('#file').click();
        });
        $('#file').change(()=>{
            if($('#file').val()){
                console.log($('#file').val())
                customText.html($('#file').val().match(/[\/\\]([\w\d\s\.\-\(\)]+)$/)[1])
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
            if (!e.dataTransfer.files[0].type==='xlsx'){
                alert('we can only take xlsl files')
            }
            console.log(e.dataTransfer.files)
        },false)

        // $('#dropZone').on('dragover', (e)=>{
        //     e.stopPropagation();
        //     e.preventDefault();
        //     e.dataTransfer.dropEffect = 'copy'
        // }, false);
        // $('#dropZone').on('drop', (e)=>{
        //     e.stopPropagation();
        //     e.preventDefault();
        //     alert(e.dataTransfer.files[0].name)
        // },false)



    }else{
        alert('The File APIs are not fully supported in this browser');
    }
});
    
