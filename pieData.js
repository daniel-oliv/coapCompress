class PieData{
    
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
}

module.exports = PieData;