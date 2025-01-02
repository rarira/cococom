'use client';
import { memo } from 'react';
import { NotionRenderer as _NotionRenderer } from 'react-notion-x';
import Link from 'next/link';

interface NotionRendererProps {
  recordMap: any;
  fullPage?: boolean;
  darkMode?: boolean;
}

const NotionRenderer = memo(function NotionRenderer({
  recordMap,
  fullPage = true,
  darkMode = true,
}: NotionRendererProps) {
  return (
    <_NotionRenderer
      recordMap={recordMap}
      fullPage={fullPage}
      darkMode={darkMode}
      components={{ nextLink: Link }}
      bodyClassName="!w-full !px-0"
      pageTitle=""
      pageHeader=""
    />
  );
});

export default NotionRenderer;
