const SmartBlock = require('./smartBlock.js');

class Compressor
{
    constructor(data1, data2)
    {
        this.data1 = data1;
        this.data2 = data2;
        this.smartBlocks = [];
    }
    findCommonStartByteIndexes(startIndexes)
    {
        let commomIndexFounded = false;
        for (let i = startIndexes[0]; i < this.data1.completeData.length && !commomIndexFounded; i++)
        for (let j = startIndexes[1]; j < this.data2.completeData.length && !commomIndexFounded; j++)
            if(this.data1.completeData[i] === this.data2.completeData[j])
            {
                commomIndexFounded = true;
                startIndexes[0] = i;
                startIndexes[1] = j;
            }

        return commomIndexFounded;
    }

    findNextDiffBytesIndexes(startIndexes, differentIndexes)
    {
        let diffBytesFounded = true;
        let i = startIndexes[0];
        let j = startIndexes[1];
        do
        {
            i++;
            j++;
        }while(i<this.data1.completeData.length && j < this.data2.completeData.length
            && this.data1.completeData[i] === this.data2.completeData[j])

        ///se está na última posição, é necessário somar mais um para que o slice inclua o último caractere
        if(i === this.data1.completeData.length-1 || j === this.data2.completeData.length-1
            && this.data1.completeData[i] === this.data2.completeData[j])
        {
            i++;
            j++;
            diffBytesFounded = false;
        }
        differentIndexes[0] = i;
        differentIndexes[1] = j;
        return diffBytesFounded;
    }
    fillSmartBlocks()
    {
        let i1 = 0; 
        let i2 = 0;
        while(i1 < this.data1.completeData.length)
        {   
            console.log("starting analyzing byte " + i1 + "from the string 1");
            let commonStart = [];
            let currentDiff = [];
            let endSearch = false;

            /// for very index and shifting
            let commonBytesFounded = this.findCommonStartByteIndexes(commonStart);
            if(!commonBytesFounded && endSearch)
                return;
            let diffBytesFounded = this.findNextDiffBytesIndexes(commonStart, currentDiff);
            console.log(currentDiff);
            console.log(diffBytesFounded);
            i1 = currentDiff[0];
            i2 = currentDiff[1];
            if(!diffBytesFounded)
            {
                console.log("The end of one string was reached!")
                console.log("end1[" + i1 + "]   end2[" + i2 + "]")
            }
            let sb = new SmartBlock(this.data1.completeData.slice(commonStart[0], commonEnd[0]));
            for()
            {
                if()
            {

            }
            }
            
            console.log(sb.getCode)
            console.log(sb.text)
            
        }
    }

    
}

module.exports = Compressor;