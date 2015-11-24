/**
* Takes in a map of action types to prop types, checks each action on dispatch
* To make sure it meets the prop types requirements
* @usage:
* createActionPropcheckMiddleware({
    MyActionType: {
      id: PropTypes.string.isRequired,
      payload: PropTypes.shape({
        count:PropTypes.string.isRequired,
        enabled:PropTypes.bool
      })
    }
  });
*/
export default function createActionPropcheckMiddleware(
  actionPropMap = {},
  options = {}){
  const defaultOptions = {
    strict:true,
    log:(args)=>{console.log(...args)}
  }
  options = Object.assign({}, defaultOptions, options);

  return store => next => action => {
    const {type} = action;
    if(type){
      const propTypes = actionPropMap[type];
      if(options.strict && !propTypes){
        options.log(new Error('The action ' + type + ' does not have propTypes declared.'));
      }
      if(propTypes !== undefined){
        checkProps(propTypes, action, type, options.log);
      }
    }
    return next(action);
  }
}

function checkProps(propTypes, props, ownerName, logger){
  Object.keys(propTypes).forEach((propName)=>{
    const fn = propTypes[propName];
    if(typeof fn != 'function'){
      logger(new Error('Attempted to use a propType '+ propName  + 'that is not a function. Typically, use one from React.PropTypes.'));
      return;
    }
    const error = fn(props, propName, ownerName);
    if(error){
      logger(error);
    }
  });
}
