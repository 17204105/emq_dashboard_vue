var Clients = new Vue({
  el: '#dashboard_clients',
  data: {
    webapi: null,
    clientKey : null,
    pageInfo : new PageInfo(1, 100, 0),
    clients : []
  },
  methods: {
    show: function() {
      this.$el.style.display = 'block';
    },
    hide: function() {
      this.$el.style.display = 'none';
    },
    clear: function(){
      this.pageInfo = new PageInfo(1, 100, 0);
      this.clientKey = null;
    },
    search: function() {
      this.list();
    },
    changeSize : function(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.pageInfo.currPage = 1;
      this.list();
    },
    go: function(currPage) {
      this.pageInfo.currPage = currPage;
      list();
    },
    list: function() {
      var cKey = this.clientKey;
      this.clientKey = cKey ? cKey.trim() : '';
      var params = {
        page_size : this.pageInfo.pageSize,
        curr_page : this.pageInfo.currPage,
        client_key : this.clientKey
      };
      var _this = this;
      this.webapi.clients(params, function(ret, err) {
        if (ret) {
          _this.clients = ret.result;
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
