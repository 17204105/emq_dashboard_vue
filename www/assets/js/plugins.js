var Plugins = new Vue({
  el: '#dashboard_plugins',
  data: {
    webapi: null,
    plugins : []
  },
  methods: {
    show: function() {
      this.$el.style.display = 'block';
    },
    hide: function() {
      this.$el.style.display = 'none';
    },
    update: function( plugin, el ) {
      if( plugin.runing ) {
          return;
      }
      plugin.runing = true;
      if( plugin.active ) {
        this.webapi.disable( plugin.name, function(ret, err) {
          plugin.runing = false;
          if (ret && ret.active == true) {
            plugin.active = false;
          } else {
            alert("Stop Fail, Please check background log!!");  
          }
        });
      } else {
        this.webapi.enable( plugin.name, function(ret, err ) {
          plugin.runing = false;
          if (ret && ret.active == true) {
            plugin.active = true;
          } else {
            alert("Start Fail, Please check background log!!");                
          }
        });
      }
    },
    list: function() {
      var _this = this;
      this.webapi.plugins( function(ret, err) {
        if (ret) {
          _this.plugins = ret;
        }
      });
    },
  },
  mounted: function() {
    this.webapi = WebAPI.init({
      callback : function() {
        // sog.mainFooter.toBottom();
      }
    });
    this.list();
  }
});
