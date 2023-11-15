<template>
  <div class="container">
    <header class="top-bar">
      <h1 class="title">基于MeliSearch搜索引擎下的中文诗词搜索</h1>
      <div class="search-bar">
        <div class="search-box">
          <svg
            viewBox="0 0 23 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="sc-csCMJt GIhkK"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M.773 10.405c0-5.493 4.436-9.948 9.912-9.948 5.475 0 9.911 4.455 9.911 9.948 0 2.497-.917 4.779-2.43 6.526l4.466 4.472c.398.399.399 1.045.002 1.445-.36.363-.926.396-1.325.1l-.114-.099-4.516-4.521a9.844 9.844 0 0 1-5.994 2.025c-5.476 0-9.912-4.455-9.912-9.948Zm17.743 0c0-4.343-3.508-7.862-7.831-7.862-4.324 0-7.832 3.519-7.832 7.862s3.508 7.862 7.832 7.862c4.323 0 7.83-3.519 7.83-7.862Z"
              fill="currentColor"
            ></path>
          </svg>
          <input
            type="search"
            placeholder="请输入诗词相关内容..."
            class="search-input"
            v-model="searchText"
            style="width: 520px"
            @input="search"
          />
          <button color="#E41359" aria-label="clear" class="search-btn" @click="search">
            搜索
          </button>
        </div>
      </div>
    </header>
    <main>
      <div class="poetry-box" v-if="poetryList.length">
        <div class="poetry-item" v-for="item in poetryList" :key="item.id">
          <div class="poetry-title">{{ item.title }}</div>
          <div class="poetry-content">{{ item.paragraphs.join(' ') }}</div>
          <div class="poetry-author-tag">
            <div class="poetry-author">作者：{{ item.author }}</div>
            <div class="poetry-tag">{{ item.tags.join(' | ') }}</div>
          </div>
        </div>
      </div>
      <div class="empty-box" v-else>
        <div class="empty-text">抱歉，暂未搜索到该数据，可尝试修改搜索文本内容</div>
        <div class="empty-emoji">😢</div>
      </div>
      <div class="load-more-btn" v-if="hasMore" @click="getMore">加载更多</div>
    </main>
  </div>
</template>

<script setup>
import { MeiliSearch } from 'meilisearch'
import { ref, onMounted } from 'vue'
const client = new MeiliSearch({
  host: 'http://localhost:7700',
  apiKey: 'DHTtAiD22UxgIKhQwpS-EH5IcledknXII3KvwjkjdYI'
})

const poetryList = ref([])
const page = ref(1)
const totalHits = ref(0)
const totalPages = ref(0)
const processingTimeMs = ref(0)
const searchText = ref('')
const hasMore = ref(false)

const fetchData = async (str, page = 1) => {
  return new Promise((resolve, reject) => {
    try {
      client
        .index('poetry')
        .search(str, {
          page: page
        })
        .then((res) => resolve(res))
    } catch (error) {
      reject(error)
    }
  })
}

const getData = async (str, page = 1) => {
  const data = await fetchData(str, page)
  return data
}

const showLoad = () => {
  if(totalPages.value > page.value) {
    hasMore.value = true
  } else {
    hasMore.value = false
  }
}

const search = async () => {
  const data = await getData(searchText.value)
  poetryList.value = data.hits
  totalHits.value = data.totalHits
  totalPages.value = data.totalPages
  processingTimeMs.value = data.processingTimeMs

  showLoad()
}

const getMore = async () => {
  const data = await getData(searchText.value, page.value + 1)
  page.value = page.value + 1
  poetryList.value.push(...data.hits)

  showLoad()
}

onMounted(async () => {
  const data = await getData(searchText.value)
  poetryList.value = data.hits
  totalHits.value = data.totalHits
  totalPages.value = data.totalPages
  processingTimeMs.value = data.processingTimeMs

  showLoad()
})
</script>

<style scoped>
.container {
  width: 100vw;
  min-height: 100vh;
  background-color: rgb(250, 251, 254);
}
.title {
  margin-top: 16px;
  margin-bottom: 32px;
  font-weight: bold;
}
.top-bar {
  width: 100%;
  top: 0px;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: sticky;
  height: 120px;
  z-index: 3;
  min-height: 192px;
}
.search-bar {
  display: flex;
  box-sizing: border-box;
}
.search-box {
  width: 100%;
  display: flex;
  align-items: center;
}
.search-box > svg {
  max-width: 20px;
  color: rgb(96, 108, 139);
  position: relative;
  left: 32px;
}
.search-input {
  height: 48px;
  width: 100%;
  padding-left: 48px;
  padding-right: 8px;
  background-position: left 16px top 50%;
  border-color: rgb(237, 238, 247);
  border-width: 1px;
  border-style: solid;
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.04) 0px 4px 6px;
  transition: border-color 300ms ease 0s;
  outline: none;
  color: rgb(57, 72, 110);
  font-weight: 500;
  font-size: 18px;
  line-height: 22px;
  flex: 1;
  transition: all 0.3s;
}
.search-input:hover {
  border-color: rgb(203, 207, 219);
}
.search-input:focus {
  border-color: rgb(167, 174, 192);
}
.search-btn {
  margin-left: 8px;
  min-width: 64px;
  height: 100%;
  background-color: rgb(149, 157, 179);
  border-radius: 8px;
  border: solid 1px rgb(237, 238, 247);
  box-shadow: rgba(0, 0, 0, 0.04) 0px 4px 6px;
  padding: 4px 6px;
  color: rgb(32, 30, 31);
  font-weight: 600;
  outline: none;
  background-color: transparent;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s;
}
.search-btn:hover {
  cursor: pointer;
  background-color: rgb(139, 146, 165, 0.1);
}
.poetry-box {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 64px;
  padding: 32px;
  padding-left: 128px;
}
.poetry-item {
  max-width: 70vw;
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
  background-color: #bcbbbb2b;
  padding: 16px;
  border-radius: 10px;
  transition: all 0.3s;
}
.poetry-item:hover {
  background-color: #bcbbbb44;
  cursor: pointer;
}
.poetry-title {
  font-size: 18px;
  line-height: 32px;
  font-weight: 600;
  color: rgb(57, 72, 110);
}
.poetry-title:hover {
  text-decoration: underline;
}
.poetry-content {
  font-size: 14px;
  line-height: 18px;
  color: rgb(26, 26, 26);
  margin-top: 8px;
}
.poetry-author-tag {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  line-height: 14px;
  margin-top: 8px;
}
.poetry-author {
  color: rgb(63 26 26);
}
.poetry-tag {
  padding: 4px 6px;
  background-color: rgba(203, 207, 219, 0.363);
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgb(105, 104, 104);
}
.empty-box {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 256px;
  text-align: center;
  margin: 0 auto;
  margin-top: 64px;
}
.empty-text {
  font-size: 18px;
  line-height: 25px;
  font-weight: 400;
  margin-bottom: 16px;
  color: rgb(57, 72, 110);
}
.empty-emoji {
  font-size: 18px;
  line-height: 25px;
  font-weight: 400;
  margin-bottom: 56px;
}
.load-more-btn {
  padding: 0px 24px;
  width: 128px;
  background-color: transparent;
  border: 2px solid rgb(228, 19, 89);
  color: rgb(228, 19, 89);
  height: 34px;
  border-radius: 8px;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  outline: none;
  transition:
    background-color 300ms ease 0s,
    color 200ms ease 0s,
    box-shadow 300ms ease 0s,
    border-color 300ms ease 0s;
  margin: 32px auto 0px;
  font-size: 14px;
  line-height: 22px;
  font-weight: 600;
}
</style>
