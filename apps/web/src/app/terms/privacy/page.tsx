import NotionRenderer from '@/components/notion-renderer';
import { getPage } from '@/libs/notion';

export default async function PrivacyScreen() {
  const recordMap = await getPage('16d0d19bedcf80d380f0d27825755574');

  return <NotionRenderer recordMap={recordMap} fullPage={false} />;
}
