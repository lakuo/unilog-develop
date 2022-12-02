import React from 'react';
import { getLogReportURL } from 'utils/logReport';

interface ResultLinkProps {
  name: string;
}
export default function ResultLink({ name }: ResultLinkProps) {
  const url = getLogReportURL() + '/static/js/pdffile/' + name;

  return (
    <div style={{ marginRight: '20px' }}>
      <a href={url} target="_blank" rel="noopener noreferrer">
        {name.slice(((name.lastIndexOf('.') - 1) >>> 0) + 2).toUpperCase()}
      </a>
    </div>
  );
}
