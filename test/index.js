import { createStore, applyMiddleware } from 'redux';
import createActionPropcheckMiddleware from '../dist/index.js';
import {PropTypes} from 'react';

suite('Redux-action-propcheck middleware basic tests');

let actionProps = {
  'action1': {
    id:PropTypes.string.isRequired,
    obj:PropTypes.any
  },
  'action2': {
    thing:PropTypes.shape({
      name:PropTypes.string.isRequired
    })
  },
  'action3': {
    awesomeValidation:function (obj, propName, ownerName){
      if(obj[propName].indexOf('awesome') !== 0){
        return new Error('The property ' + propName + ' in ' + ownerName + ' was not awesome.')
      }
      return false;
    }
  }
}

test('Successful validation with basic props', 2, () => {
  let output = [];
  const actionPropcheckMiddleware = createActionPropcheckMiddleware(actionProps, {log:(err)=>output.push(err)});
  const createStoreWithMiddleware = applyMiddleware(actionPropcheckMiddleware)(createStore);
  const store = createStoreWithMiddleware(simpleReducer);

  store.dispatch({type:'action1', id:'a', obj:{test:'ok'}});
  equal(output.length, 0);
  equal(store.getState().action1.type, 'action1');
});

test('Error validation with basic props', 2, () => {
  let output = [];
  const actionPropcheckMiddleware = createActionPropcheckMiddleware(actionProps, {log:(err)=>output.push(err)});
  const createStoreWithMiddleware = applyMiddleware(actionPropcheckMiddleware)(createStore);
  const store = createStoreWithMiddleware(simpleReducer);

  store.dispatch({type:'action1', id:5, obj:{test:'ok'}});
  equal(output.length, 1);
  equal(store.getState().action1.type, 'action1');
});

test('Successful custom validator', 2, () => {
  let output = [];
  const actionPropcheckMiddleware = createActionPropcheckMiddleware(actionProps, {log:(err)=>output.push(err)});
  const createStoreWithMiddleware = applyMiddleware(actionPropcheckMiddleware)(createStore);
  const store = createStoreWithMiddleware(simpleReducer);

  store.dispatch({type:'action3', awesomeValidation:'awesome'});
  equal(output.length, 0);
  equal(store.getState().action3.type, 'action3');
});

test('Error in custom validator', 3, () => {
  let output = [];
  const actionPropcheckMiddleware = createActionPropcheckMiddleware(actionProps, {log:(err)=>output.push(err)});
  const createStoreWithMiddleware = applyMiddleware(actionPropcheckMiddleware)(createStore);
  const store = createStoreWithMiddleware(simpleReducer);

  store.dispatch({type:'action3', awesomeValidation:'not awesome'});
  equal(output.length, 1);
  equal(output[0].message, 'The property awesomeValidation in action3 was not awesome.');
  equal(store.getState().action3.type, 'action3');
});

test('Successful validation with using PropTypes.shape', 2, () => {
  let output = [];
  const actionPropcheckMiddleware = createActionPropcheckMiddleware(actionProps, {log:(err)=>output.push(err)});
  const createStoreWithMiddleware = applyMiddleware(actionPropcheckMiddleware)(createStore);
  const store = createStoreWithMiddleware(simpleReducer);

  store.dispatch({
    type:'action2',
    awesomeValidation:'rad',
    thing:{
      name:'monkey',
      jog:'business'
    }
  });

  equal(output.length, 0);
  equal(store.getState().action2.type, 'action2');
});

test('Dispatching unknown action with strict true (default) logs error', 2, () => {
  let output = [];
  const actionPropcheckMiddleware = createActionPropcheckMiddleware(actionProps, {
    log:(err)=>output.push(err)
  });
  const createStoreWithMiddleware = applyMiddleware(actionPropcheckMiddleware)(createStore);
  const store = createStoreWithMiddleware(simpleReducer);

  store.dispatch({
    type:'unknownAction',
  });

  equal(output.length, 1);
  equal(output[0].message, 'The action unknownAction does not have propTypes declared.');
});

test('Dispatching unknown action with strict false logs no error', 1, () => {
  let output = [];
  const actionPropcheckMiddleware = createActionPropcheckMiddleware(actionProps, {
    log:(err)=>output.push(err),
    strict:false
  });
  const createStoreWithMiddleware = applyMiddleware(actionPropcheckMiddleware)(createStore);
  const store = createStoreWithMiddleware(simpleReducer);

  store.dispatch({
    type:'unknownAction',
  });

  equal(output.length, 0);
});


function simpleReducer(state={}, action){
  switch(action.type){
    case 'action1':
      return Object.assign({}, state, {
        'action1': action
      });
    case 'action2':
      return Object.assign({}, state, {
        'action2': action
      });
    case 'action3':
      return Object.assign({}, state, {
        'action3': action
      });
    default:
      return state;
  }
}
