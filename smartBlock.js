class SmartBlock{
    
    constructor(text){
        this.code = SmartBlock.nextCode;
        SmartBlock.nextCode++;
        this.text = text;
    }
    get getCode()
    {
        return this.code.toString('16');
    }
    get getTextHexString()
    {
        return this.text.toString('hex');
    }
    get getBuffer()
    {
        return this.text;
    }
}

SmartBlock.nextCode = 1;
SmartBlock.codeSize = 4;///one hexdigit

module.exports = SmartBlock;