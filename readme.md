# redux-action-propcheck
A Redux middlware that can check your redux action's property types against a provided specification of expected property types.

How to use
-------------
### Installation
```
npm install --save redux-action-propcheck
```

### Example usage

Client side:
```js
import { createStore, applyMiddleware } from 'redux';
import createActionPropcheckMiddleware from 'redux-action-propcheck';
import {PropTypes} from 'react';

const actionSpec = {
  'message':{
    text:PropTypes.string.isRequired
  }
};

let actionPropcheckMiddleware = createActionPropcheckMiddleware(actionSpec);

function reducer(state = {}, action){
  switch(action.type){
    case 'message':
      return Object.assign({}, {messageText:action.text});
    default:
      return state;
  }
}

let store = applyMiddleware(actionPropcheckMiddleware)(createStore)(reducer);

store.dispatch({type:'message', text:false});
//Message logged on console.error
//[Error: Invalid undefined `text` of type `boolean` supplied to `message`, expected `string`.]
```

### Options

The second parameter of `createActionPropcheckMiddleware` allows for passing of options.

* `strict` [boolean] default `true`
  If true, requires that every action dispatched have propTypes specified in the actionSpec
* `log` [function(err)] default `console.error`
  A function that will be called when there is an error.  It will be passed an `Error` object with a message property containing the error message.


### MIT License
Copyright (c) 2015 Ian Taylor

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
