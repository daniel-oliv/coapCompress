const SmartBlock = require('./smartBlock.js');

class Compressor
{
    constructor(data1, data2)
    {
        ///this.data1 will never be smaller than this.data2
        if(data1.completeData.length > data2.completeData.length)
        {
            this.data1 = data1;
            this.data2 = data2;    
            //console.log("data1", this.data1);
        }
        else
        {
            this.data1 = data2;
            this.data2 = data1; 
        }
        
        /// for keep common blocks considering data1 and 2
        this.smartBlocks = [];
        ///just the bigger blocks
        this.dictionary = [];

        this.currentStartShift = Compressor.shiftDepths[0];
        Compressor.shiftDepths.push(data1.completeData.length);
        Compressor.shiftInterStrDepths.push(data1.completeData.length);
    }

    getDescendingSizeSmartBlocks()
    {
        let ordered = [];
        let insertedElement = true; /// since the firt element will be added by default
        if(this.smartBlocks.length === 0)
        {
            return ordered;
        }

        /// if it is not empty
        ordered.push(this.smartBlocks[0])
        for (const sb of this.smartBlocks) 
        {
            for (const sbOrdered of ordered) 
            {
                /// if sb is bigger than the current sbOrdered, insert sb before
                if(sb.getBuffer.length > sbOrdered.getBuffer.length)
                {
                    ordered.splice(ordered.indexOf(sbOrdered), 0, sb);
                    insertedElement = true;
                    break;
                }
            }
            
            /// if it was not inserted, push it at the end, since it is the smallest til now
            if (insertedElement === false) 
            {
                ordered.push(sb);
            }
            insertedElement = false;
        }
        return ordered;
    }

    appendToAndValidateDepths(biggerLength)
    {
        let inserted = false;
        for (const key in Compressor.shiftDepths) 
        {
            if(Compressor.shiftDepths[key] >= biggerLength)
            {
                Compressor.shiftDepths[key] = biggerLength;
                Compressor.shiftDepths.length = parseInt(key)+1;
            }
        }

    }


    findCommonStartByteIndexes(startIndexes)
    {
        //console.log("findCommonStartByteIndexes searching for a new start");
        let commomIndexFounded = false;
        let shiftInterStr = 0;
        let indexes = [startIndexes[0], startIndexes[1]];
       
        /// use to control the levels of alterning shift - 
        /// for example shiftDepths = [0 3 5] - it will be searched strings with 0 1 and 2 bytes shifted between them,
        /// and after, strings with 3, 4 and 5 bits shifted between them
        for (let iDepth2 = 0; iDepth2 < Compressor.shiftInterStrDepths.length-1; iDepth2++)
        for (let iDepth = 0; iDepth < Compressor.shiftDepths.length-1; iDepth++) 
        {       
            //console.log("iDepth",iDepth);     
            /// testing the shiftInterStr=0 again for every depth of shiftFromStartIndex
            /// stopped with return
            for ( shiftInterStr = Compressor.shiftInterStrDepths[iDepth2];
                shiftInterStr < Compressor.shiftInterStrDepths[iDepth2+1] && (!commomIndexFounded);
                  shiftInterStr++)
            {
            for (let shiftFromStartIndex = Compressor.shiftDepths[iDepth]; 
                shiftFromStartIndex < Compressor.shiftDepths[iDepth+1];
                shiftFromStartIndex++)
            {
                indexes[0] = startIndexes[0]+shiftFromStartIndex+shiftInterStr;
                indexes[1] = startIndexes[1]+shiftFromStartIndex;
                
////////////////return
                if(this.isDataEndReached(indexes[0], indexes[1])) return commomIndexFounded;

                if(this.data1.completeData[indexes[0]] === this.data2.completeData[indexes[1]])
                {
                    commomIndexFounded = true;
                    startIndexes[0] = indexes[0];
                    startIndexes[1] = indexes[1];
                    console.log("startIndexes", startIndexes);
////////////////return
                    return commomIndexFounded;
                }
                ///shift the other string
                indexes[0] = startIndexes[0]+shiftFromStartIndex;
                indexes[1] = startIndexes[1]+shiftFromStartIndex+shiftInterStr;

/////////////////return
                if(this.isDataEndReached(indexes[0], indexes[1])) return commomIndexFounded;

                if(this.data1.completeData[indexes[0]] === this.data2.completeData[indexes[1]])
                {
                    commomIndexFounded = true;
                    startIndexes[0] = indexes[0];
                    startIndexes[1] = indexes[1];
                    console.log("startIndexes", startIndexes);
////////////////return
                    return commomIndexFounded;
                }
            }
            }
        }
        console.log(startIndexes);
        return commomIndexFounded;
    }

    isDataEndReached(index1, index2)
    {
        if(index1 >= this.data1.completeData.length || index2 >= this.data2.completeData.length)
        {
            return true;  
        }
        return false;
    }

    findNextDiffBytesIndexes(startIndexes, differentIndexes)
    {
        //console.log("findNextDiffBytesIndexes searching for a new endDiff");
        let endDataReached = false;
        let i = startIndexes[0];
        let j = startIndexes[1];

        /// entra somando 1 na primeira vez, porque o primeiro é o bloco (nem sempre byte) igual encontrado anteriormente
        while(i<this.data1.completeData.length && j < this.data2.completeData.length
            && this.data1.completeData[i] === this.data2.completeData[j])
        {
            i++;
            j++;
        }

        if(i === this.data1.completeData.length || j === this.data2.completeData.length
            && this.data1.completeData[i] === this.data2.completeData[j])
        {
            // i++;
            // j++;
            endDataReached = true;
        }
        differentIndexes[0] = i;
        differentIndexes[1] = j;
        console.log("differentIndexes ", differentIndexes);
        return endDataReached;
    }
    fillSmartBlocks()
    {
        let commonStart = [0, 0];
        let currentDiff = [];
        let endSearch = false;
        while(!endSearch)
        {   
            //console.log("starting analyzing byte " + i1 + "from the string 1");

            /// for very index and shifting
            let commonBytesFounded = this.findCommonStartByteIndexes(commonStart);
            
            if(!commonBytesFounded || endSearch)
            {
////////////////
                //console.log(this.smartBlocks);
                break;
            }
            let endDataReached = this.findNextDiffBytesIndexes(commonStart, currentDiff);
            //console.log(currentDiff);
            //console.log(diffBytesFounded);

            // está somando sequencialmente o nextCode dentro do construtor
            let sb = new SmartBlock(this.data1.completeData.slice(commonStart[0], currentDiff[0]));
            this.smartBlocks.push(sb);
           
            if(endDataReached)
            {
                //console.log("The end of one string was reached!");
                //console.log("end1[" + i1 + "]   end2[" + i2 + "]");
                endSearch=true;
////////////////
                //console.log(this.smartBlocks);
                break;
            }
            
            commonStart[0] = currentDiff[0];
            commonStart[1] = currentDiff[1];

            // if(TESTE>3)
            // {
            //     TESTE++;
            //     return;
            // }
            // TESTE++;
            //console.log("next commom start ", commonStart);
        }
        /// ordering smartBlocks from smaller to bigger blocks
        //console.log("smartBlocks", this.smartBlocks);
        this.smartBlocks = this.getDescendingSizeSmartBlocks();
        
        //console.log("smartBlocks", this.smartBlocks);
        //console.log("getDicBlocksInData ", this.getDicBlocksInData(this.data1.completeData));

        let dicBlocksPresent = this.getDicBlocksInData(this.data1.completeData);
        dicBlocksPresent = this.getOrderedDicBlocksPresent(dicBlocksPresent);

        //console.log("getBlockClasses ", this.getBlockClasses(dicBlocksPresent, this.data1.completeData));
        let codeBlocksLength, dataBlocksLength, indexMap;
        [codeBlocksLength, dataBlocksLength, indexMap] = this.getBlockClasses(dicBlocksPresent, this.data1.completeData);
        
        //console.log("indexMap ", indexMap.map((d)=>{return d.type}));
        //console.log("indexMap ", indexMap);
        
        this.compressFixedPassBlockType(indexMap, dicBlocksPresent, this.data1.completeData);
    }

    /*
        for every eight bit, there is a bit to indicate type
        0 - data block
        1 - coded block

        Structure
        Endereços - Funcionalidade
        0;8-1     - Indica se é 
                    000 - Dado normal
                    001 - Codificado
                    010 - Dicionário
                    ... - Talvez usamos para lempelZiv ou outra compressão ou para controle de diferentes dicionários
        8;n+8+r-1   - Bits to indicate the type of the n following bytes
        8+n+r-8+n+r+8n-1 - payload, containing the coded and data blocks

    */
    compressFixedPassBlockType(indexMap, dicBlocksPresent,  dataBuffer)
    {
        /// calculating the number of payload data (code blocks and raw data blocks - blocks = bytes in this case)
        let nPayloadBytes = 0;
        for (const multiBlock of indexMap) {
            //every code block will fill just one byte
            if(multiBlock.type == "code")
            {
                nPayloadBytes++;
            }
            else //on the other hand, every byte in data will fill one byte in the compressed data
            {
                nPayloadBytes += multiBlock.length;
            }
        }

        ///number of necessary bytes to keep type control bits
        let nTypesField = Math.ceil(nPayloadBytes/8);
        /// 1 byte - controle ; Math.ceil(n/8) bytes - following byte types ; n bytes - payload containing the coded and raw data
        let nTotalBytes = 1 + nTypesField + nPayloadBytes;
        
        let compressedData = Buffer.alloc(nTotalBytes);
        let payloadBuf = Buffer.alloc(nPayloadBytes);

        compressedData.writeInt8(1);//10 - dado codificado
        //console.log("first compressedData byte: ", compressedData);
        
        let iControlBit = 0;
        ///it must start at 2nd byte since 1st byte was used to indicate the message type
        let iControlByte = 1;
        let payloadByte = 0;
        ///dicBlocksPresent is already ordered before calling this function
        let pbIndex = 0
        for (let index = 0; index < dataBuffer.length; index++)
        {
            for (; pbIndex < dicBlocksPresent.length; pbIndex++)
            {
                let presentBl = dicBlocksPresent[pbIndex];
                ///while is data, and the next code block wasn't reached, add 0 to control-type bytes and add data to the auxiliar buffer
                while(!this.isInsideTheBlock(presentBl, index))
                {      
                    ////// taking care of the type control bits
                    compressedData.writeBit(iControlByte,iControlBit,0);
                    iControlBit++;
                    ///if a control byte was full, go to the next 
                    if(iControlBit % 8 === 0) iControlByte++;
                  
                    payloadBuf[payloadByte] = dataBuffer[index];
                    index++;
                }

                ////// taking care of the type control bits
                compressedData.writeBit(iControlByte,iControlBit,1);
                iControlBit++;
                ///if a control byte was full, go to the next 
                if(iControlBit % 8 === 0) iControlByte++;

                payloadBuf.writeInt8(presentBl.block.getCodeInt, payloadByte);
                payloadByte++;
                index += presentBl.length;
            }
            
            ////// taking care of the type control bits
            compressedData.writeBit(iControlByte,iControlBit,0);
            iControlBit++;
            ///if a control byte was full, go to the next 
            if(iControlBit % 8 === 0) iControlByte++;
          
            payloadBuf[payloadByte] = dataBuffer[index];
            index++;
        }
        console.log("compressedData without payload: ", compressedData);
        console.log("payloadBuf: ", payloadBuf);
        compressedData = Buffer.concat([compressedData, payloadBuf]);
        console.log("complete compressedData: ", compressedData);
        return compressedData;
        

    }


    compress(data){
        let reminderText = data.getHexString;
        let compressed = reminderText;
        ///ordenar por maiores blocos
        for (const sb of this.smartBlocks) {
            let iR = reminderText.includes(sb.getTextHexString)
            if(iR)
            {
                compressed = compressed.split(sb.getTextHexString).join(sb.getCode);
                reminderText = reminderText.split(sb.getTextHexString).join('');
            }
        }
        return compressed;
    }

    showSBs()
    {
        for (const sb of this.smartBlocks) {
            console.log("Block - " + sb.getCode);
            console.log(sb.getBuffer);
        }
    }

    getDicBlocksInData(dataBuffer)
    {
        let dicBlocksPresent = [];
        let initSearch = 0;
        let tempIndex = 0;
        for (const sb of this.smartBlocks) 
        {
            initSearch = 0;
            do  
            {
                tempIndex = dataBuffer.indexOf(sb.getBuffer, initSearch);  
                if(tempIndex >= 0)
                {
                    initSearch = sb.getBuffer.length + tempIndex; 
                    if(!this.hasAlreadyMatched(dicBlocksPresent, tempIndex)) 
                    {
                        let presentBl = {startIndex: tempIndex, endIndex: initSearch, block: sb};
                        dicBlocksPresent.push(presentBl);
                    }
                }
            }
            while(tempIndex >= 0)
        }

        return dicBlocksPresent;
    }

    hasAlreadyMatched(dicBlocksPresent, index)
    {
        for (const presentBl of dicBlocksPresent) {
            if( index >= presentBl.startIndex && index < presentBl.endIndex ) /// end exclusive
                return true;
        }
        return false;
    }

    getOrderedDicBlocksPresent(dicBlocksPresent)
    {
        let ordered = [];
        let insertedElement = true; /// since the firt element will be added by default
        if(dicBlocksPresent.length === 0)
        {
            return ordered;
        }

        /// if it is not empty
        ordered.push(dicBlocksPresent[0])
        for (const objc of dicBlocksPresent) 
        {
            for (const objcOrdered of ordered) 
            {
                /// if sb is bigger than the current sbOrdered, insert sb before
                if(objc.startIndex < objcOrdered.startIndex)
                {
                    ordered.splice(ordered.indexOf(objcOrdered), 0, objc);
                    insertedElement = true;
                    break;
                }
            }
            
            /// if it was not inserted, push it at the end, since it is the smallest til now
            if (insertedElement === false) 
            {
                ordered.push(objc);
            }
            insertedElement = false;
        }
        return ordered;
    }

    getBlockClasses(dicBlocksPresent, dataBuffer)
    {
        ///dicBlocksPresent is already ordered before calling this function
        ///dicBlocksPresent = this.getOrderedDicBlocksPresent(dicBlocksPresent);
        let codeBlocksLength = [];
        let dataBlocksLength = [];
        let indexMap = [];
        let pbIndex = 0
        for (let index = 0; index < dataBuffer.length; index++)
        {
            for (; pbIndex < dicBlocksPresent.length; pbIndex++)
            {
                let presentBl = dicBlocksPresent[pbIndex];
                if(!this.isInsideTheBlock(presentBl, index))
                {
                   let dataBlockLen =  presentBl.startIndex - index;
                   if(!dataBlocksLength.includes(dataBlockLen))
                   {
                        dataBlocksLength.push(dataBlockLen);
                   }
                   index += dataBlockLen;
                   indexMap.push( {length: dataBlockLen, type: "data"} );
                }
                let blockLen =  presentBl.block.getBuffer.length;
                if(!codeBlocksLength.includes(blockLen))
                {
                    codeBlocksLength.push(blockLen);
                }
                presentBl.length = blockLen;
                presentBl.type = "code"
                indexMap.push( presentBl );
                //indexMap.push( {length: blockLen, type: "code", block: presentBl} );
                index += blockLen;
            }           
                       
        }

        return [codeBlocksLength, dataBlocksLength, indexMap];
    }

    isBeforeTheBlock(presentBl, index)
    {
        return (index < presentBl.startIndex);
    }

    isInsideTheBlock(presentBl, index)
    {
        return (index >= presentBl.startIndex && index < presentBl.endIndex); ///end exclusive
    }

    
}

/// número de deslocamentos das posições de bits diferrentes antes de voltar para testar deslocamento entre strings
Compressor.shiftDepths = [0, 4];

Compressor.shiftInterStrDepths = [0, 4];

Buffer.prototype.writeBit = function(iByte, bit, value){
    if(value == 0){
        this[iByte] &= ~(1 << bit);
    }else{
        this[iByte] |= (1 << bit);
    }
}

// Buffer.prototype.readBit = function(iByte, bit){
//     return (this[iByte] >> bit) % 2;
//   }

module.exports = Compressor;