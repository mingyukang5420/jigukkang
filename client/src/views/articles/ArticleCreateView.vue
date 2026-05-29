<template>
  <div class="article-create-container">
    <div class="article-create-header">
      <h1>당신만의 지역 구석구석 경험을 공유해주세요</h1>
      <button @click="handleCancel" class="btn-cancel">취소</button>
    </div>

    <form @submit.prevent="handleSubmit" class="article-form">
      <!-- 장소 검색 -->
      <div class="form-group">
        <label for="place-search"> 장소 <span class="required">*</span> </label>

        <!-- 선택된 장소 표시 -->
        <div v-if="selectedPlace" class="selected-place">
          <div class="place-info">
            <img
              v-if="selectedPlace.main_image"
              :src="selectedPlace.main_image"
              alt="장소 이미지"
              class="place-thumbnail"
            />
            <div class="place-details">
              <p class="place-title">{{ selectedPlace.title }}</p>
              <p class="place-category">{{ selectedPlace.category_path }}</p>
              <p class="place-address">{{ selectedPlace.address_new }}</p>
            </div>
          </div>
          <button type="button" @click="clearSelectedPlace" class="btn-clear-place">변경</button>
        </div>

        <!-- 검색 입력 -->
        <div v-else class="place-search-wrapper">
          <input
            id="place-search"
            v-model="placeSearchQuery"
            type="text"
            placeholder="장소명 또는 주소를 입력하세요 (최소 2자)"
            class="form-control"
            @input="handlePlaceSearch"
            @focus="showSearchResults = true"
            autocomplete="off"
          />

          <!-- 검색 결과 드롭다운 -->
          <div
            v-if="
              showSearchResults &&
              (searchResults.length > 0 || isSearching || placeSearchQuery.length === 0)
            "
            class="search-results-dropdown"
          >
            <div v-if="placeSearchQuery.length === 0" class="recommendation-section">
              <p class="recommend-title">추천 키워드</p>
              <div class="keyword-list">
                <!-- 추후 인기 키워드로 반영 -->
                <button
                  v-for="kw in ['서울', '잠실', '카페', '떡볶이']"
                  :key="kw"
                  type="button"
                  @mousedown="selectKeyword(kw)"
                  class="keyword-tag"
                >
                  #{{ kw }}
                </button>
              </div>
            </div>
            <!-- 로딩 -->
            <div v-if="isSearching" class="search-loading">
              <span class="loading-spinner"></span>
              검색 중...
            </div>

            <!-- 검색 결과 -->
            <div v-else-if="searchResults.length > 0" class="search-results-list">
              <div
                v-for="place in searchResults"
                :key="place.cid"
                class="search-result-item"
                @click="selectPlace(place)"
              >
                <img
                  v-if="place.main_image"
                  :src="place.main_image"
                  alt="장소 이미지"
                  class="result-thumbnail"
                />
                <div class="result-info">
                  <p class="result-category">{{ place.category_path }}</p>
                  <p class="result-title">{{ place.title }}</p>
                  <p class="result-address">{{ place.address_new }}</p>
                </div>
              </div>
            </div>

            <!-- 결과 없음 -->
            <div v-else-if="placeSearchQuery.length >= 2" class="no-results">
              검색 결과가 없습니다
            </div>
          </div>
        </div>

        <p v-if="!selectedPlace" class="help-text">장소명이나 주소로 검색하세요</p>
      </div>

      <!-- 제목 -->
      <div class="form-group">
        <label for="title">제목 <span class="required">*</span></label>
        <input
          id="title"
          v-model="formData.title"
          type="text"
          maxlength="100"
          required
          placeholder="게시물 제목을 입력하세요"
          class="form-control"
        />
        <span class="char-count">{{ formData.title.length }}/100</span>
      </div>

      <!-- 내용 -->
      <div class="form-group">
        <label for="content">내용 <span class="required">*</span></label>
        <textarea
          id="content"
          v-model="formData.content"
          required
          placeholder="게시물 내용을 입력하세요"
          class="form-control"
          rows="10"
        ></textarea>
      </div>

      <!-- 해시태그 -->
      <div class="form-group">
        <label for="hashtags">해시태그</label>
        <input
          id="hashtags"
          v-model="hashtagInput"
          type="text"
          placeholder="키워드 입력 후 스페이스 또는 엔터"
          class="form-control"
          @input="handleHashtagInput"
          @compositionstart="isComposing = true"
          @compositionend="onCompositionEnd"
          @keyup.enter.prevent="addHashtag"
          @blur="addHashtag"
        />
        <div v-if="hashtags.length > 0" class="hashtag-list">
          <span v-for="(tag, index) in hashtags" :key="index" class="hashtag-item">
            {{ tag }}
            <button type="button" @click="removeHashtag(index)" class="btn-remove-tag">×</button>
          </span>
        </div>
      </div>

      <!-- 이미지 업로드 -->
      <div class="form-group">
        <label>이미지</label>
        <div class="image-upload-area">
          <input
            type="file"
            ref="fileInput"
            @change="handleFileChange"
            accept="image/*"
            multiple
            class="file-input"
          />
          <button type="button" @click="triggerFileInput" class="btn-upload">이미지 선택</button>
          <span class="upload-hint">최대 10개까지 업로드 가능</span>
        </div>

        <!-- 이미지 미리보기 -->
        <div v-if="imagePreview.length > 0" class="image-preview-list">
          <div v-for="(img, index) in imagePreview" :key="index" class="image-preview-item">
            <img :src="img.url" :alt="`preview-${index}`" />
            <button type="button" @click="removeImage(index)" class="btn-remove-image">×</button>
          </div>
        </div>
      </div>

      <!-- 제출 버튼 -->
      <div class="form-actions">
        <button type="submit" class="btn-submit" :disabled="isSubmitting || !selectedPlace">
          {{ isSubmitting ? '작성 중...' : '게시물 작성' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isSubmitting = ref(false)
const fileInput = ref(null)

// 장소 검색 관련
const placeSearchQuery = ref('')
const searchResults = ref([])
const selectedPlace = ref(null)
const showSearchResults = ref(false)
const isSearching = ref(false)
const isComposing = ref(false)
let searchTimeout = null

const formData = reactive({
  title: '',
  content: '',
})

const hashtagInput = ref('')
const hashtags = ref([])
const imagePreview = ref([])
const imageFiles = ref([])

const selectKeyword = async (keyword) => {
  // 입력창에 키워드 주입
  placeSearchQuery.value = keyword

  // 검색 결과창을 열고 로딩 상태로 변경
  showSearchResults.value = true
  isSearching.value = true

  // 기존 검색 함수 호출
  await handlePlaceSearch()

  // 로딩 완료 후 (handlePlaceSearch 내부에 있다면 생략 가능)
  isSearching.value = false
}

// 장소 검색 (디바운싱 적용)
const handlePlaceSearch = () => {
  clearTimeout(searchTimeout)

  if (placeSearchQuery.value.length < 2) {
    searchResults.value = []
    return
  }

  isSearching.value = true

  searchTimeout = setTimeout(async () => {
    try {
      const response = await fetch(
        `/api/v1/places/search/?q=${encodeURIComponent(placeSearchQuery.value)}&limit=10`,
      )

      if (response.ok) {
        const data = await response.json()
        searchResults.value = data.results
      }
    } catch (error) {
      console.error('장소 검색 오류:', error)
    } finally {
      isSearching.value = false
    }
  }, 300) // 300ms 디바운싱
}

// 장소 선택
const selectPlace = (place) => {
  selectedPlace.value = place
  placeSearchQuery.value = ''
  searchResults.value = []
  showSearchResults.value = false
}

// 선택된 장소 해제
const clearSelectedPlace = () => {
  selectedPlace.value = null
  placeSearchQuery.value = ''
  searchResults.value = []
}

// 외부 클릭 시 검색 결과 닫기
const handleClickOutside = (event) => {
  const searchWrapper = document.querySelector('.place-search-wrapper')
  if (searchWrapper && !searchWrapper.contains(event.target)) {
    showSearchResults.value = false
  }
}

// 해시태그 추가
const addHashtag = () => {
  let tag = hashtagInput.value.trim()

  // 쉼표나 공백 제거
  tag = tag.replace(/[\s,]/g, '')

  if (!tag || tag === '#') {
    hashtagInput.value = ''
    return
  }

  const formattedTag = tag.startsWith('#') ? tag : `#${tag}`

  // 중복 태그 방지
  if (!hashtags.value.includes(formattedTag)) {
    hashtags.value.push(formattedTag)
  }

  hashtagInput.value = '' // 입력창 비우기
}

const handleHashtagInput = (event) => {
  // 한글 조합 중일 때는 스페이스 로직을 타지 않도록 방어
  if (isComposing.value) return

  const value = event.target.value
  // 마지막 글자가 공백이나 콤마인 경우에만 실행
  if (value.endsWith(' ') || value.endsWith(',')) {
    addHashtag()
  }
}

const onCompositionEnd = (event) => {
  isComposing.value = false
  handleHashtagInput(event)
}

// 해시태그 제거
const removeHashtag = (index) => {
  hashtags.value.splice(index, 1)
}

// 파일 입력 트리거
const triggerFileInput = () => {
  fileInput.value.click()
}

// 파일 선택 처리
const handleFileChange = (event) => {
  const files = Array.from(event.target.files)

  if (imagePreview.value.length + files.length > 10) {
    alert('이미지는 최대 10개까지 업로드 가능합니다.')
    return
  }

  files.forEach((file) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        imagePreview.value.push({
          url: e.target.result,
          file: file,
        })
        imageFiles.value.push(file)
      }
      reader.readAsDataURL(file)
    }
  })

  event.target.value = ''
}

// 이미지 제거
const removeImage = (index) => {
  imagePreview.value.splice(index, 1)
  imageFiles.value.splice(index, 1)
}

// 폼 제출
const handleSubmit = async () => {
  if (isSubmitting.value || !selectedPlace.value) return

  isSubmitting.value = true

  try {
    const formDataToSend = new FormData()

    formDataToSend.append('place_cid', selectedPlace.value.cid)
    formDataToSend.append('title', formData.title)
    formDataToSend.append('content', formData.content)

    hashtags.value.forEach((tag) => {
      formDataToSend.append('hashtags', tag)
    })

    imagePreview.value.forEach((img) => {
      formDataToSend.append('images', img.file)
    })

    const token = localStorage.getItem('access_token')

    const response = await fetch('/api/v1/articles/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formDataToSend,
    })

    if (response.ok) {
      const data = await response.json()
      alert('게시물이 성공적으로 작성되었습니다!')
      router.push(`/articles/${data.id || data.article_id}`)
    } else {
      const errorData = await response.json()
      console.error('서버 에러 응답:', errorData)
      alert(`작성 실패: ${JSON.stringify(errorData)}`)
    }
  } catch (error) {
    console.error('요청 오류:', error)
    alert('서버와 통신 중 오류가 발생했습니다.')
  } finally {
    isSubmitting.value = false
  }
}

// 취소
const handleCancel = () => {
  if (confirm('작성을 취소하시겠습니까? 작성 중인 내용이 사라집니다.')) {
    router.back()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.article-create-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.article-create-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.article-create-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
}

.article-form {
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.required {
  color: #ff4757;
}

.form-control {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-control:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

/* 장소 검색 관련 스타일 */
.place-search-wrapper {
  position: relative;
}

.search-results-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 0 0 8px 8px;
  max-height: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.search-loading {
  padding: 20px;
  text-align: center;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.search-results-list {
  max-height: 400px;
}

.search-result-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.2s;
}

.search-result-item:hover {
  background: #f8f9fa;
}

.search-result-item:last-child {
  border-bottom: none;
}

.result-thumbnail {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;
}

.result-info {
  flex: 1;
  min-width: 0;
}

.result-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-category {
  font-size: 12px;
  color: #3498db;
  margin-bottom: 0;
}

.result-address {
  font-size: 12px;
  color: #999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.no-results {
  padding: 20px;
  text-align: center;
  color: #999;
}

/* 선택된 장소 표시 */
.selected-place {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8f9fa;
  border: 2px solid #3498db;
  border-radius: 8px;
  margin-bottom: 8px;
}

.place-info {
  display: flex;
  gap: 12px;
  flex: 1;
}

.place-thumbnail {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;
}

.place-details {
  flex: 1;
  min-width: 0;
}

.place-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
  font-size: 16px;
}

.place-category {
  font-size: 13px;
  color: #3498db;
  margin-bottom: 4px;
}

.place-address {
  font-size: 13px;
  color: #666;
}

.btn-clear-place {
  padding: 8px 16px;
  background: white;
  color: #3498db;
  border: 1px solid #3498db;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
  flex-shrink: 0;
}

.btn-clear-place:hover {
  background: #3498db;
  color: white;
}

.help-text {
  font-size: 12px;
  color: #999;
  padding: 5px;
}

textarea.form-control {
  resize: vertical;
  min-height: 200px;
  font-family: inherit;
}

.char-count {
  display: block;
  text-align: right;
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.hashtag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.hashtag-item {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  background: #e3f2fd;
  color: #1976d2;
  border-radius: 20px;
  font-size: 14px;
  gap: 6px;
}

.btn-remove-tag {
  background: none;
  border: none;
  color: #1976d2;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.btn-remove-tag:hover {
  color: #0d47a1;
}

.image-upload-area {
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-input {
  display: none;
}

.btn-upload {
  padding: 10px 20px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.3s;
}

.btn-upload:hover {
  background: #2980b9;
}

.upload-hint {
  font-size: 12px;
  color: #999;
}

.image-preview-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.image-preview-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #eee;
}

.image-preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-remove-image {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
}

.btn-remove-image:hover {
  background: rgba(255, 0, 0, 0.8);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.btn-submit {
  padding: 12px 32px;
  background: #2ecc71;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-submit:hover:not(:disabled) {
  background: #27ae60;
}

.btn-submit:disabled {
  background: #95a5a6;
  cursor: not-allowed;
}

.btn-cancel {
  padding: 8px 20px;
  background: transparent;
  color: #7f8c8d;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-cancel:hover {
  background: #f8f9fa;
  border-color: #bdc3c7;
}

/* 드롭다운 내부 스크롤 및 크기 설정 */
.search-results-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  max-height: 400px; /* 이중 스크롤 방지를 위해 높이 제한 */
  overflow-y: auto;
  margin-top: 8px;
}

/* 추천 키워드 섹션 스타일 */
.recommendation-section {
  padding: 16px;
}

.recommend-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: #888;
  margin-bottom: 12px;
  text-transform: uppercase;
}

.keyword-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.keyword-tag {
  background: #f1f3f5;
  border: none;
  padding: 8px 14px;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #495057;
  cursor: pointer;
  transition: all 0.2s ease;
}

.keyword-tag:hover {
  background: #e9ecef;
  color: #667eea;
  transform: translateY(-1px);
}
</style>
