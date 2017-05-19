var Alarms = new Vue({
  el: '#dashboard_alarms',
  data: {
    webapi: null,
    alarms : []
  },
  methods: {
    show: function() {
      this.$el.style.display = 'block';
    },
    hide: function() {
      this.$el.style.display = 'none';
    },
    clear: function() {
      this.pageInfo = new PageInfo(1, 100, 0);
      this.topic = null;
    },
    topic_sub: function(topic) {
      openModule( 'subscriptions', topic );
    },
    search: function() {
      this.list();
    },
    changeSize: function(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.pageInfo.currPage = 1;
      this.list();
    },
    go: function(currPage) {
      this.pageInfo.currPage = currPage;
      this.list();
    },
    list: function() {
      var _this = this;
      this.webapi.alarms( function(ret, err) {
        if (ret) {
          _this.alarms = ret;
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
