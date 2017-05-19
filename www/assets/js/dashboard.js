/*!
 * 
 * dashboard.js v1.0 
 * Copyright (c) 2016-2017 EMQ Enterprise, Inc. (http://emqtt.io).
 * 
 */

(function(dashboard, $) {

    'use strict';

    dashboard.version = '1.0';

    // Modules save container.
    var modules = {};
    dashboard.modules = modules;

    // Overview.js
    // Clients.js
    // Sessions.js
    // Topics.js
    // Routes.js
    // Subscriptions.js
    // Alarms.js
    // Plugins.js
    // Users.js
    // Websocket.js

    // HttpApi-------------------------------------------

    var HttpApi = function() {
        this.modName = 'http_api';
        this.$html = $('#dashboard_http_api',
                sog.mainCenter.$html);
        this._init();
    };
    HttpApi.prototype._init = function() {
        var _this = this;
        loading('http_api.html', function() {
            
        }, _this.$html);
    };
    HttpApi.prototype.show = function() {
        this.$html.show();
    };
    HttpApi.prototype.hide = function() {
        this.$html.hide();
    };

    // Functions----------------------------------------

    var hideAllMods = function() {
        for (var key in modules) {
            var m = modules[key];
            m.hide();
        }
    };
    
    var loading = function(mod, fun, $html) {
        sog.loadingBar.show({
            pct : 100,
            delay : 0.5,
            finish : function(pct) {
                // $html.empty().append(
                // '<div class="page-loading-overlay">\
                // <div class="loader-2"></div></div>');
                $html.load(mod, function() {
                    fun();
                    sog.mainFooter.toBottom();
                });
            }
        });
    };
    
    var showCurrUser = function() {
        dashboard.webapi.user_curr(function(ret, err) {
            if (ret) {
                $('#current_user', sog.mainContent.$html)
                .text(ret.username);
            }
        });
    };

    var showCurrNode= function() {
        dashboard.webapi.node_curr(function(ret, err) {
            if (ret) {
                $('#current_node', sog.mainContent.$html)
                .text(ret.node);
            }
        });
    };

    var clearAuth = function() {
        if (modules.overview) {
            window.clearInterval(modules.overview.timertask);
        }
        var f = false;
            try {
                f = document.execCommand('ClearAuthenticationCache');
            } catch (e) {}
            if (f) {
               window.location.href = '/';
               return;
           }
        dashboard.webapi.logout(function(ret, err) {
            window.location.href = '/';
        });
        window.setTimeout(function() {
            window.location.href = '/';
        }, 800);
    };
    
    var openModule = function(modName, keyword) {
        hideAllMods();
        activeMenu(modName);

        switch (modName) {
        case 'overview':
            if (!modules.overview) {
                modules.overview = Overview;
            }
            modules.overview.show();
            break;
        case 'clients':
            if (!modules.clients) {
                modules.clients = Clients;
            } else {
                modules.clients.clear();
                modules.clients.list();
            }
            modules.clients.show();
            break;
        case 'sessions':
            if (!modules.sessions) {
              modules.sessions = Sessions;
            } else {
                modules.sessions.clear();
                modules.sessions.list();
            }
            modules.sessions.show();
            break;
        case 'topics':
            if (!modules.topics) {
                modules.topics = Topics;
            } else {
                modules.topics.clear();
                modules.topics.list();
            }
            modules.topics.show();
            break;
        case 'routes':
            if (!modules.routes) {
                modules.routes = Routes;
            } else {
                modules.routes.clear();
                modules.routes.list();
            }
            modules.routes.show();
            break;
        case 'subscriptions':
            if (!modules.subscriptions) {
                modules.subscriptions = Subscriptions;
            } else {
                modules.subscriptions.clear();
                modules.subscriptions.list();
            }
            modules.subscriptions.show();
            break;
        case 'alarms':
            if (!modules.alarms) {
                modules.alarms= Alarms;
            } else {
                modules.alarms.list();
            }
            modules.alarms.show();
            break;
        case 'plugins':
            if (!modules.plugins) {
                modules.plugins= Plugins;
            } else {
                modules.plugins.list();
            }
            modules.plugins.show();
            break;
        case 'websocket':
            if (!modules.websocket) {
                modules.websocket = Websocket;
            }
            modules.websocket.show();
            break;
        case 'users':
            if (!modules.users) {
                modules.users = Users;
            } else {
                modules.users.list();
            }
            modules.users.show();
            break;
        case 'http_api':
            if (!modules.httpApi) {
                modules.httpApi = new HttpApi();
            }
            modules.httpApi.show();
            break;
        default:
            break;
        }
    };
    var registerEvent = function() {
        var $main = sog.mainContent.$html;
        var $menu = sog.sidebarMenu.$html;
        
        $('#logout', $main).on('click', function(ev) {
            ev.preventDefault();
            clearAuth();
        });

        $('#main-menu>li', $menu).each(function() {
            $(this).click(function() {
                openModule($(this).attr('module'));
            });
        });
    };
    var activeMenu = function(modName) {
        if (modName == 'websocket') {
            if (!window.WebSocket) {
                var msg = "WebSocket not supported by this browser.";
                alert(msg);
                throw new Error(msg);
            }
        }
        $('#main-menu>li').each(function() {
            var $m = $(this);
            $m.removeClass('active');
            var mod = $m.attr('module');
            if (mod == modName) {
                $m.addClass('active');
            }
        });
    };

    dashboard.init = function(url) {
        var _this = this;

        _this.webapi = WebAPI.init({
            callback : function() {
                sog.mainFooter.toBottom();
            }
        });

        showCurrUser();
        showCurrNode();
        // Register menu event.
        registerEvent();
        // Show main center content.
        var strs = url.split('#');
        if (strs.length == 1) {
            openModule('overview');
            return;
        }
        openModule(strs[1].substring(1));
    };

})((function() {
    if (!window.dashboard) {
        window.dashboard = {}
    }
    return window.dashboard;
})(), jQuery);
