// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import { createClient } from 'jsr:@supabase/supabase-js@2';

console.log('Hello from Functions!');

interface History {
  added_discount_count: number;
  created_at: string;
  id: number;
  is_online: boolean;
  new_item_count: number;
  no_images: string[];
  no_price: string[];
}

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  record: History;
  schema: 'public';
  old_record: null | History;
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

Deno.serve(async req => {
  const payload: WebhookPayload = await req.json();
  const { data } = await supabase
    .from('profiles')
    .select('expo_push_token')
    .not('expo_push_token', 'is', null);

  const promises: Promise<void>[] = [];

  if (data?.length === 0) {
    return new Response('No push tokens found', {
      status: 400,
    });
  }

  data.forEach(async (profile: { expo_push_token: string }) => {
    promises.push(
      fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Deno.env.get('EXPO_ACCESS_TOKEN')}`,
        },
        body: JSON.stringify({
          to: profile.expo_push_token,
          sound: 'default',
          body: `${payload.record.is_online ? '온라인' : '오프라인'} 할인 정보가 새로 업데이트 되었습니다. 추가된 할인: ${payload.record.added_discount_count}, 새로운 상품: ${payload.record.new_item_count}`,
        }),
      }).then(res => res.json()),
    );
  });

  await Promise.allSettled(promises);

  return new Response(JSON.stringify(res), {
    headers: { 'Content-Type': 'application/json' },
  });
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
