# 인증번호 완료 모션 · OtpSuccess

6자리 인증번호 확인이 성공했을 때 바로 다음 화면으로 넘기지 말고, 이 모션을 한 번 보여 준 뒤 넘겨 주세요. 시연본(`public/otp.js`의 `playSuccess`)과 같은 순서 · 시간 · 곡선이에요.

## 모션

| 순서 | 무엇 | 시간 | 곡선 |
|---|---|---|---|
| 1 | 칸 안 숫자가 작아지며 사라짐 (1 → 0.8) | 80ms | out `(0.23, 1, 0.32, 1)` |
| 2 | 칸 여섯 개가 가운데로 모임 | 360ms | in-out `(0.77, 0, 0.175, 1)` |
| 3 | 모인 칸이 동그라미 56으로 바뀜 (sky-100 → sky-600) | 300ms | out |
| 4 | 흰 체크가 그려짐 (3이 끝나기 30ms 전 시작) | 510ms | out |
| 5 | 아래 12에 "인증되었어요"가 8 아래에서 떠오름 (4가 끝나기 280ms 전 시작) | 320ms | out |
| 6 | 0.9초 머문 뒤 `onFinish()` → 다음 화면 | 900ms | |

전체 약 2.2초예요. 기기에서 "동작 줄이기"가 켜져 있으면 칸이 120ms로 사라지고, 동그라미와 체크(다 그려진 상태)가 200ms로 나타난 뒤 문구가 나오고 0.9초 뒤 넘어가요.

## 넣는 법

1. `OtpSuccess.tsx`를 컴포넌트 폴더(`OtpInput` 옆)에 복사해요. `react-native-svg`만 쓰고, 이미 앱에 있어요.
2. 인증 화면에서 확인이 성공하면 `OtpInput` 자리에 `OtpSuccess`를 그려요.

```tsx
const [verified, setVerified] = useState(false);

<OtpInput
  value={code}
  onChange={...}
  onComplete={async (value) => {
    try {
      await verifySignupCode(email, value);
      setVerified(true);            // ← 성공하면 모션 시작
    } catch (e) { /* 지금처럼 오류 문구 */ }
  }}
/>

// OtpInput 대신
{verified
  ? <OtpSuccess code={code} onFinish={() => router.replace('/약관 화면')} colors={{ fill: colors.selected, digit: colors.btnSecondaryFg }} />
  : <OtpInput ... />}
```

3. 같이 숨길 것: 모션이 도는 동안 아래 "다시 받기" 줄과 "메일 속 버튼으로 인증했어요" 링크는 숨기거나 흐리게(120ms) 해 주세요. 키보드는 컴포넌트가 알아서 내려요.

## 꼭 확인해 주세요

- **다음 화면으로 넘어가는 곳이 하나여야 해요.** 지금은 인증이 성공하면 세션이 생기면서 바로 다음 화면으로 가는 것 같아요(인증 상태 리스너 · 라우터 가드 등). 그러면 모션이 보이기 전에 화면이 바뀌어요. 인증 화면에서는 자동 이동을 막고 `onFinish`에서만 넘겨 주세요.
- 칸 모양은 지금 `OtpInput`과 같게 맞췄어요(높이 56 · 모서리 12 · 사이 8 · 숫자 24/500). 테마 색은 `colors` prop으로 넘기면 돼요. 앱에 `reduceMotion()`이 있으면 `reduceMotion={reduceMotion}`으로 넘겨 주세요.
- 웹(Expo web)과 iOS · Android에서 한 번씩 돌려 봐 주세요. 우리 쪽에서는 이 앱을 빌드해 볼 수 없어서 문법 검사까지만 했어요.

## 참고

- 시연본에서 보기: https://claude.ai/artifact/Ts6VsDxcafpvy9GsBWK9dA → 휴대폰 인증 화면에서 `123456`
- 원래 코드: 저장소 `public/otp.js` (`playSuccess`, `MOTION`), 모양 `public/nov08.css` `.otp-*`, 값 `public/tokens.css` `--otp-*`
