# YAHWA UI prototype

야화 앱 UI 시연본입니다. 실제 가입, 결제, 인증, 메시지 전송 서버가 없는 시연용 프로젝트입니다.

## 내려받기

이 페이지 위쪽의 초록색 **Code** 버튼 → **Download ZIP**을 누릅니다. 받은 zip을 풀면 `yahwa-ui-demo-main` 폴더가 생깁니다.

## 실행

`index.html`을 더블클릭해서 열면 사진과 글꼴이 보이지 않습니다. 아래처럼 간단한 로컬 서버로 열어 주세요.

1. Python 3이 필요합니다. macOS에는 보통 이미 있습니다.
2. 터미널에서 압축을 푼 폴더로 이동한 뒤 실행합니다.

   ```sh
   cd yahwa-ui-demo-main
   python3 -m http.server 8080 --directory public
   ```

3. 브라우저에서 http://localhost:8080 을 엽니다.

같은 와이파이의 휴대폰에서는 `http://<이 컴퓨터의 IP>:8080` 으로 열 수 있습니다. 휴대폰 Safari에서 공유 → 홈 화면에 추가를 누르면 앱처럼 열립니다.

## 구성

- `public/index.html`: 화면과 기본 흐름
- `public/features.js`, `features-rules.js`: 확장 기능과 규칙
- `public/tokens.css`: 디자인 토큰
- `public/nov08.css`, `features.css`: 스타일
- `public/design-system.html`: 디자인 시스템 문서
- 그 밖의 이미지·글꼴: 시연 자산

시연 상태는 브라우저에 저장됩니다. 처음부터 보려면 시연 도구의 "처음부터 다시 시작"을 누르세요.

공개 저장소로 제공되더라도 포함된 사진·글꼴·브랜드 자산을 자유롭게 다시 써도 된다는 뜻은 아닙니다.
