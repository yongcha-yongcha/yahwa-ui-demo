# 야화 컴포넌트 기록

화면을 개선하면서 만들어지거나 바뀐 컴포넌트를 기록합니다.
컴포넌트가 생기거나 바뀌면 아래 세 곳을 함께 갱신합니다.

1. 이 문서
2. `public/design-system.html`의 Components 섹션
3. Figma `Component` 페이지 (https://www.figma.com/design/18xFlsq3rG6MJF6QSZLEHY/yahwa)

토큰은 `public/tokens.css`만 사용합니다.

## Button

Figma: [Button 컴포넌트](https://www.figma.com/design/18xFlsq3rG6MJF6QSZLEHY/yahwa?node-id=12-14)

| 변형 | 사용처 | 배경 | 글자 | 테두리 | 높이 / 모서리 | 코드 |
|---|---|---|---|---|---|---|
| Primary | 화면의 주요 행동 하나 | `--color-bg-button-primary` (누름 `-active`) | `--color-fg-inverse` | `--color-border-button-primary` | 52 / `--radius-button` | `.auth-method.primary`, `.ob-next`, `.start` 외 |
| Kakao | 카카오 로그인 | `--color-bg-kakao` | `--color-fg-kakao` 85% | 없음 | 52 / `--radius-button` | `.auth-method.kakao` |
| Apple | Apple 로그인 | `--color-bg-apple` | `--color-fg-apple` | `--color-border-apple` | 52 / `--radius-button` | `.auth-method.apple` |
| Text Link | 주요 버튼 아래 보조 이동 | 없음 | `--color-fg-secondary` (누름 `--color-fg-primary`), 14 Medium, 밑줄 `--color-border-muted` | 없음 | 44 / 없음 | `.text-link` |

### 외부 가이드로 고정된 값 (임의로 바꾸지 않음)

- **Kakao** ([공식 가이드](https://developers.kakao.com/docs/latest/ko/kakaologin/design-guide)): 배경 `#FEE500`, 글자 검정 85%, 심볼 검정, 모서리 12px, 문구 "카카오 로그인" 또는 "로그인", OS 기본 글꼴, 말풍선 심볼 필수.
- **Apple** ([HIG](https://developer.apple.com/design/human-interface-guidelines/sign-in-with-apple)): 흰색·외곽선·검정 중 선택, 로고와 글자는 검정 또는 흰색만, 공식 로고만 사용, 다른 로그인 버튼보다 작지 않게, 최소 140×30pt, 여백은 높이의 1/10, 문구는 Apple 시스템 현지화 "Apple로 계속하기". 로고 이미지는 안에 여백이 있어 33px로 넣고 여백을 보정합니다(실제 로고 약 11×14, 글자와 간격 8, 카카오 심볼과 같은 높이).

## GNB

Figma: [GNB 컴포넌트](https://www.figma.com/design/18xFlsq3rG6MJF6QSZLEHY/yahwa?node-id=34-159) · 변형 `Selected=Home|Hearts|Letters|Community|My`

앱 하단의 글라스 내비게이션입니다. 값은 `tokens.css`의 `--gnb-*`에서 바꿉니다. 코드는 `nov08.css`의 `.home-nav` 재정의 블록입니다.

| 부분 | 값 | 토큰 |
|---|---|---|
| 위치 / 크기 | 좌우 20, 하단 20, 높이 64, 모서리 32 | `--gnb-margin-x`, `--gnb-margin-bottom`, `--gnb-height`, `--gnb-radius` |
| 글라스 | paper 60%, blur 6, saturate 170% | `--gnb-bg`, `--gnb-blur`, `--gnb-saturate` |
| 테두리 / 그림자 | 흰색 20% 1px, 0 8 24 cool-neutral-800 14% | `--gnb-border`, `--gnb-shadow` |
| 선택 캡슐 | sky-100 72%, 칸 너비 전체 × 48, 모서리 24 | `--gnb-selected-bg`, `--gnb-selected-height`, `--gnb-selected-radius` |
| 아이콘 | 24, 선 1.5, cool-neutral-800. 선택되면 같은 모양을 sky-600으로 채움 | `--gnb-icon`, `--gnb-icon-active`, `--gnb-icon-knock`, `--gnb-icon-size`, `--gnb-icon-stroke` |
| 알림 점 | 8 정원, red-500, 흰색 링 1, 아이콘 우상단 모서리(선택 칸 중앙에서 오른쪽 8, 위에서 8). 숫자는 보이지 않고 버튼의 `aria-label`로 안내 | `--gnb-badge-size`, `--gnb-badge-bg`, `--gnb-badge-ring`, `--gnb-badge-offset` |
| 프로필 | 32, 링 흰색 1.5 / 선택 시 brand-line 2 | `--color-brand-line` |

- 콘텐츠는 글라스 뒤로 지나갑니다. 스크롤 영역은 `padding-bottom: var(--gnb-clearance)`(96px)로 마지막 내용이 가려지지 않게 합니다.
- 하단 CTA와 입력창은 GNB 위 `--gnb-clearance`에 고정합니다.
- GNB는 화면 위 고정 레이어(`#gnb-layer`)에 하나만 있고, 메뉴를 옮기면 선택 캡슐이 260ms로 미끄러집니다(`--gnb-capsule-duration`).
- `prefers-reduced-transparency`에서는 불투명한 paper로 바뀝니다.
- Figma에는 saturate 효과가 없어 blur만 들어가 있습니다.

## Menu Row

Figma: [Menu Row 컴포넌트](https://www.figma.com/design/18xFlsq3rG6MJF6QSZLEHY/yahwa?node-id=40-50) · 변형 `Detail=False|True`

설정·메뉴 목록의 한 줄입니다. 코드는 `features.js`의 `myItem()`과 `#mypage .my-setting`입니다. 파란색은 쓰지 않고 쿨뉴트럴로 구성합니다.

| 부분 | 값 | 토큰 |
|---|---|---|
| 줄 | 최소 높이 49, 위아래 8, 좌우 4, 간격 12 | |
| 아이콘 칩 | 30, 모서리 12, cool-neutral-50 | `--color-bg-icon` |
| 아이콘 | 18, 선 1.4, cool-neutral-600 | `--color-fg-icon` |
| 제목 / 보조 | 14 Medium / 12 Regular | `--color-fg-primary`, `--color-fg-subtle` |
| 화살표 | `.chev-md` 20, cool-neutral-300 | `--color-fg-chevron` |
| 구분선 | 1px, cool-neutral-100 | `--color-border-default` |

## Heart Card

Figma: [Heart Card 컴포넌트](https://www.figma.com/design/18xFlsq3rG6MJF6QSZLEHY/yahwa?node-id=46-61) · 속성 `Status`, `Nickname`, `Age`

마음함 카드입니다. 코드는 `nov08.css`의 `#heartbox .heart-person`이고, 렌더링 함수의 내용 중 닉네임, 나이, 인증 뱃지, 관심 상태만 화면에 남깁니다.

| 부분 | 값 | 토큰 |
|---|---|---|
| 카드 | 비율 3:4, 모서리 16 | |
| 사진 그늘 | 아래 56%, cool-neutral-950 0 → 70% | |
| 관심 상태 칩 | 왼쪽 위 8, 11 Medium, 모서리 12 | `--color-bg-love-soft`, `--color-fg-love-strong` |
| 닉네임 | Gowun Batang 17, 흰색 | `--color-fg-inverse` |
| 나이 | 15 SemiBold, 흰색 | `--color-fg-inverse` |
| 인증 뱃지 | 18, 사진 위에서는 흰색 | `--color-fg-inverse` |

### 인증 뱃지

- **나이·전화번호:** 물결 체크 `Fill/Shape/wavy-check`, 색 `--color-cert-basic`(Sky 500)
- **학력·직장·소득:** 서류가방 `Fill/Commerce/briefcase`, 색 `--color-cert-work`(Sage 600)
- 물결이 항상 먼저 옵니다. 사진 위에서는 둘 다 흰색으로 씁니다.
- 앱 전체에 적용됩니다. 코드는 `features.js`의 `certMark()` 한 곳입니다.

## Text Field

입력창, 여러 줄 입력, 선택창에 같은 규칙을 씁니다. 코드는 `nov08.css`의 Text Field 블록과 `fields.js`입니다.

| 상태 | 테두리 | 배경 | 기타 |
|---|---|---|---|
| 기본 | 1px `--color-border-control` | 흰색 | 안내 문구 |
| 포커스 | Sky 600, 총 1.5px `--color-border-focus` | 흰색 | 커서 Sky 600 |
| 입력 중 | 포커스와 같음 | 흰색 | 지우기 버튼 표시 |
| 입력 완료 | 기본과 같음 | 흰색 | |
| 오류 | Red 500, 총 1.5px `--color-border-error` | 흰색 | 문구 `--color-fg-danger`, `.is-invalid` |
| 성공 | 기본과 같음 | 흰색 | 오른쪽 체크, `.tf-wrap.is-valid` |
| 비활성 | `--color-border-default` | `--color-bg-field-off` | 글자 `--color-fg-field-off` |
| 읽기 전용 | `--color-border-default` | `--color-bg-field-off` | 글자는 기본색 |

- 높이 54, 모서리 `--radius-button`(12), 글자 16.
- 포커스에는 바깥선을 쓰지 않습니다. 테두리 안쪽으로만 두꺼워져 레이아웃이 움직이지 않습니다.
- 지우기 버튼은 누르는 영역 44입니다. 현재 휴대폰 번호, 인증번호, 닉네임, 키 입력에 있습니다.

## OTP Field

인증번호 6자리를 한 칸에 한 숫자씩 채웁니다. 코드는 `nov08.css`의 OTP Field 블록과 `otp.js`이고, 토큰은 `--otp-*`입니다. 화면은 `#verify-code`입니다.

| 상태 | 배경 | 테두리 | 숫자 |
|---|---|---|---|
| 빈 칸 | `--otp-empty-bg` | 1px `--otp-empty-edge` | 없음 |
| 지금 입력할 칸 | `--otp-empty-bg` | 총 1.5px `--color-border-focus` | 커서 표시 |
| 입력한 칸 | `--otp-fill-bg`(Sky 100) | 없음 | `--otp-fill-fg`(Sky 700) |
| 오류 | `--otp-error-bg`(Red 100) | 없음 | `--otp-error-fg`, 좌우로 짧게 흔들림 |

- 칸 높이 56, 간격 8, 모서리 12, 숫자 24.
- 여섯 번째 숫자를 넣으면 240ms 뒤 버튼 없이 확인합니다. 오류 뒤 숫자를 누르면 처음부터 다시 입력합니다.
- 실제 입력은 칸 위에 겹친 투명한 입력창 하나가 받습니다. 휴대폰 숫자 키패드와 문자 자동 입력(`one-time-code`)을 씁니다.
- 그림 키패드 `.otp-keypad`는 마우스 환경의 시연용이고, 터치 기기에서는 숨습니다.

### 완료 모션

| 순서 | 움직임 | 시간 |
|---|---|---|
| 1 | 숫자가 사라짐, 키패드와 다시 받기 퇴장 | 80ms |
| 2 | 칸이 가운데로 모임 | 360ms |
| 3 | 칸이 56px 동그라미로 바뀌고 Sky 600으로 물듦 | 300ms |
| 4 | 체크가 그려짐, 3번이 끝나기 30ms 전에 시작 | 510ms |
| 5 | 동그라미 12 아래에 "인증되었어요"가 8px 떠오름, 4번이 끝나기 280ms 전에 시작 | 320ms |
| 6 | 900ms 머문 뒤 약관 동의로 이동 | |

체크는 Figma의 `Line/Shape/check`와 같은 모양을 중심선으로 그린 것이고, 48px 크기에 선 3.5px입니다. 모션 줄이기 설정에서는 이동 없이 페이드만 합니다.

## Match Card

Figma: [Match Card 컴포넌트](https://www.figma.com/design/18xFlsq3rG6MJF6QSZLEHY/yahwa?node-id=49-85)

인연 홈 카드입니다. 사진 위에 background blur를 6겹으로 쌓아 아래로 갈수록 흐려지고, 카드마다 사진에서 뽑은 색상으로 번집니다. 코드는 `card-blur.js`와 `nov08.css`의 Match Card 블록입니다.

| 부분 | 값 | 토큰 |
|---|---|---|
| 블러 | 세기 40, 시작 59%, 길이 30% | `--card-blur-size`, `--card-blur-start`, `--card-blur-length` |
| 번지는 색 | 시작 50%, 가장 진한 위치 80% | `--card-tint-start`, `--card-tint-end` |
| 색 조정 | 진하기 55%, 채도 61%, 밝기 61% | `--card-tint-alpha`, `--card-tint-saturation`, `--card-tint-lightness` |
| 닉네임, 나이 | 같은 위계 24 SemiBold, 사이에 콤마 | |
| 주소 | 14 Regular, 아이콘 없음 | |

- 색상(hue)만 사진 아래쪽 45%에서 뽑고, 채도와 밝기는 토큰 값을 씁니다.
- 공개 전 카드에는 적용하지 않습니다.

## Activity Chip

Figma: [Activity Chip 컴포넌트](https://www.figma.com/design/18xFlsq3rG6MJF6QSZLEHY/yahwa?node-id=47-88)

24시간 내 활동을 표시합니다. 코드는 `nov08.css`의 Activity Chip 블록(`.recent-activity`)입니다.

| 부분 | 값 | 토큰 |
|---|---|---|
| 칩 | 높이 24, 좌우 8, 모서리 12, 테두리 없음 | `--color-bg-activity` |
| 글자 | 12 Medium | `--color-fg-activity` |
| 점 | 5, 간격 4 | `--color-fg-activity-dot` |

- 앱 전체에 같은 스타일로 적용됩니다. 상대 프로필에서는 이름 위에 놓입니다.

## Toast · 알림 한 줄

화면 아래에 잠깐 뜨는 알림(`.fx-toast`)입니다. 모양은 `nov08.css`의 Toast 블록(`--toast-*`), 위치와 모션은 `transitions.js`의 `placeToast`와 `TOAST`가 정합니다.

- 모양: 작은 사각. 글 길이만큼만 넓어지고 가운데에 떠요(최대 폭은 양쪽 여백 20을 뺀 만큼, 넘치면 두 줄). 높이 `--toast-h`(36 이상), 좌우 `--toast-pad-x`(14) · 위아래 8, 모서리 `--toast-radius`(10), `--toast-bg`(`--color-bg-inverse`) 위에 흰 글 12px 500.
- 위치: 지금 화면의 아래 버튼 영역(`.ob-bottom` 등)이나 하단 탭 중 가장 높은 곳보다 12px 위. 아래 영역을 절대 덮지 않습니다. 아래 영역 높이는 화면마다 달라서 알림이 뜰 때마다 다시 재고, 화면이 넘어가는 중이면 새 화면을 기준으로 잡습니다. 아래 영역이 없는 화면은 휴대폰 아래에서 12px 위.
- 모션: 나타날 때 아래에서 7px · 90%에서 떠오르며 460ms, 최소 2.8초 머문 뒤 4px 내려가며 380ms로 흐려짐. 곡선은 둘 다 부드러운 ease-out `cubic-bezier(.16,1,.3,1)`. 알림을 띄운 코드가 더 일찍 지워도 2.8초는 채움. 새 알림으로 바뀔 때는 이전 알림이 바로 빠지고 새 알림만 떠오름. 움직임 줄이기 설정이면 흐려지기만.

## 화면 전환

코드는 `public/transitions.js`입니다.

| 상황 | 움직임 | 시간 |
|---|---|---|
| 탭끼리 이동 | 새 화면 페이드 인 | 170ms |
| 안쪽으로 들어감 (상세, 가입 다음 단계) | 오른쪽에서 밀려 들어오고 이전 화면은 왼쪽으로 24% 밀림 | 300ms |
| 뒤로 나옴 | 위 움직임의 반대 | 280ms |
| 세부 화면끼리 이동 | 내용만 24px 이동 + 페이드 | 220ms |
| 가입 단계끼리 (휴대폰 인증, 약관 동의, 기본 프로필) | 이전 내용 100ms로 사라진 뒤 내용만 30px 떠오름, 항목 간격 50ms, 튕김 없음. 상단과 하단 버튼은 고정, 진행 바만 늘어남 | 800ms |
| 소개 단계끼리 (사진 등록, 상세 정보, 자기소개, 나의 해시태그, 소개 미리보기) | 가입 단계와 같은 떠오름. 상단, 진행 게이지(`.intro-step-gauge`), 하단 버튼은 고정이고 게이지 채움만 360ms로 늘어남. 스크롤 영역 안 항목을 띄우되 앞 4개까지만 50ms 간격, 나머지는 4번째와 함께. 새 화면은 맨 위부터 | 800ms (최대 지연 250ms) |

- 기본 프로필 → 사진 등록, 소개 미리보기 → 다음은 단계가 바뀌는 경계라 밀어 넘기기를 그대로 씁니다.
- 스플래시와 웰컴은 자체 진입 모션이 있어 전환을 넣지 않습니다.
- `prefers-reduced-motion`에서는 전환 없이 바로 바뀝니다.

## Welcome 진입 모션

웰컴 화면에 들어올 때 한 번 재생됩니다. 값은 `tokens.css`의 `--welcome-*`에서 바꾸고, 코드는 `nov08.css`의 Welcome 진입 모션 블록과 `index.html`의 `setWelcomeEnter()`입니다.

| 대상 | 움직임 | 시작 | 시간 | 커브 |
|---|---|---|---|---|
| 사진 | 흐림 20px → 0, 크기 111% → 100% | 0ms | 1800ms | Ease In-Out |
| 사진 페이드 | 불투명도 0 → 1 | 0ms | 600ms | Ease Out |
| 문구 → 로고 → 하트 | 불투명도 + 위로 8px | 900ms, 120ms 간격 | 700ms | Ease Out |
| 바텀시트 | 아래에서 올라옴 | 900ms | 500ms | Drawer |
| 시트 안쪽 3개 | 불투명도 + 위로 8px | 1020ms, 50ms 간격 | 400ms | Ease Out |

- 가입 화면에서 뒤로 돌아올 때는 재생하지 않습니다.
- `prefers-reduced-motion`에서는 흐림과 이동 없이 300ms 페이드만 합니다.
- 시트가 덮기 전 사진 아래 빈 공간은 반사 이미지(`.full-photo-mirror`)로 잇습니다.

## Icon

Figma: [Line](https://www.figma.com/design/18xFlsq3rG6MJF6QSZLEHY/yahwa?node-id=15-2) · [Fill](https://www.figma.com/design/18xFlsq3rG6MJF6QSZLEHY/yahwa?node-id=17-6009) · [Duocolor](https://www.figma.com/design/18xFlsq3rG6MJF6QSZLEHY/yahwa?node-id=17-11196) · coolicons 각 1,258개

- **먼저 [Core Icons](https://www.figma.com/design/18xFlsq3rG6MJF6QSZLEHY/yahwa?node-id=19-2) 163개에서 찾고**, 없으면 전체 목록에서 찾습니다.
- 앱에는 전체를 넣지 않고, 화면에 필요한 아이콘만 이 목록에서 골라 넣습니다.
- 컴포넌트 이름: `스타일/분류/아이콘이름` (예: `Line/Communication/bell`, `Fill/Communication/bell`, `Duocolor/Communication/bell`)
- 기본 24px, Outline Stroke 적용. 크기를 바꾸면 선 굵기도 비례해서 함께 변합니다.
- 색은 `fg/primary` 변수에 연결되어 있고, 필요한 역할의 색으로 바꿔 씁니다.
- Duocolor의 포인트 레이어(`Accent`)는 `fg/accent`에 연결되어 있어 두 색을 따로 바꿀 수 있습니다.

### Checkbox

체크박스는 Figma 아이콘 세 개를 씁니다. 코드는 `nov08.css`의 Checkbox 블록이고 약관 동의와 더보기 세부 화면에 적용돼 있습니다.

| 상태 | 아이콘 | 색 |
|---|---|---|
| 선택 안 함 | `Line/Shape/square` | `--color-border-muted` |
| 선택 | `Fill/Shape/square-check` | `--color-bg-accent` |
| 일부 선택 (전체 동의) | `Fill/Shape/square-minus` | `--color-bg-accent` |

- 크기 24. 체크 표시는 아이콘의 빈 부분으로, 뒤에 16px 흰색 면을 깔아 흰 체크로 보이게 합니다.
- 색 바뀜은 120ms. 포커스는 감싸는 줄에 표시합니다.

### Agreement Row

약관 동의 화면의 한 줄입니다. 왼쪽은 체크박스와 항목 이름을 감싼 `label.ob-check`, 문서가 있는 항목만 줄 끝에 `button.ob-doc`(44px, `chevron-right` 20, `--color-fg-tertiary`)를 둡니다. 꺾쇠를 누르면 전문이 열리고 체크는 바뀌지 않습니다. 줄 아래 선은 `--color-border-default`입니다. 현재 이용약관, 개인정보 수집·이용, 소식 및 혜택 알림 세 줄에 있습니다.

맨 위 전체 동의 줄은 면 없이 15px 600 글씨와 `--color-border-control` 구분선으로 나눕니다. 체크박스는 아래 항목과 같은 왼쪽 선에 있습니다.

### Choice Card

성별처럼 그림이 있는 선택 카드입니다. 텍스트 필드와 같은 상태 규칙을 씁니다. 코드는 `nov08.css`의 Choice Card 블록, 오류 연결은 `fields.js`입니다.

| 상태 | 테두리 | 배경 | 라디오 |
|---|---|---|---|
| 기본 | 1px `--color-border-control` | `--color-bg-surface` | 빈 원 `--radio-off` |
| 마우스를 올렸을 때 | 1px `--color-border-hover` | 흰색 | 빈 원 |
| 누르는 중 | 96%로 눌림 (100ms) | | |
| 포커스 | 1.5px `--color-border-focus` | 흰색 | 빈 원 |
| 선택됨 | 1px `--color-border-accent` | `--color-bg-selected` | 채운 원 `--radio-on` |
| 선택됨 + 포커스 | 1.5px `--color-border-focus` | `--color-bg-selected` | 채운 원 |
| 오류 | 1.5px `--color-border-error` (`.ob-choices.is-invalid`) | 흰색 | 빈 원 |
| 비활성 | 1px `--color-border-default` | `--color-bg-field-off` | 그림 40% |

- 바깥 선과 라디오 자체의 포커스 선은 쓰지 않습니다. 카드 사이 8, 안쪽 여백 8.
- 라디오는 20px. 선택 전은 Figma `Line/Shape/circle`, 선택은 야화에서 그린 `Line/System/radio-selected`(바깥 원은 circle과 같고 가운데 지름 10 점)입니다. Figma의 `radio-checked`는 가운데가 비어 있어 쓰지 않습니다.

### Wheel Picker

위아래로 넘겨 가운데 칸에 맞추는 바텀시트 선택입니다. yahwa-white-review의 휠 방식을 우리 토큰으로 다시 만들었습니다. 코드는 `wheel.js`(`window.yhWheel.open/close`)와 `nov08.css`의 Wheel Picker 블록이고, 지금은 기본 프로필의 주로 생활하는 지역에 씁니다.

- 칸 높이 `--wheel-row`(48) × 5칸. 가운데 띠는 `--wheel-band`(Sky 50), 선은 없습니다.
- 가운데 글자 18px 600 `--color-fg-primary`, 위아래는 한 칸마다 55%, 25%로 흐려지고 끝은 그라데이션으로 사라집니다.
- 휠에 키보드 포커스가 오면 띠 테두리만 1.5px `--color-border-focus`. 방향키, Home, End로 움직이고 Enter로 다음 단계.
- 넘길 때 아주 작은 틱 소리가 납니다. 끄는 버튼은 두지 않고, `navigator.audioSession.type="ambient"`로 아이폰 무음 스위치를 따릅니다. 안드로이드는 미디어 볼륨을 따릅니다.
- 한 칸 넘어갈 때마다 선택 햅틱을 부릅니다. 앱(웹뷰)에서 `window.yhHaptic = type => …`을 넣어 주면 그걸 쓰고, 없으면 `navigator.vibrate(4)`로 안드로이드에서만 진동합니다.
  - 아이폰 앱: `type`이 `selection`이면 `UISelectionFeedbackGenerator().selectionChanged()`를 호출합니다. 무음 모드에서도 느껴지고, 시스템 햅틱 설정을 끄면 자동으로 꺼집니다.
  - 안드로이드 앱: `View.performHapticFeedback(HapticFeedbackConstants.CLOCK_TICK)` 같은 짧은 틱을 씁니다.
  - 아이폰 사파리 웹에서는 진동을 낼 수 없습니다.
- 두 단계(시·도 → 시·군·구)일 때 첫 버튼은 "다음", 마지막은 "선택 완료", 두 번째 단계에 "시·도 다시 선택"이 있습니다.
- 시트가 열려 있는 동안 선택창(`.choice-trigger.is-open`)은 포커스 테두리입니다. 바깥을 누르거나 Esc로 닫습니다.
- 시트는 아래에서 300ms로 올라오고 240ms로 내려갑니다.

### Photo Slot

사진 등록 화면의 사진 칸입니다. 코드는 `nov08.css`의 사진 등록 블록, 사진이 들어간 칸은 `features.js`의 `poSyncPhotos`가 그립니다.

- 3열, 간격 8, 비율 3:4, 모서리 `--radius-button`(12). 빈 칸은 흰 면에 1px `--color-border-control`, 가운데 Figma `plus` 24.
- 첫 칸 왼쪽 위 8px에 대표 칩(높이 24, 12px 600). 빈 칸과 사진 위 모두 `--photo-chip-bg`(Sky 600)에 `--photo-chip-fg`(흰색) 글씨. 흰 유리 더보기 버튼과 색으로 구분됩니다.
- 사진이 있으면 오른쪽 위 8px에 더보기 버튼. 보이는 크기 `--photo-menu-size`(24), 하단 탭과 같은 유리 원(`--photo-menu-bg` 흰색 45% + 흐림 `--photo-menu-blur` 6, 테두리 `--photo-menu-edge`), 안의 Figma `more-horizontal` `--photo-menu-icon`(16), 누르는 영역은 44.
- 사진이 2장 이상이면 꾹 눌러(400ms) 끌어서 순서를 바꿉니다. 누르기 전 8px 넘게 움직이면 스크롤로 봅니다. 누르는 동안 96%로 살짝 들어가고, 들리면 104%와 `--photo-drag-shadow`로 떠오릅니다. 끄는 동안 다른 사진은 200ms로 비켜나 자리를 만들고, 놓으면 그 자리로 220ms 동안 내려앉습니다. 첫 장이 대표가 됩니다. Esc로 취소. 들어 올릴 때 `window.yhHaptic('impact')`(없으면 안드로이드 짧은 진동).
- 사진 아래 12px `--color-fg-tertiary` 안내 "사진을 꾹 누른 채 옮기면 순서를 바꿀 수 있어요."는 사진이 2장 이상일 때만 보입니다.
- 대표 사진 없이 다음을 누르면 첫 칸이 1.5px `--color-border-error`가 되고 아래에 "대표 사진을 1장 올려 주세요."가 나옵니다. 사진을 올리면 바로 풀립니다.
- 안내 문구는 제목 아래 한 곳에만 둡니다.

### Story · 자기소개

자기소개 화면(3 / 5)입니다. 코드는 `public/story.js`(기존 `renderQuestions`를 대체), 모양은 `nov08.css`의 Story 블록, 값은 `tokens.css`의 `--story-*`. 메인은 노트 한 장, 질문 고르기는 카드 덱이에요.

**규칙:** 기본 소개 1개와 고른 질문 2개, 각각 20자 이상(`validAnswer`)이면 다음으로 넘어갑니다. 고른 질문은 최대 5개.

**메인 · 노트 한 장**
- 제목 "당신을 알아가는 작은 이야기", 아래 한 줄 "이야기 N / 3장 · 한 장만 더 담으면 돼요"처럼 남은 장 수.
- 이야기는 노트 한 장(`.st-note`) 안에 적혀요. 흰 종이에 줄 간격 `--story-line`(28) 줄(`--story-note-rule`, Sky 100 55%), 왼쪽 여백선 `--story-note-margin`(Rose 200 70%), 그림자 `--story-note-shadow`, 모서리 4 / 14. 구멍 점은 두지 않아요.
- 모든 것이 28 격자에 앉아요. 노트 위아래 여백 28, 테이프 라벨 20 + 위아래 4, 질문·답 줄 28, 쓰는 중 칩 24 + 위아래 2, 항목 사이 한 줄(28), 빈 칸 두 줄(56). 그래서 글자가 항상 줄 위에 놓여요.
- 항목마다 마스킹 테이프 라벨(높이 20, 11px 600, 살짝 기울임)이 붙어요. 기본 소개는 하늘(`--story-tape-1`), 이야기 1·2는 로즈·골드, 더 담은 이야기는 세이지부터 돌아가며. 그 아래 질문(고운바탕 16, 줄 28)과 답(13px, 두 줄).
- 1–19자는 `쓰는 중 · N자` 칩(`--story-draft-*`), 비어 있으면 "눌러서 첫 줄을 적어 보세요."
- 자기소개 칩(쓰는 중, 고른 질문)은 높이 24: 위아래 4 · 좌우 8, 11px 600 줄 16, 모서리 12.
- 빈 자리는 흰 바탕 점선 칸(두 줄 56, `--story-slot-line`) "이야기 N · 질문 붙이기". 흰 바탕이 노트 줄을 가려요. 기본 소개 전이나 앞 칸이 빈 동안은 회색 점선(`--story-lock-line`)으로 이유를 적고, 누르면 알림으로도 알려요.
- 이 이야기 담기로 새로 채운 항목만 520ms로 살짝 떠오르며 붙어요(테이프 붙는 느낌).
- 세 장이 다 차면 노트 아래 "질문 하나 더 붙이기 · 선택".
- 아래 버튼 위에 남은 장 수 안내 한 줄. 스크롤 영역은 아래 영역 높이를 재서 그 위 8px에서 끝납니다.

**질문 카드 덱 시트**
- 높이 `--story-sheet-h`(440, 화면의 82%까지)로 고정해서 주제를 바꿔도 높이가 그대로예요.
- 제목(고운바탕 20) "어떤 이야기를 들려줄까요?" + Close Button, 테두리 주제 칩 6개(고른 칩은 `--color-bg-inverse`로 채움).
- 질문 카드 `--story-card-w` × `--story-card-h`(196 × 220)를 옆으로 넘겨요(스냅). 카드 색은 하늘·로즈·골드 50 순서, 질문 고운바탕 17, 예시 세 줄, "이 질문으로 쓰기"(Figma `pencil`). 이미 고른 질문은 `고른 질문` 칩과 함께 꺼짐. 아래 점은 지금 보이는 카드를 따라가요.
- 올라옴 300ms · 내려감 240ms(사진 관리 시트와 같음), 바깥·Esc로 닫힘. 고르면 바로 쓰기로 넘어가요.

**쓰기** (보이는 글 덩어리 6개: 라벨 · 질문 · 거점 숫자 · 응원 한 줄 · 예시 칩 · 담기)
- 같은 화면에서 내용만 바뀌고, 위 뒤로 버튼은 메인으로 돌아갑니다(쓴 글은 그대로 남음).
- 라벨, 질문(고운바탕 21, 따옴표), 고른 질문이면 질문 오른쪽에 바꾸기 버튼(Figma `repeat` 18, Close Button과 같은 32 회색 원 · 누르는 영역 44를 오른쪽 여백선에 맞춤, 같은 주제로 시트가 열림).
- 도움말은 따로 쓰지 않고 쓰는 칸의 안내 글(placeholder)로 넣어요. 쓰기 시작하면 사라지고, 화면 읽기에는 `aria-describedby`로 계속 읽혀요.
- 줄 노트(줄 간격 32, 선 `--story-rule`), 연필 빗금 게이지(끝 200자), 거점은 숫자만(20 · 80 · 150 · 200). 20은 빨간 테두리 점(최소), 80은 하늘 테두리 점(권장).
- 응원은 한 줄: 0자 "첫 줄을 편하게 적어 보세요" / 1–19자 "20자까지 N자 남았어요"(`--story-warn`, 쓰는 칸 테두리와 빗금도 `--story-warn-line`) / 20–79자 "이제 담을 수 있어요" / 80–149자 "권장 길이를 채웠어요" / 150–199자 "길게 쓴 소개일수록 대화가 더 잘 이어져요" / 200자+ "꾹꾹 담은 이야기, 이제 만나러 가볼까요". 오른쪽에 글자 수.
- 거점을 지나면 점이 `--story-mark-on`으로 채워지며 톡 튀고, 알림 한 줄과 `window.yhHaptic('selection')`.
- "예시 보기" 칩(Figma `pencil` 14, 높이 28, 뉴트럴 `--story-ex-chip-bg` Cool Neutral 100 · 글 `--story-ex-chip-fg`)을 누르면 예시 상자(`--story-ex-bg` Cool Neutral 50)가 펼쳐져요.
- 예시 상자 전체가 복사 버튼이에요(`role="button"`, Enter·Space로도 복사). 아래 작은 안내 "눌러서 복사"(Figma `copy` 14, 11px). 누르는 동안 상자가 `--story-ex-press`로 한 단계 진해지고, 복사되면 1.6초 동안 안내가 "복사됨"(Figma `copy-check`, 하늘)으로 바뀌고 알림 "예시를 복사했어요". 클립보드를 쓸 수 없으면 글을 선택해 복사하고, 그것도 안 되면 "예시를 길게 눌러 복사해 주세요".
- 아래는 "이 이야기 담기" 하나(20자 미만이면 꺼짐). 쓰는 동안 시연 안내 문구는 숨겨요. 담으면 메인으로 돌아가 알림 "이야기 한 장을 담았어요 · N / 3"과 `yhHaptic('success')`.
- 저장은 `window.yhPersist()`(features.js의 `persist`).

**시연 도구:** 자기소개 화면에서만 "이야기 채운 정도" 버튼이 보여요. 비우기 · 쓰는 중(기본 소개 12자) · 1장 · 2장 · 3장 · 가득(처음 시연 상태, `story.js`의 `DEMO`). 누르면 바로 저장돼요.

### Close Button

선택창 같은 시트의 제목 오른쪽 닫기 버튼입니다. 코드는 `nov08.css`의 Close Button 블록이고, 지금은 선택창(`.choice-close`)에 적용돼 있습니다.

- 누르는 영역 44, 오른쪽 여백선(20)에 맞춥니다. 눈에 보이는 원은 가운데 `--close-size`(32)라서 여백선에서 6 안쪽에 보입니다.
- 원은 `--close-bg`(`--color-bg-muted`, Cool Neutral 100), 안의 Figma `Line/Shape/close` `--close-icon`(20)은 `--close-fg`(`--color-fg-secondary`). 글자 기호 ×는 쓰지 않습니다.
- 누르면 원이 `--close-bg-press`(`--color-bg-control`)로 진해지고 94%로 살짝 들어갑니다(120ms). 키보드 포커스는 원 둘레에 2px `--color-border-focus` 링.
- 제목 줄과 세로 가운데를 맞춥니다.

### Photo Sheet

사진 칸의 더보기를 누르면 아래에서 올라오는 사진 관리 시트입니다. 코드는 `features.js`의 `poPhotoMenu`, 모양은 `nov08.css`의 Photo Sheet 블록입니다.

- 휴대폰 화면 전체를 `--photo-sheet-dim`(선택창 시트와 같은 어둡기)으로 덮고, 흰 시트가 아래에서 300ms로 올라오고 240ms로 내려갑니다(선택창 시트와 같은 곡선). 움직임 줄이기 설정이면 흐려지기만 합니다.
- 위쪽 손잡이 36×4. 머리에 고른 사진 썸네일 `--photo-sheet-thumb-w`×`--photo-sheet-thumb-h`(42×56, 모서리 8)와 제목("대표 사진" 또는 "N번째 사진"), 사진이 2장 이상이면 "사진을 꾹 눌러 옮길 수도 있어요."
- 항목은 높이 `--photo-sheet-row`(52), 왼쪽에 Figma 아이콘 24(`--color-fg-secondary`), 글자 15px 500. 순서: 대표 사진으로 설정(`star`) · 앞으로 옮기기(`chevron-left`) · 뒤로 옮기기(`chevron-right`) · 다른 사진으로 바꾸기(`image`) · 구분선 · 사진 삭제(`trash`, `--color-fg-danger`).
- 할 수 없는 항목은 흐리게 두지 않고 뺍니다. 첫 사진에는 대표 설정과 앞으로가 없고, 마지막 사진에는 뒤로가 없습니다.
- 닫기 버튼은 두지 않습니다. 어두운 바깥을 누르거나 Esc로 닫고, 포커스는 시트 안에서만 돕니다. 닫히면 옮겨진 사진의 더보기 버튼으로 포커스가 돌아갑니다.
- 다른 사진으로 바꾸기는 그 칸의 사진 고르기를 바로 엽니다.
- 삭제는 시트 안에서 한 번 더 묻습니다. 제목 "이 사진을 삭제할까요?", 설명은 대표 사진이면 "대표 사진을 지우면 다음 사진이 대표가 돼요.", 다른 사진이면 "삭제한 사진은 다시 올려야 해요.". 아래에 취소(`--color-bg-muted`)와 삭제(`--color-bg-danger`, 흰 글씨) 버튼 52.
- 동작이 끝나면 알림 한 줄을 띄웁니다: 대표 사진으로 바꿨어요 · 앞으로 옮겼어요 · 뒤로 옮겼어요 · 사진을 삭제했어요.

### 화살표 아이콘

화살표와 꺾쇠는 글자 기호(→ › ⌄ ↗)를 쓰지 않고 Figma `Line/Arrow` 아이콘만 씁니다. 토큰은 `--ic-*`, 사용은 `<i class="ic ic-chevron-right" aria-hidden="true"></i>`이고 코드는 `nov08.css`의 Icon 블록입니다. 색은 글자색을 따르고 기본 크기는 20, 문장 안에서는 `ic-inline`(글자의 1.25배)입니다.

| 쓰임새 | 아이콘 |
|---|---|
| 뒤로가기 | `chevron-left-large` |
| 버튼 속 다음, 오른쪽 꺾쇠 | `chevron-right` |
| 선택창 | `chevron-down` |
| 펼치기 (펼치면 90도 회전) | `chevron-right` |
| 지역 선택 뒤로 | `chevron-left` |
| 바깥으로 나가기 | `arrow-up-right-small` |
| 편지 보내기 | `arrow-up` |
| 문장 속 화살표 | `arrow-right-small` |

### Back

앱의 모든 뒤로가기는 Figma `Line/Arrow/chevron-left-large`(24)를 씁니다. 누르는 영역 44, 선 2, `--color-fg-primary`입니다. 누르는 영역의 왼쪽 끝을 화면 여백 20에 맞추고, 꺾쇠는 그 안에서 세로 가운데에 두고, 가로는 보이는 모양의 가운데에서 왼쪽으로 8px 시각 보정합니다. 터치영역은 움직이지 않습니다. 화면 위에서 터치영역까지는 24입니다. 코드는 `nov08.css`의 뒤로가기 블록입니다.

### Chevron

`Line/Arrow/chevron-left`, `chevron-right`를 앱에 넣어 씁니다. 코드는 `features.js`의 `chev(방향, 크기)`와 `nov08.css`의 `.chev`입니다.

| 크기 | 클래스 | 쓰임 |
|---|---|---|
| 24 | `.chev-lg` | 사진·카드 넘김 버튼 |
| 20 | `.chev-md` | 목록 줄 끝 |
| 16 | `.chev-sm` | 글자 옆 |

색은 `currentColor`라 놓인 자리의 글자색을 따릅니다. `‹` `›` 문자는 새로 쓰지 않습니다.
