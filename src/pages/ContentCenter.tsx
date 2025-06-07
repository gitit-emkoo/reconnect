import React, { useState } from 'react';
import { mockContents } from '../mocks/mockContents';
import { ContentList } from '../components/contents/ContentList';
import { ContentDetail } from '../components/contents/ContentDetail';
import '../components/contents/ContentCard.css';
import '../components/contents/ContentDetail.css';

interface Content {
  id: string;
  [key: string]: any;
}

const ContentCenter: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = mockContents.find((c: Content) => c.id === selectedId);

  return (
    <div>
      {!selected ? (
        <ContentList onCardClick={setSelectedId} />
      ) : (
        <div>
          <button style={{ margin: '24px 0 0 24px' }} onClick={() => setSelectedId(null)}>
            ← 목록으로
          </button>
          <ContentDetail {...selected} />
        </div>
      )}
    </div>
  );
};

export default ContentCenter;