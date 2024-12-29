import DownloadButtons from '@/components/download-buttons';

export default function DownloadScreen() {
  return (
    <div className="flex flex-col w-full items-center justify-between p-8 sm:p-20 ">
      <DownloadButtons col />
    </div>
  );
}
