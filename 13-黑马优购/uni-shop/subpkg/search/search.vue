<template>
  <view>
    <view class="search-box">
      <!-- 使用 uni-ui 提供的搜索组件 -->
      <uni-search-bar @input="input" :radius="100" cancelButton="none"></uni-search-bar>
    </view>
    
    <!-- 搜索建议列表 -->
    <view class="sugg-list" v-if="searchResults.length !== 0">
      <view class="sugg-item" v-for="(item, i) in searchResults" :key="i" @click="gotoDetail(item.goods_id)">
        <view class="goods-name">
          {{item.goods_name}}
        </view>
        <uni-icons type="arrowright" size="16"></uni-icons>
      </view>
    </view>
    
    <!-- 搜索历史 -->
    <view class="history-box" v-else>
      <!-- 标题区域 -->
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="17" @click="cleanHistory"></uni-icons>
      </view>
      <!-- 列表区域 -->
      <view class="history-list">
        <uni-tag :text="item" v-for="(item, i) in historys" :key="i" @click="gotoGoodsList(item)"></uni-tag>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 实现搜索框自动获得焦点
        show: true,
        showSync: true,
        searchVal: '',
        // 延时器的timeId
        timer: null,
        // 搜索关键词
        kw: '',
        // 搜索结果列表
        searchResults: [],
        // 搜索关键词的历史记录(假数据)
        historyList: ['a', 'app', 'apple']
      };
    },
    computed: {
      historys() {
        return [...this.historyList].reverse()
      }
    },
    methods: {
      input(val) {
        // 防抖处理
        // 清除timer对应的延时器
        clearTimeout(this.timer)
        // 重新启动一个延时器,并把 timerId 赋值给 this.timer
        this.timer = setTimeout(() => {
          // 如果500ms内,没有触发新的输入事件,则为搜索关键词赋值
          this.kw = val
          // 根据关键词,查询搜索建议列表
          this.getSearchList()
        }, 500)
      },
      // 根据搜索关键词,搜索商品建议列表
      async getSearchList() {
        if(this.kw === '') {
          this.searchResults = []
          return
        }
        // 发起请求,获取搜索建议列表
        const {data: res} = await uni.$http.get('/api/public/v1/goods/qsearch', {query: this.kw})
        if(res.meta.status !== 200) return uni.$showMsg()
        this.searchResults = res.message
        // 查询到搜索建议后,调用saveSearchHistory()方法保存搜索关键词
        this.saveSearchHistory()
      },
      saveSearchHistory() {
        // 将Array数组转化为Set对象
        const set = new Set(this.historyList)
        // 调用Set对象的delete方法,移除对应的元素
        set.delete(this.kw)
        // 调用Set对象的add方法,向Set中添加元素
        set.add(this.kw)
        // 将Set对象转换为Array数组
        this.historyList = Array.from(set)
        // 调用 uni.setStorageSync(key, value) 将搜索历史记录持久化存储到本地
        uni.setStorageSync('kw', JSON.stringify(this.historyList))
      },
      gotoDetail(goods_id) {
        uni.navigateTo({
          // 指定详情页面的 URL 地址，并传递 goods_id 参数
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods_id
        })
      },
      // 清空搜索历史记录
      cleanHistory() {
        this.historyList = []
        uni.setStorageSync('kw', '[]')
      },
      // 点击跳转到商品列表页面
      gotoGoodsList(kw) {
        uni.navigateTo({
          url: '/subpkg/goods_list/goods_list?query=' + kw
        })
      }
    },
    onLoad() {
      this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
    }
  }
</script>

<style lang="scss">
  .uni-searchbar {
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: row;
    position: relative;
    padding: 16rpx;
    /* 将默认的 #FFFFFF 改为 #C00000 */
    background-color: #c00000;
  }
  
  .search-box {
    position: sticky;
    top: 0;
    z-index: 999;
  }
  
  .sugg-list {
    padding: 0 5px;
  
    .sugg-item {
      font-size: 12px;
      padding: 13px 0;
      border-bottom: 1px solid #efefef;
      display: flex;
      align-items: center;
      justify-content: space-between;
  
      .goods-name {
        // 文字不允许换行（单行文本）
        white-space: nowrap;
        // 溢出部分隐藏
        overflow: hidden;
        // 文本溢出后，使用 ... 代替
        text-overflow: ellipsis;
        margin-right: 3px;
      }
    }
  }
  
  .history-box {
    padding: 0 5px;
  
    .history-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      font-size: 13px;
      border-bottom: 1px solid #efefef;
    }
  
    .history-list {
      display: flex;
      flex-wrap: wrap;
  
      .uni-tag {
        margin-top: 5px;
        margin-right: 5px;
      }
    }
  }
</style>
