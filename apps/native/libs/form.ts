import { z } from 'zod';

const PASSWORD_VALIDATION_REGEX = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
);

export const signInFormSchema = z.object({
  email: z.string().email({
    message: '이메일 주소 형식을 확인해주세요',
  }),
  password: z
    .string()
    .min(8, { message: '비밀번호는 최소 8자 이상으로 입력하세요' })
    .max(20, {
      message: '비밀번호는 최대 20자까지 입력 가능합니다',
    })
    .regex(PASSWORD_VALIDATION_REGEX, {
      message: '비밀번호는 영문 대소문자, 숫자, 특수문자를 각각 1자 이상 포함해야 합니다',
    }),
});
