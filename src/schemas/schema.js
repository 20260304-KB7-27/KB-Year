import { z } from 'zod/v4';

const MAX_AMOUNT = 1000000000000000n;

export const signUpSchema = z
  .object({
    userid: z
      .string()
      .min(4, '아이디는 최소 4자 이상이어야 합니다.')
      .max(15, '아이디는 최대 15자 이하여야 합니다.')
      .regex(/^[a-z][a-z0-9]*$/, {
        message:
          '아이디의 첫 글자는 영문 소문자여야 하며, 이후로는 영문 소문자와 숫자만 사용 가능합니다.',
      }),

    password: z
      .string()
      .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
      .regex(/[a-zA-Z]/, '영문자가 포함되어야 합니다.')
      .regex(/[0-9]/, '숫자가 포함되어야 합니다.')
      .regex(/[@$!%*?&]/, '특수문자가 포함되어야 합니다.'),

    confirmPassword: z.string().nonempty('비밀번호 확인을 입력해주세요.'),

    name: z
      .string()
      .min(2, '이름은 2자 이상이어야 합니다.')
      .regex(/^[가-힣a-zA-Z]+$/, '올바른 이름을 입력해주세요.'),

    birthDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, '날짜 형식(YYYY-MM-DD)이 올바르지 않습니다.')
      .refine(
        (val) => {
          // 1. 입력받은 날짜를 날짜 객체로 변환 (시/분/초 00:00:00으로 설정)
          const selectedDate = new Date(val);
          selectedDate.setHours(0, 0, 0, 0);

          // 2. 현재 한국 시간 기준의 "오늘" 날짜 구하기
          const now = new Date();
          const kstToday = new Date(now.getTime() + 9 * 60 * 60 * 1000);
          kstToday.setHours(0, 0, 0, 0); // 오늘 날짜의 00:00:00

          // 선택한 날짜가 오늘보다 작거나 같아야 통과
          return selectedDate <= kstToday;
        },
        {
          message: '생년월일은 오늘 이후의 날짜일 수 없습니다.',
        }
      ),

    gender: z.enum(['MALE', 'FEMALE'], {
      error: () => ({ message: '성별을 선택해주세요.' }),
    }),

    email: z
      .string()
      .min(1, { message: '이메일을 입력해주세요.' })
      // 핵심 수정 부분: 객체 형태로 전달
      .email({ message: '올바른 이메일 형식이 아닙니다.' }),
    phone: z
      .string()
      .regex(/^010-\d{3,4}-\d{4}$/, '올바른 핸드폰 번호 형식(010-0000-0000)을 입력해주세요.'),

    job: z.string().nonempty('직업을 입력해주세요.'),
  })
  .refine(
    (data) => {
      return data.password === data.confirmPassword;
    },
    {
      message: '비밀번호가 일치하지 않습니다.',
      path: ['confirmPassword'], // 에러 메시지가 표시될 필드 위치
    }
  );

export const editProfileSchema = z
  .object({
    // 1. 읽기 전용 필드 (검증은 하되 수정은 안 됨)
    userid: z.string(),
    name: z.string(),
    birthDate: z.string().refine(
      (val) => {
        // 1. 입력받은 날짜를 날짜 객체로 변환 (시/분/초 00:00:00으로 설정)
        const selectedDate = new Date(val);
        selectedDate.setHours(0, 0, 0, 0);

        // 2. 현재 한국 시간 기준의 "오늘" 날짜 구하기
        const now = new Date();
        const kstToday = new Date(now.getTime() + 9 * 60 * 60 * 1000);
        kstToday.setHours(0, 0, 0, 0); // 오늘 날짜의 00:00:00

        // 선택한 날짜가 오늘보다 작거나 같아야 통과
        return selectedDate <= kstToday;
      },
      {
        message: '생년월일은 오늘 이후의 날짜일 수 없습니다.',
      }
    ),
    gender: z.enum(['MALE', 'FEMALE']),

    // 2. 수정 가능 필드 (기존 signUpSchema 로직 유지)
    email: z.string().min(1, '이메일을 입력해주세요.').email('올바른 이메일 형식이 아닙니다.'),

    phone: z
      .string()
      .regex(/^010-\d{3,4}-\d{4}$/, '올바른 핸드폰 번호 형식(010-0000-0000)을 입력해주세요.'),

    job: z.string().nonempty('직업을 선택하거나 입력해주세요.'),

    // 3. 비밀번호 (수정 시에는 '입력하지 않음'이 허용되어야 하므로 optional 처리)
    password: z
      .string()
      // 입력을 아예 안 했거나(empty), 입력했다면 8자 이상 + 조건 충족
      .refine((val) => val === '' || val.length >= 8, {
        message: '비밀번호는 최소 8자 이상이어야 합니다.',
      })
      .refine((val) => val === '' || /[a-zA-Z]/.test(val), {
        message: '영문자가 포함되어야 합니다.',
      })
      .refine((val) => val === '' || /[0-9]/.test(val), {
        message: '숫자가 포함되어야 합니다.',
      })
      .refine((val) => val === '' || /[@$!%*?&]/.test(val), {
        message: '특수문자가 포함되어야 합니다.',
      })
      .optional(),

    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      return data.password === data.confirmPassword;
    },
    {
      message: '비밀번호가 일치하지 않습니다.',
      path: ['confirmPassword'], // 에러 메시지가 표시될 필드 위치
    }
  );

export const amountSchema = z
  .preprocess((val) => {
    // 1. 숫자가 들어온 경우 (1e20 등)
    if (typeof val === 'number') {
      // 안전한 정수 범위를 넘어가면 이미 오염된 데이터이므로
      // 맥시멈보다 큰 값을 던져서 에러를 유도합니다.
      if (!Number.isSafeInteger(val)) return MAX_AMOUNT + 1n;
      return BigInt(val);
    }

    // 2. 문자열이 들어온 경우 (정상적인 폼 입력)
    if (typeof val === 'string') {
      // 지수 표기법(e)이 포함되어 있다면 이미 정밀도 위험이 있으므로 차단
      if (val.toLowerCase().includes('e')) return MAX_AMOUNT + 1n;

      const cleaned = val.replace(/,/g, '');
      if (cleaned === '') return 0n;
      return BigInt(cleaned);
    }

    return val; // 나머지는 Zod 기본 검증에 맡김
  }, z.bigint()) // 여기서 BigInt 타입인지 1차 검증
  .refine((val) => val <= MAX_AMOUNT, {
    message: '입력 가능한 최대 금액(1,000조)을 초과했거나 올바르지 않은 형식입니다.',
  })
  .transform((val) => {
    const num = Number(val);
    if (num >= 100000000) return (num / 100000000).toFixed(1) + '억';
    if (num >= 10000) return (num / 10000).toFixed(1) + '만';
    return new Intl.NumberFormat('ko-KR').format(val) + '원';
  });
