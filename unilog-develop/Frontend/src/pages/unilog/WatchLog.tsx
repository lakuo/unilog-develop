import React from 'react';

import PageLayout from 'layouts/PageLayout';
import FileMonitor from 'components/Entry/FileMonitor';

export default function WatchLog() {
  return (
    <PageLayout title="檔案監控">
      <FileMonitor />
    </PageLayout>
  );
}
