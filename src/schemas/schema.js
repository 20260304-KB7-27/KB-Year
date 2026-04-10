import { z } from 'zod/v4';

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
      .regex(/^\d{4}-\d{2}-\d{2}$/, '날짜 형식(YYYY-MM-DD)이 올바르지 않습니다.'),

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

    job: z.string().nonempty('직업을 선택하거나 입력해주세요.'),
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
