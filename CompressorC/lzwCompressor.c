#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int MAX_COMPRESSED_SIZE = 512;
int MAX_DIC_SIZE = 512;

typedef struct _dicElement
{
     int code;
     int lenPhrase;
     unsigned char* phrase;
} dicElement;

typedef enum _compressor_error
{
     NULL_POINTER = -1,
     SUCCESS = 1
} compressor_error;

void printPackBuf(unsigned char* inBuf, int inSize)
{
    printf("printPackBuf \n");
    for(int i = 0; i < inSize; i++)
    {
        printf("%d-",inBuf[i]);
    }
    printf("\n");
}

void printUnpackBuf(unsigned char* inBuf, int inSize)
{
    printf("printUnpackBuf \n");
//    for(int i = 0; i < inSize; i+=2)
//    {
//        printf("%d%d-", inBuf[i+1],inBuf[i]);
//        //printf("%X-", inBuf[i+1]*16 + inBuf[i]);
//    }
//    printf("\n");
    for(int i = 0; i < inSize; i+=2)
    {
        printf("%X-", inBuf[i+1] * 16 + inBuf[i]);
        //printf("%X-", inBuf[i+1]*16 + inBuf[i]);
    }
    printf("\n");
}


void* unpack(unsigned char* inBuf, int inSize, unsigned char* outBuf)
{   int outSize = 2 * inSize;
    //unsigned char* outBuf = (unsigned char*) calloc(outSize, sizeof(unsigned char));

    for(int i = 0; i < outSize; i+=2)
    {
        outBuf[i] = inBuf[i/2] % 16;
        outBuf[i+1] = inBuf[i/2] / 16;
    }

}

void* pack(unsigned char* inBuf, int inSize, unsigned char* outBuf)
{
    int outSize = inSize/2;
//    unsigned char* outBuf = (unsigned char*) calloc(outSize, sizeof(unsigned char));
//    printUnpackBuf(inBuf, inSize);
    for(int i = 0; i < inSize; i+=2)
    {
        outBuf[i/2] = inBuf[i+1] * 16 + inBuf[i];
    }
//    printPackBuf(outBuf, outSize);
//    free(outBuf);
//    outBuf = NULL;
}

int lzw_encode(unsigned char* inBuf, int inSize, unsigned char* outBuf, int* outSize)
{
    if(!inBuf)
    {
        return -1;
    }
    dicElement* dic = (dicElement*) calloc(MAX_DIC_SIZE, sizeof(dicElement));
    int dicLenght = 0;
    unsigned char currentChar;
    unsigned char* phrase = &inBuf[0];

    //printf("phrase %d \n", phrase[0]);
    free (dic);
    return 1;
}


int main()
{
    //unsigned char inBuf [2] = {1, 2};
    unsigned char inUnpack [] = {1, 2, 1, 2, 15, 15};
    unsigned char outPack [sizeof(inUnpack)/2] = {0};
    unsigned char outUnpack [sizeof(inUnpack)] = {0};

    // deve-se fazer o unpack para manter a compatibilidade com javacript
    pack(inUnpack, sizeof(inUnpack), outPack);

    // parâmetros que indica o número de bytes preenchidos após a conversão
    int* compressedSize = 0;
    unsigned char compressedBuf [512] = {0};
    lzw_encode(outUnpack, sizeof(outUnpack), compressedBuf, compressedSize);

    unpack(outPack, sizeof(outPack), outUnpack);

    printUnpackBuf(inUnpack, sizeof(inUnpack));
    printPackBuf(outPack, sizeof(outPack));
    printUnpackBuf(outUnpack, sizeof(outUnpack));

    system("PAUSE");
    return 0;
}
