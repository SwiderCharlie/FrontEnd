<template>
  <view>
    <view class="goods-list">
      <view v-for="(item, i) in goodsList" :key="i" @click="gotoDetail(item)">
        <!-- 为 my-goods 组件动态绑定 goods 属性的值 -->
        <my-goods :goods="item"></my-goods>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 请求参数对象
        queryObj: {
          // 查询关键词
          query: '',
          // 商品分类Id
          cid: '',
          // 页码值
          pageNum: 1,
          // 每页显示多少条数据
          pagesize: 10
        },
        // 商品列表的数据
        goodsList: [],
        // 总数量,用来分页
        total: 0,
        // 节流阀,是否正在请求数据
        isloading: false,
      };
    },
    
    onLoad(options) {
      // 将页面参数转存到this.queryObj对象中
      this.queryObj.query = options.query || ''
      this.queryObj.cid = options.cid || ''
      // 调用获取商品列表数据的方法
      this.getGoodsList()
    },
    
    methods: {
      async getGoodsList(cb) {
        this.isloading = true
         const {data: res} = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
         this.isloading = false
         // 只要数据请求完毕，就立即按需调用 cb 回调函数
         cb && cb()
         
         if(res.meta.status !== 200) return $showMsg()
         this.goodsList = [...this.goodsList, ...res.message.goods]
         this.total = res.message.total
      },
      gotoDetail(item) {
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
        })
      }
    },
    
    onReachBottom() {
      // 判断是否还有下一页数据
        if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕！')
      // 判断是否正在请求其他数据,如果是,则不发起额外的请求
      if(this.isloading) return 
      // 让页码值自增+1
      this.queryObj.pageNum += 1
      // 重新获取列表数据
      this.getGoodsList()
    },
    
    onPullDownRefresh() {
      // 重置关键数据
      this.queryObj.pageNum = 1
      this.total = 0
      this.isloading = false
      this.goodsList = []
      // 重新发起请求
      this.getGoodsList(() => {
        uni.stopPullDownRefresh()
      })
    }
  }
</script>

<style lang="scss">
 
</style>
