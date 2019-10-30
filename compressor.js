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
        
        this.smartBlocks = [];
        this.currentStartShift = Compressor.shiftDepths[0];
        Compressor.shiftDepths.push(data1.completeData.length);
        Compressor.shiftInterStrDepths.push(data1.completeData.length);
    }

    appendToAndValidateDepths(biggerLenght)
    {
        let inserted = false;
        for (const key in Compressor.shiftDepths) 
        {
            if(Compressor.shiftDepths[key] >= biggerLenght)
            {
                Compressor.shiftDepths[key] = biggerLenght;
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
                console.log(this.smartBlocks);
                return;
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
                console.log(this.smartBlocks);
                return;
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

    
}

/// número de deslocamentos das posições de bits diferrentes antes de voltar para testar deslocamento entre strings
Compressor.shiftDepths = [0, 4];

Compressor.shiftInterStrDepths = [0, 4];

module.exports = Compressor;