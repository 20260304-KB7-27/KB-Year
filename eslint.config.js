import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals'; // 💡 1. globals 패키지 임포트 추가

export default [
  // 1. 기본 JS 추천 설정 적용
  js.configs.recommended,
  // 2. Vue 추천 설정 적용 (Flat Config 방식)
  ...vue.configs['flat/recommended'],
  {
    languageOptions: {
      // TS 파서를 제거하고 기본 ECMA 파서를 사용하도록 설정
      ecmaVersion: 'latest',
      sourceType: 'module',
      // 💡 2. 브라우저 및 Node.js 전역 변수(console, localStorage 등) 인식 추가
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      prettier,
    },
    rules: {
      // --- 1. Prettier 설정 ---
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
          singleAttributePerLine: true,
          printWidth: 100,
        },
      ],

      // --- 2. ESLint 논리 규칙 ---
      'vue/multi-word-component-names': 'off',
      'no-unused-vars': 'warn', // 기본 JS 미사용 변수 경고 (error에서 warn으로 표시됨)
      'vue/no-unused-vars': 'error',

      // --- 3. Prettier 충돌 방지 ---
      // 레이아웃과 서식은 Prettier가 담당하므로 ESLint 규칙은 비활성화합니다.
      'vue/html-indent': 'off',
      'vue/html-closing-bracket-newline': 'off',
      'vue/first-attribute-linebreak': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/multiline-html-element-content-newline': 'off',
      'vue/html-self-closing': 'off',
    },
  },
];
