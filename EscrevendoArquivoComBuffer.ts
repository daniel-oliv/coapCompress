//rodar npm install fs eu acho
const fs = require('fs');


function getTimeString()
{
    let today = new Date();
    // let dd = today.getDate();
    // let mm = today.getMonth() + 1; //January is 0!
    // let yyyy = today.getFullYear();
    let dateVec = [today.getDate(), today.getMonth() + 1, today.getFullYear()];
    let timeVec = [today.getHours(), today.getMinutes(), today.getSeconds(), today.getMilliseconds()]
    
    let timeStr = dateVec.join('-') + '_' + timeVec.join('-') ;
    return timeStr;
}

function createAndWriteFile(buff, typeMsg = '')
{
    let dir = "./logMsgFiles/"
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    let file_name = typeMsg + getTimeString();
    
    fs.writeFile(dir+ file_name, buff, function(err){
        //Caro ocorra algum erro
      if(err){
            return console.log('erro: ', err)
        }
      //Caso não tenha erro, retornaremos a mensagem de sucesso
        console.log('Arquivo Criado');
    });
}


///example
 createAndWriteFile(block1.toString('hex'));