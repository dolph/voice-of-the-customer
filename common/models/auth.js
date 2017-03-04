'use strict'

module.exports = function (Auth) {
  // The following methods aren't used in general, so to simplify the API, it will be removed
  Auth.disableRemoteMethodByName('__create__accessTokens', false)
  Auth.disableRemoteMethodByName('__delete__accessTokens', false)
  Auth.disableRemoteMethodByName('__createById__accessTokens', false)
  Auth.disableRemoteMethodByName('__destroyById__accessTokens', false)
  Auth.disableRemoteMethodByName('__updateById__accessTokens', false)
}
