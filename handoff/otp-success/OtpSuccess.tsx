/**
 * OtpSuccess — 인증번호 6자리 확인이 끝난 뒤 보여 주는 완료 모션 (React Native · Expo)
 *
 * 기준: 시연본 public/otp.js 의 playSuccess / MOTION (https://github.com/yongcha-yongcha/yahwa-ui-demo)
 * 순서: 숫자 사라짐(80) → 칸 여섯 개가 가운데로 모임(360) → 동그라미로 바뀜(300)
 *      → 체크가 그려짐(510, 동그라미 끝나기 30 전 시작) → "인증되었어요"(320, 체크 끝나기 280 전 시작)
 *      → 0.9초 머문 뒤 onFinish()
 * 동작 줄이기: 칸이 120으로 사라지고 → 동그라미 + 체크(그려진 상태)가 200으로 나타나고 → 문구가 320으로 나타남 → 0.9초 → onFinish()
 *
 * 쓰는 법: 인증 확인(verifySignupCode)이 성공하면 <OtpInput> 자리에 이 컴포넌트를 그대로 그려 주세요.
 *   {verified
 *     ? <OtpSuccess code={code} onFinish={() => 다음 화면으로} />
 *     : <OtpInput ... />}
 * 칸 모양(높이 56 · 모서리 12 · 사이 8 · 숫자 24/500)은 지금 OtpInput과 같아서, 바뀌는 순간 티가 나지 않아요.
 * 색은 colors prop으로 앱 테마 값(예: colors.selected, colors.btnSecondaryFg)을 넘겨 주세요. 기본값은 시연본 토큰이에요.
 *
 * 필요한 것: react-native, react-native-svg (이미 앱에 있어요)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Keyboard,
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);

/** 시연본 MOTION 값 그대로 (ms) */
export const OTP_MOTION = {
  digit: 80,
  gather: 360,
  morph: 300,
  check: 510,
  text: 320,
  hold: 900,
  checkLead: 30, // 동그라미가 끝나기 30ms 전에 체크 시작
  textLead: 280, // 체크가 끝나기 280ms 전에 문구 시작
};

/** 시연본 곡선 */
const OUT = Easing.bezier(0.23, 1, 0.32, 1);
const IN_OUT = Easing.bezier(0.77, 0, 0.175, 1);

/** 칸 · 동그라미 크기 (시연본 --otp-*) */
const CELL_H = 56;
const CELL_RADIUS = 12;
const GAP = 8;
const DONE_SIZE = 56;
const CHECK_SIZE = 48;
const TEXT_GAP = 12;
/** 체크 path 길이: M6 12 L10 16 L18 8 = √32 + √128 ≈ 16.97 */
const CHECK_LEN = 17;

export type OtpSuccessColors = {
  /** 숫자가 들어간 칸 바탕 (시연본 --otp-fill-bg = sky-100) */
  fill: string;
  /** 칸 숫자 색 (시연본 --otp-fill-fg = sky-700) */
  digit: string;
  /** 완료 동그라미 (시연본 --otp-done-bg = sky-600) */
  done: string;
  /** 체크 선 (흰색) */
  check: string;
  /** "인증되었어요" 글자 (시연본 --otp-done-fg = sky-700) */
  text: string;
};

const DEFAULT_COLORS: OtpSuccessColors = {
  fill: '#D6EAF8',
  digit: '#245D7E',
  done: '#377398',
  check: '#FFFFFF',
  text: '#245D7E',
};

type Props = {
  /** 방금 맞힌 6자리 */
  code: string;
  /** 모션이 다 끝난 뒤(약 2.2초) 부름 — 여기서 다음 화면으로 */
  onFinish?: () => void;
  length?: number;
  label?: string;
  colors?: Partial<OtpSuccessColors>;
  /** 앱에 reduceMotion() 함수가 있으면 넘겨 주세요. 없으면 기기 설정을 읽어요 */
  reduceMotion?: () => boolean;
  style?: StyleProp<ViewStyle>;
};

export function OtpSuccess({
  code,
  onFinish,
  length = 6,
  label = '인증되었어요',
  colors: colorsProp,
  reduceMotion,
  style,
}: Props) {
  const c = { ...DEFAULT_COLORS, ...colorsProp };
  const [width, setWidth] = useState(0);
  const [phase, setPhase] = useState<'cells' | 'done'>('cells');

  const digit = useRef(new Animated.Value(1)).current; // 1 → 0 숫자
  const cellFade = useRef(new Animated.Value(1)).current; // 동작 줄이기용
  const gather = useRef(new Animated.Value(0)).current; // 0 → 1 가운데로
  const morph = useRef(new Animated.Value(0)).current; // 0 → 1 칸 → 동그라미
  const doneFade = useRef(new Animated.Value(1)).current; // 동작 줄이기용
  const check = useRef(new Animated.Value(CHECK_LEN)).current; // dashoffset 17 → 0
  const text = useRef(new Animated.Value(0)).current; // 0 → 1 문구

  const cellW = width ? (width - GAP * (length - 1)) / length : 0;
  const offsets = useMemo(
    () => Array.from({ length }, (_, i) => width / 2 - (i * (cellW + GAP) + cellW / 2)),
    [width, cellW, length],
  );

  const finishRef = useRef(onFinish);
  finishRef.current = onFinish;

  useEffect(() => {
    if (!width) return; // 칸 너비를 잰 뒤 시작
    Keyboard.dismiss();
    let alive = true;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const after = (ms: number, fn: () => void) => timers.push(setTimeout(() => alive && fn(), ms));
    const run = (v: Animated.Value, toValue: number, duration: number, easing = OUT, native = true) =>
      Animated.timing(v, { toValue, duration, easing, useNativeDriver: native }).start();

    const play = (reduced: boolean) => {
      if (!alive) return;
      const M = OTP_MOTION;
      if (reduced) {
        run(cellFade, 0, 120, Easing.out(Easing.ease));
        after(120, () => {
          check.setValue(0);
          doneFade.setValue(0);
          morph.setValue(1);
          setPhase('done');
          run(doneFade, 1, 200, Easing.out(Easing.ease));
          run(text, 1, M.text);
          AccessibilityInfo.announceForAccessibility?.(label);
        });
        after(120 + M.text + M.hold, () => finishRef.current?.());
        return;
      }
      // 1. 숫자 사라짐
      run(digit, 0, M.digit);
      // 2. 칸이 가운데로
      after(M.digit, () => run(gather, 1, M.gather, IN_OUT));
      // 3. 동그라미로 (너비 · 모서리 · 색이라 native driver 아님)
      const tMorph = M.digit + M.gather;
      after(tMorph, () => {
        setPhase('done');
        run(morph, 1, M.morph, OUT, false);
      });
      // 4. 체크
      const tCheck = tMorph + M.morph - M.checkLead;
      after(tCheck, () => run(check, 0, M.check, OUT, false));
      // 5. 문구
      const tText = tCheck + M.check - M.textLead;
      after(tText, () => {
        run(text, 1, M.text);
        AccessibilityInfo.announceForAccessibility?.(label);
      });
      // 6. 머문 뒤 끝
      after(tText + M.text + M.hold, () => finishRef.current?.());
    };

    if (reduceMotion) play(reduceMotion());
    else AccessibilityInfo.isReduceMotionEnabled().then(play, () => play(false));

    return () => {
      alive = false;
      timers.forEach(clearTimeout);
    };
    // 한 번만 재생
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width > 0]);

  const onLayout = (e: LayoutChangeEvent) => {
    if (!width) setWidth(e.nativeEvent.layout.width);
  };

  // 칸 크기(cellW × 56, 모서리 12) → 동그라미(56 × 56, 모서리 28)
  const morphW = morph.interpolate({ inputRange: [0, 1], outputRange: [cellW || DONE_SIZE, DONE_SIZE] });
  const morphR = morph.interpolate({ inputRange: [0, 1], outputRange: [CELL_RADIUS, DONE_SIZE / 2] });
  const morphBg = morph.interpolate({ inputRange: [0, 1], outputRange: [c.fill, c.done] });

  return (
    <View
      onLayout={onLayout}
      style={[{ height: CELL_H }, style]}
      accessible
      accessibilityLabel={phase === 'done' ? label : `인증번호 ${code}`}
    >
      {phase === 'cells' && width > 0 && (
        <Animated.View style={[StyleSheet.absoluteFill, { flexDirection: 'row', gap: GAP, opacity: cellFade }]}>
          {Array.from({ length }).map((_, i) => (
            <Animated.View
              key={i}
              style={{
                width: cellW,
                height: CELL_H,
                borderRadius: CELL_RADIUS,
                backgroundColor: c.fill,
                alignItems: 'center',
                justifyContent: 'center',
                transform: [{ translateX: gather.interpolate({ inputRange: [0, 1], outputRange: [0, offsets[i]] }) }],
              }}
            >
              <Animated.Text
                style={{
                  fontSize: 24,
                  lineHeight: 30,
                  fontWeight: '500',
                  color: c.digit,
                  fontVariant: ['tabular-nums'],
                  opacity: digit,
                  transform: [{ scale: digit.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }],
                }}
              >
                {code[i]}
              </Animated.Text>
            </Animated.View>
          ))}
        </Animated.View>
      )}

      {phase === 'done' && (
        <View pointerEvents="none" style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
          <Animated.View style={{ opacity: doneFade, alignItems: 'center' }}>
            <Animated.View
              style={{
                width: morphW,
                height: DONE_SIZE,
                borderRadius: morphR,
                backgroundColor: morphBg,
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              <Svg width={CHECK_SIZE} height={CHECK_SIZE} viewBox="0 0 24 24">
                <AnimatedPath
                  d="M6 12L10 16L18 8"
                  fill="none"
                  stroke={c.check}
                  strokeWidth={1.75}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={[CHECK_LEN, CHECK_LEN]}
                  strokeDashoffset={check}
                />
              </Svg>
            </Animated.View>
          </Animated.View>
          <Animated.Text
            accessibilityLiveRegion="polite"
            style={{
              position: 'absolute',
              top: CELL_H / 2 + DONE_SIZE / 2 + TEXT_GAP,
              fontSize: 16,
              lineHeight: 24,
              fontWeight: '500',
              color: c.text,
              opacity: text,
              transform: [{ translateY: text.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }],
            }}
          >
            {label}
          </Animated.Text>
        </View>
      )}
    </View>
  );
}

export default OtpSuccess;
