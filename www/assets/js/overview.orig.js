// Overview-----------------------------------------

var Overview = function() {
    this.modName = 'overview';
    this.$html = $('#dashboard_overview',
            sog.mainCenter.$html);
    
    this._init();
};
Overview.prototype._init = function() {
    var _this = this;
    loading('overview.html', function() {
        _this.vmBroker = new Vue({
          el : '#overview_broker',
          data: {
            datetime: null,
            sysdescr: null,
            uptime: null,
            version: null,
          },
        });
        _this.vmNodes = new Vue({
            el  : '#overview_nodes',
            data: {
                nodes: []
            }
        });
        _this.vmLiss = new Vue({
            el  : '#overview_listeners',
            data: {
                listeners: []
            }
        });
        _this.broker();
        _this.nodes();
        _this.stats();
        _this.metrics();
        _this.listeners();
        // Start Timertask
        _this.startTask()
    }, _this.$html);
};
Overview.prototype.show = function() {
    this.$html.show();
};
Overview.prototype.hide = function() {
    this.$html.hide();
};
Overview.prototype.broker = function() {
    var _this = this;
    dashboard.webapi.broker(function(ret, err) {
        if (ret) {
          // _this.vmBroker.$data = ret;
          _this.vmBroker.$data.datetime = ret.datetime;
          _this.vmBroker.$data.sysdescr = ret.sysdescr;
          _this.vmBroker.$data.uptime = ret.uptime;
          _this.vmBroker.$data.version = ret.version;
        }
    });
};
Overview.prototype.nodes = function() {
    var _this = this;
    dashboard.webapi.nodes(function(ret, err) {
        if (ret) {
            _this.vmNodes.nodes = ret;
        }
    });
};
Overview.prototype.stats = function() {
    var _this = this;
    var $stats = $('#overview_stats', _this.$html);
    dashboard.webapi.stats(function(ret, err) {
        if (ret) {
            for (var key in ret) {
                var keyStr = key.split('/').join('_');
                $('#' + keyStr, $stats).text(ret[key]);
            }
        }
    });
};
Overview.prototype.metrics = function() {
    var _this = this;
    var $metrics = $('#overview_metrics', _this.$html);
    dashboard.webapi.metrics(function(ret, err) {
        if (ret) {
            for (var key in ret) {
                var keyStr = key.split('/').join('_');
                $('#' + keyStr, $metrics).text(ret[key]);
            }
        }
    });
};
Overview.prototype.listeners = function() {
    var _this = this;
    dashboard.webapi.listeners(function(ret, err) {
        if (ret) {
            _this.vmLiss.listeners = ret;
        }
    });
};
Overview.prototype.startTask = function() {
    var _this = this;
    _this.timertask = setInterval(function() {
        _this.broker();
        _this.nodes();
        _this.stats();
        _this.metrics();
    }, 10000);
};

