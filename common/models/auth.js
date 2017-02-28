'use strict';

module.exports = function(Auth) {
  // The following methods aren't used in general, so to simplify the API, it will be removed
  Auth.disableRemoteMethod('__create__accessTokens', false);
  Auth.disableRemoteMethod('__delete__accessTokens', false);
  Auth.disableRemoteMethod('__createById__accessTokens', false);
  Auth.disableRemoteMethod('__destroyById__accessTokens', false);
  Auth.disableRemoteMethod('__updateById__accessTokens', false);
};
