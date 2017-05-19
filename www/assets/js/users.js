var Users = new Vue({
  el: '#dashboard_users',
  data: {
    webapi: null,
    user: [],
    users : [],
    modalCofDelUser: $('#modal_confirm_del_user'),
    modalUserAdd: $('#modal_user_add'),
    modalUserEdit: $('#modal_user_edit'),
    i: 0
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
    list: function() {
      var _this = this;
      this.webapi.users( function(ret, err) {
        if (ret) {
          _this.users = ret;
        }
      });
    },
    del : function(user) {
      user = {name : user.name};
      this.user = user;
      this.modalCofDelUser.modal( 'show' );
    },
    edit : function(user) {
      user = { name : user.name, tags : user.tag };
      this.user = user;
      this.modalUserEdit.modal( 'show' );
    },
    add : function() {
      this.modalUserAdd.modal( 'show' );
    },
    submit_add_user: function() {
      this.user.name = this.user.name ? this.user.name.trim() : '';
      this.user.password = this.user.password ? this.user.password.trim() : '';
      this.user.tags = this.user.tags ? this.user.tags.trim() : '';
      this.user.user_name = this.user.name;
      if (this.user.user_name == '') {
        alert("Username is required.");
        return;
      }
      if (this.user.password == '') {
        alert("Password is required.");
        return;
      }
      if (this.user.password != this.user.password2) {
        alert("Passwords do not match.");
        return;
      }
      var vm = this;
      this.webapi.user_add( vm.user, function(ret, err) {
        if (ret) {
          vm.user = {};
          _this.$modalUserAdd.modal('hide');
          _this.list();
        } else {
          alert(err.reason);
        }
      });
    },
    submit_update_user: function() {
      this.user.name = this.user.name ? this.user.name.trim() : '';
      this.user.password = this.user.password ? this.user.password.trim() : '';
      this.user.tags = this.user.tags ? this.user.tags.trim() : '';
      this.user.user_name = this.user.name;
      if (this.user.user_name == '') {
        alert("Username is required.");
        return;
      }
      if (this.user.password == '') {
        alert("Password is required.");
        return;
      }
      if (this.user.password != this.user.password2) {
        alert("Passwords do not match.");
        return;
      }
      var vm = this;
      this.webapi.user_update(vm.user, function(ret, err) {
        if(ret) {
          vm.user = {};
          vm.$modalUserEdit.modal('hide');
          vm.list();
        } else {
          alert("Edit failure.");
        }
      });
    },
    submit_remove_user: function() {
      var vm = this;
      vm.webapi.user_remove(vm.user.name, function(ret, err) {
        if (ret) {
          vm.user = {};
          vm.$modalCofDelUser.modal('hide');
          vm.list();
        } else {
          alert(err.reason);
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
