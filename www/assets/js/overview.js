var Overview = new Vue({
  el: '#dashboard_overview',
  data: {
    webapi: null,
    datetime: null,
    sysdescr: null,
    uptime: null,
    version: null,
    nodes: [],
    listeners: [],
    stats: [],
    metrics: [],
    data_types: [
      { title: 'The packets data', filter: 'packets' },
      { title: 'The messages data', filter: 'messages' },
      { title: 'The bytes data', filter: 'bytes' },
    ],
  },
  computed: {
    filter_metrics: function() {
      var vm = this;
      return function( fltr ) {
        var ret = [];
        var keys = Object.keys( vm.metrics ).sort();
        keys.forEach( function( k ) {
          if( k.match( fltr) ) 
            ret.push( { title: k.split("/").splice(1).join("/"), value: vm.metrics[ k ] } );
        });
        return ret;
      }
    },
  },
  methods: {
    show: function() {
      this.$el.style.display = 'block';
    },
    hide: function() {
      this.$el.style.display = 'none';
    },
    get_broker: function() {
      var that = this;
      this.webapi.broker(function(ret, err) {
        if (ret) {
          that.datetime = ret.datetime;
          that.sysdescr = ret.sysdescr;
          that.uptime = ret.uptime;
          that.version = ret.version;
        }
      });
    },
    get_statistics: function() {
      var that = this;
      this.webapi.stats(function(ret, err) {
        if (ret) {
          that.stats = ret;
        }
      });
    },
    get_metrics: function() {
      var that = this;
      this.webapi.metrics(function( ret, err ) {
        if (ret) {
          that.metrics = ret;
        }
      });
    },
    get_nodes: function() {
      var that = this;
      this.webapi.nodes(function(ret, err) {
          if (ret) {
              that.nodes = ret;
          }
      });
    },
    get_listeners: function() {
      var that = this;
      this.webapi.listeners(function(ret, err) {
        if (ret) {
          that.listeners = ret;
        }
      });
    }
  },
  mounted: function() {
    var that = this;
    this.webapi = WebAPI.init({
      callback : function() {
        // sog.mainFooter.toBottom();
      }
    });
    
    that.get_broker();
    that.get_nodes();
    that.get_statistics();
    that.get_metrics();
    that.get_listeners();
    
    this.timertask = setInterval(function() {
      that.get_broker();
      that.get_nodes();
      that.get_statistics();
      that.get_metrics();
      that.get_listeners();
    }, 1000 );
  }
});
