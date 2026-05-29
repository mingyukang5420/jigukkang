# 🌍 지구깡 (Jigu-Kkang)

> 지역 구석 구석 깡! 지역 정보를 랜덤으로 추천받아보세요!

지구깡은 즉흥적인 경험을 추구하는 사용자들을 위하여 보장된 장소를 랜덤으로 추천하고, 경험을 공유할 수 있는 소셜 플랫폼입니다.

## 📋 목차

- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [시작하기](#시작하기)
- [서비스 플로우](#서비스-플로우)
- [기여하기](#기여하기)

## ✨ 주요 기능

### 🎲 랜덤 장소 뽑기


- 장소를 랜덤으로 추천
- 장소 언박싱 애니메이션으로 설렘 제공
- 최근 5개 뽑기 기록 자동 저장

### 📝 포스트 작성 및 공유

- 방문한 장소에 대한 후기 작성
- 이미지와 함께 경험 공유
- 팔로워 피드에 자동 업데이트

### 👥 소셜 기능

- 다른 사용자 팔로우
- 포스트 좋아요 및 댓글
- 팔로우 피드에서 친구들의 여행 경험 확인

### 📌 마이페이지

- **좋아요 목록**: 관심있는 포스트 모아보기
- **뽑기 기록**: 최근 뽑은 장소 5개 확인
- **저장한 장소**: 나중에 방문하고 싶은 장소 저장
- **내 게시글**: 작성한 포스트 관리 (수정/삭제)

## 🛠 기술 스택

### Frontend

- **Vue.js**: Progressive JavaScript Framework
- **Vue Router**: SPA 라우팅
- **Vuex/Pinia**: 상태 관리

### Backend

- **Django**: Python Web Framework
- **Django REST Framework**: RESTful API 개발
- **PostgreSQL**: 관계형 데이터베이스

### Deployment

- (배포 정보 추가 예정)

## 📁 프로젝트 구조

```
jigu-gacha/
├── client/                # Vue (Frontend)
│   ├── src/
│   │   ├── components/    # 재사용 가능한 컴포넌트
│   │   ├── views/         # 페이지 컴포넌트
│   │   ├── router/        # 라우팅 설정
│   │   ├── store/         # 상태 관리
│   │   └── assets/        # 정적 파일
│   └── package.json
│
├── server/                # Django (Backend)
│   ├── config/            # API 앱
│   ├── accounts/          # 사용자 관리
│   ├── articles/          # 게시글 관리
│   ├── places/            # 장소 관리
│   ├── recommendations/   # 추천 관리
│   └── requirements.txt
│
└── database/              # PostgreSQL
    └── schema/            # DB 스키마 정의
```

## 🚀 시작하기

### 필수 요구사항

- Node.js (v16 이상)
- Python (v3.9 이상)
- PostgreSQL (v13 이상)

### 설치 및 실행

#### 1. 저장소 클론

```bash
git clone https://github.com/MRDD-jigu/jigu-gacha.git
cd jigu-gacha
```

#### 2. Backend 설정

```bash
cd server

# 가상환경 생성 및 활성화
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt

# 환경변수 설정
cp .env.example .env
# .env 파일을 열어 데이터베이스 정보 입력

# 데이터베이스 마이그레이션
python manage.py migrate

# 서버 실행
python manage.py runserver
```

#### 3. Frontend 설정

```bash
cd client

# 의존성 설치
npm install

# 개발 서버 실행
npm run serve
```

#### 4. 브라우저에서 확인

- Frontend: http://localhost:8080
- Backend API: http://localhost:8000

## 🗺 서비스 플로우

```
사용자 접속
    ↓
로그인 여부 확인
    ↓
[비로그인] → 소개 페이지 → 회원가입 → 로그인
    ↓
[로그인] → 깡 페이지 (메인)
    ↓
├─ 장소 뽑기 → 랜덤 장소 추천 → 결과 확인
├─ 포스트 피드 → 포스트 상세보기
├─ 포스트 작성 → 장소 선택 & 내용 작성
└─ 마이페이지
    ├─ 좋아요 목록
    ├─ 뽑기 기록
    ├─ 저장한 장소
    └─ 내 게시글
```

## 📱 주요 화면

### 메인 (깡 페이지)

- 랜덤 장소 뽑기 버튼
- 최근 팔로우 피드
- 네비게이션 메뉴

### 장소 뽑기

- 로딩 애니메이션
- 장소 언박싱 결과
- 장소 저장 및 포스트 작성 옵션

### 포스트 피드

- 팔로우한 사용자의 포스트
- 좋아요, 댓글, 공유 기능
- 장소 정보 확인

### 마이페이지

- 사용자 프로필
- 4가지 탭 (좋아요/뽑기기록/저장장소/내게시글)
- 통계 정보
