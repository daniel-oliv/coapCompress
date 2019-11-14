class PieData{
    
    // completeData;
    // codedData;
    // mapType;


    constructor(buffer){
        this.completeData=buffer;
        this.codedData = [];
        this.mapType = [];
    }
    showCompleteEnumData(finalIndexToShow)
    {
        let enumBytesStr = '';
        for (let index = 0; index < this.completeData.length && index<=finalIndexToShow; index++) {
            enumBytesStr = enumBytesStr.concat(index + "-" + this.completeData[index] + " ");
        }
        console.log(enumBytesStr);
        
    }
    get getHexString()
    {
        return this.completeData.toString('hex');
    }
    set codedData(codeData)
    {
        this.codeData = codeData;
    }
    get codedData()
    {
        return this.completeData.toString('hex');
    }
    get codeIndexes()
    {
        return this.completeData.toString('hex');
    }
}

module.exports = PieData;