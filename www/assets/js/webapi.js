// (function( WebAPI ) {
  
  var WebAPI = function(options) {
      this.options = $.extend(
              {},
              WebAPI.DEFAULTS,
              options || {});
  };

  WebAPI.DEFAULTS = {
      apiPath  : '/',
      method   : 'POST',
      cache    : false,
      dataType : 'json',
      callback : null
  };

  /** Instantiation WebAPI */
  WebAPI._instance = null;
  /**
   * Get the Instantiation WebAPI
   */
  WebAPI.getInstance = function() {
      if (!WebAPI._instance) {
          throw new Error('WebAPI is not initialized.');
      }
      return WebAPI._instance;
  };

  // WebAPI initialized
  WebAPI.init = function(options) {
      if (!WebAPI._instance) {
          WebAPI._instance = new WebAPI(options);
      }
      return WebAPI.getInstance();
  };

  // var callback = function(ret, err) {};
  WebAPI.prototype._ajax = function(path, params, callback, ajaxInfo) {
      var _this = this, options = _this.options;
      var info = {
          type     : options.method,
          url      : options.apiPath + path,
          data     : params,
          dataType : options.dataType,
          cache    : options.cache,
          success  : function(ret) {
              if (!callback) {
                  return;
              }
              if ((path == 'api/remove_user'
                  || path == 'api/add_user')
                      && typeof ret == 'object'
                      && ret.status == 'failure') {
                  callback(undefined, ret);
              } else {
                  callback(ret, undefined);
              }

              // Do "options.callback" after
              // the request is successful
              if (typeof options.callback === 'function') {
                  options.callback();
              }
          },
          error : function(err) {
              if (typeof callback === 'function') {
                  callback(undefined, err);
              }
          }
      };
      $.extend(info, ajaxInfo || {});
      $.ajax(info);
  };

  $.extend(WebAPI.prototype, {
      // broker
      broker : function(callback) {
          this._ajax('api/brokers', null, callback);
      },

      // bnode
      bnode : function(callback) {
          this._ajax('api/bnode', null, callback);
      },

      // nodes
      nodes : function(callback) {
          this._ajax('api/nodes', null, callback);
      },

      // stats
      stats : function(callback) {
          this._ajax('api/stats', null, callback);
      },

      // metrics
      metrics : function(callback) {
          this._ajax('api/metrics', null, callback);
      },

      // listeners
      listeners : function(callback) {
          this._ajax('api/listeners', null, callback);
      },

      // clients
      clients : function(params, callback) {
          this._ajax('api/clients', params, callback);
      },

      // sessions
      sessions : function(params, callback) {
          this._ajax('api/sessions', params, callback);
      },

      // topics
      topics : function(params, callback) {
          this._ajax('api/topics', params, callback);
      },

      // subscriptions
      subscriptions : function(params, callback) {
          this._ajax('api/subscriptions', params, callback);
      },

      // alarms 
      alarms: function(callback) {
          this._ajax('api/alarms', null, callback);
      },

       // plugins 
      plugins: function(callback) {
          this._ajax('api/plugins', null, callback);
      },
      // plugins enable 
      enable: function(name, callback) {
          this._ajax('api/enable', {plugin_name : name}, callback);
      },
      // plugins disable 
      disable: function(name, callback) {
          this._ajax('api/disable', {plugin_name : name}, callback);
      },
      // users
      users : function(callback) {
          this._ajax('api/users', null, callback);
      },

      // user_remove
      user_remove : function(username, callback) {
          this._ajax('api/remove_user', {user_name : username}, callback);
      },

      // user_add
      user_add : function(user, callback) {
          this._ajax('api/add_user', user, callback);
      },

      // user_curr
      user_curr : function(callback) {
          this._ajax('api/current_user', null, callback);
      },

      // node_curr
      node_curr : function(callback) {
          this._ajax('api/bnode', null, callback);
      },


      // user_update
      user_update : function(user, callback) {
          this._ajax('api/update_user', user, callback);
      },

      // logout
      logout : function(callback) {
          this._ajax('api/logout', null, callback, {
              headers: {
                  "Authorization": "Logout 123456789"
              }
          });
      },

      // routes
      routes : function(params, callback) {
          this._ajax('api/routes', params, callback);
      }
  });
  
// })( WebAPI );