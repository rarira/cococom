import NotionRenderer from '@/components/notion-renderer';
import { getPage } from '@/libs/notion';

export default async function TermsScreen() {
  const recordMap = await getPage('16f0d19bedcf80e8bf81ffa8588b38f7');

  return <NotionRenderer recordMap={recordMap} fullPage={false} />;
}
