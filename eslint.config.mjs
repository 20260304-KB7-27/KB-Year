import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import prettier from 'eslint-plugin-prettier';
// 1. TypeScript용 ESLint 플러그인 추가
import tseslint from 'typescript-eslint';

export default [
  js.configs.recommended,
  // 2. TypeScript 추천 설정 적용
  ...tseslint.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    // 3. Vue 파일 내의 <script lang="ts">를 해석하기 위한 파서 설정
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
      },
    },
    plugins: {
      prettier,
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
          singleAttributePerLine: true,
        },
      ],
      'vue/multi-word-component-names': 'off',

      // 4. 중요: TypeScript가 이미 타입과 변수 체크를 하므로
      // 기본 JS 기반의 no-undef는 꺼야 'boolean' 에러가 사라집니다.
      'no-undef': 'off',

      // 5. 사용하지 않는 변수 체크 (TS 버전으로 대체)
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn'],
      'vue/no-unused-vars': 'error',

      'vue/first-attribute-linebreak': [
        'error',
        {
          singleline: 'beside',
          multiline: 'below',
        },
      ],
      'vue/html-closing-bracket-newline': [
        'error',
        {
          singleline: 'never',
          multiline: 'always',
        },
      ],
    },
  },
];
