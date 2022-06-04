<template>
  <view>
    <view class="my-search-container" :style="{'background-color': bgcolor}">
      <!-- 使用view组件模拟input输入框的样式 -->
      <view class="my-search-box" :style="{'border-radius': radius + 'px'}" @click="searchBoxHandler">
        <uni-icons type="search" size="17"></uni-icons>
        <text class="placeholder">搜索</text>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name:"my-search",
    data() {
      return {
        
      };
    },
    props: {
      bgcolor: {
        type: String,
        default: '#c00000'
      },
      radius: {
        type: Number,
        default: 18
      }
    },
    methods: {
      // 点击了模拟的input输入框
      searchBoxHandler() {
        // 触发外界通过@click绑定的click事件处理函数
        this.$emit('click')
      }
    }
  }
</script>

<style lang="scss">
  .my-search-container {
    height: 50px;
    padding: 0 10px;
    display: flex;
    align-items: center;
  }
  
  .my-search-box {
    height: 36px;
    background-color: #fff;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .placeholder {
      font-size: 15px;
      margin-left: 5px;
    };
  }
</style>