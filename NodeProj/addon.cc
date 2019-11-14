#include <node.h>
#include <iostream>

using namespace v8;
using namespace std;

/*void HelloWorld(const FunctionCallbackInfo<Value>& args) 
{
   cout << "Hello, world!" << endl;
}*/

void getBlocks(const FunctionCallbackInfo<Value>& args) 
{
    Isolate* isolate = args.GetIsolate();
    char* valueToSum = args[0]->NumberValue();
    cout << "Hello, world!" << endl;
    cout << valueToSum << endl;
}



void Initialize(Local<Object> exports) 
{
   //NODE_SET_METHOD(exports, "helloWorld", HelloWorld);
   NODE_SET_METHOD(exports, "getBlocks", getBlocks);
}

NODE_MODULE(addon, Initialize);

