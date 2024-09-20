import { Configuration, OpenAIApi } from 'openai';

// OpenAI API 설정
const configuration = new Configuration({
  apiKey: 'YOUR_API_KEY', // 여기에 OpenAI API 키 입력
});

const openai = new OpenAIApi(configuration);

// 상품 URL
const url = '/HealthSupplement/Nutrione-BB-Lab-The-Collagen-1500-2g-x-90ct-x-320/p/757633';

// 카테고리 목록
const categories = [
  { id: 1, name: '디지털/가전' },
  { id: 2, name: '가구/홈' },
  { id: 3, name: '자동차' },
  { id: 4, name: '스포츠/레저' },
  { id: 5, name: '의류/잡화' },
  { id: 6, name: '침구/패브릭' },
  { id: 7, name: '생활용품' },
  { id: 8, name: '세제/청소용품' },
  { id: 9, name: '주방' },
  { id: 10, name: '문구/사무용품' },
  { id: 11, name: '아동' },
  { id: 12, name: '미용' },
  { id: 13, name: '건강' },
  { id: 14, name: '반려동물' },
  { id: 15, name: '액세서리' },
  { id: 16, name: '럭셔리' },
  { id: 17, name: '패션잡화' },
  { id: 20, name: '냉장/냉동' },
  { id: 21, name: '육류' },
  { id: 22, name: '해산물' },
  { id: 23, name: '농산물' },
  { id: 24, name: '빵' },
  { id: 25, name: '과자/간식' },
  { id: 26, name: '커피/차' },
  { id: 27, name: '주류' },
  { id: 28, name: '음료' },
  { id: 29, name: '가공식품' },
  { id: 30, name: '즉석식품' },
  { id: 31, name: '소스/양념' },
  { id: 32, name: '식재료' },
  { id: 33, name: '과일' },
];

// ChatGPT API에 보낼 프롬프트 작성
const prompt = `
Given the URL "${url}", which of the following categories best fits the product? The categories are:
${JSON.stringify(categories)}.
Return only the category name.
`;

// ChatGPT API 호출 함수
async function classifyProduct() {
  try {
    const response = await openai.createCompletion({
      model: 'gpt-4', // GPT-4 모델 사용
      prompt: prompt,
      max_tokens: 50,
      temperature: 0,
    });

    const category = response.data.choices[0].text?.trim();
    console.log(`The product belongs to the category: ${category}`);
  } catch (error) {
    console.error('Error:', error);
  }
}

// 함수 호출
classifyProduct();
