var Topics = new Vue({
  el: '#dashboard_topics',
  data: {
    webapi: null,
    pageInfo: new PageInfo(1, 100, 0),
    topic: '',
    topics : []
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
      var tc = this.topic;
      this.topic = tc ? tc.trim() : '';
      var params = {
          page_size : this.pageInfo.pageSize,
          curr_page : this.pageInfo.currPage,
          topic : this.topic
      };
      var _this = this;
      this.webapi.topics( params, function(ret, err) {
        if (ret) {
          _this.topics = ret.result;
          _this.pageInfo.currPage = ret.currentPage;
          _this.pageInfo.pageSize = ret.pageSize;
          _this.pageInfo.totalNum = ret.totalNum;
          _this.pageInfo.totalPage = ret.totalPage;
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
