// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { gzip } from 'https://deno.land/x/compress@v0.3.8/mod.ts';

console.log('Run push edge functions!');

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

const ReceiverChunkSize = 100;

Deno.serve(async req => {
  const payload: WebhookPayload = await req.json();

  if (payload.record.new_item_count === null && payload.record.added_discount_count === null) {
    console.log(
      `no need to send push because no new items or discounts: ${JSON.stringify(payload.record)} `,
    );
    return new Response(`no need to  invoke function`, {
      status: 400,
    });
  }

  const { data } = await supabase
    .from('profiles')
    .select('expo_push_token')
    .not('expo_push_token', 'is', null);

  if (data?.length === 0) {
    return new Response('No push tokens found', {
      status: 400,
    });
  }

  const receiverChunks: { expo_push_token: string }[][] = [];

  for (let i = 0; i < data.length; i += ReceiverChunkSize) {
    receiverChunks.push(data.slice(i, i + ReceiverChunkSize));
  }

  console.log(`will send push to ${data.length} devices in ${receiverChunks.length} chunks`);

  const promises = receiverChunks.map(chunk => {
    const message = {
      to: chunk.map(receiver => receiver.expo_push_token),
      _contentAvailable: true, // for ios background push
      sound: 'default',
      data: {
        id: payload.record.id,
        isOnline: payload.record.is_online,
        newDiscount: payload.record.added_discount_count,
        newItem: payload.record.new_item_count,
      },
      // body: `${payload.record.is_online ? '온라인' : '오프라인'} 할인 정보가 새로 업데이트 되었습니다. 추가된 할인: ${payload.record.added_discount_count}, 새로운 상품: ${payload.record.new_item_count}`, // must be removed for background push
    };

    const compressedMessages = gzip(new TextEncoder().encode(JSON.stringify(message)));

    return fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Encoding': 'gzip',
        Authorization: `Bearer ${Deno.env.get('EXPO_ACCESS_TOKEN')}`,
      },
      body: compressedMessages,
    }).then(res => res.json());
  });

  const result = await Promise.allSettled(promises);

  const failed = result.filter(r => r.status === 'rejected');
  const success = result.filter(r => r.status === 'fulfilled');

  const finalResult = {
    success: success.length,
    failed: failed.length,
    failedDetails: failed.map(f => f.reason),
    totalDevicesToSend: data.length,
  };

  console.log('finalResult', finalResult);

  return new Response(JSON.stringify(finalResult), {
    headers: { 'Content-Type': 'application/json' },
  });
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
