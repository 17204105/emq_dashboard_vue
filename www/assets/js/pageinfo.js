var PageInfo = function(currPage, pageSize, totalNum) {
    this.currPage = currPage;
    this.pageSize = pageSize;
    this.totalNum = totalNum;
    this.totalPage = 0;
};
PageInfo.prototype.countTotalPage = function(totalPage) {
    if (totalPage) {
        this.totalPage = totalPage;
        return;
    }
    if (this.totalNum % this.pageSize == 0) {
        this.totalPage = this.totalNum / this.pageSize;
    } else {
        this.totalPage = this.totalNum / this.pageSize + 1;
    }
};
PageInfo.prototype.offsetting = function() {
    if (this.totalNum == 0) {
        return 0;
    } else {
        return (this.currPage - 1) * this.pageSize + 1;
    }
};
PageInfo.prototype.endNum = function() {
    if (this.totalNum == 0) {
        return 0;
    }
    if (this.currPage == this.totalPage) {
        return this.totalNum;
    } else {
        return this.offsetting() + this.pageSize - 1;
    }
};
