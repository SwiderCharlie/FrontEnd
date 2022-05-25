<template>
  <div class="home-container">
    <van-nav-bar title="黑马头条" fixed />
    <van-pull-refresh v-model="refreshing" :disabled="finished" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <!-- 导入,注册,并使用ArticleInfo组件 -->
        <ArticleInfo v-for="item in artlist" :key="item.id" :title="item.title" :author="item.aut_name" :cmtCount="item.comm_count" :time="item.pubdate" :cover="item.cover"></ArticleInfo>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
// 按需导入API接口
import { getArticleListAPI } from '@/api/articleAPI.js'
import ArticleInfo from '@/components/Article/ArticleInfo.vue'
export default {
  name: 'MyHome',
  data () {
    return {
      // 页码值
      page: 1,
      // 每页显示多少条数据
      limit: 10,
      // 文章的数组
      artlist: [],
      // 是否正在加载下一页数据
      loading: true,
      // 所有数据是否加载完毕了
      finished: false,
      // 是否正在下拉刷新
      isLoading: false
    }
  },
  created () {
    this.initArticleList()
  },
  methods: {
    // 封装获取文章列表数据的方法
    async initArticleList (isRefresh) {
      const { data: res } = await getArticleListAPI(this.page, this.limit)
      if (isRefresh) {
        this.artlist = [...res, ...this.artlist]
        this.isLoading = false
      } else {
        this.artlist = [...this.artlist, ...res]
        this.loading = false
      }

      if (res.length === 0) {
        this.finished = true
      }
    },
    onLoad () {
      this.page++
      this.initArticleList()
    },
    onRefresh () {
      this.page++
      this.initArticleList()
    }
  },
  components: {
    ArticleInfo
  }
}
</script>

<style lang="less" scoped>
  .home-container {
    padding: 46px 0 50px 0;
    .van-nav-bar {
      background-color: #007bff;
    }
    /deep/ .van-nav-bar__title {
      color: #fff;
    }
  }
</style>
