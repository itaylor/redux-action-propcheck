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
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = createActionPropcheckMiddleware;

function createActionPropcheckMiddleware() {
  var actionPropMap = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var defaultOptions = {
    strict: true,
    log: console.log
  };
  options = Object.assign({}, defaultOptions, options);

  return function (store) {
    return function (next) {
      return function (action) {
        var type = action.type;

        if (type) {
          var propTypes = actionPropMap[type];
          if (options.strict && !propTypes) {
            options.log(new Error('The action ' + type + ' does not have propTypes declared.'));
          }
          if (propTypes !== undefined) {
            checkProps(propTypes, action, type, options.log);
          }
        }
        return next(action);
      };
    };
  };
}

function checkProps(propTypes, props, ownerName, log) {
  Object.keys(propTypes).forEach(function (propName) {
    var fn = propTypes[propName];
    if (typeof fn != 'function') {
      log('Attempted to use a propType ' + propName + 'that is not a function. Typically, use one from React.PropTypes.');
      return;
    }
    var error = fn(props, propName, ownerName);
    if (error) {
      log(error);
    }
  });
}
module.exports = exports['default'];