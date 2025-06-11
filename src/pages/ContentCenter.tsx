import React, { useState } from 'react';
import { mockContents } from '../mocks/mockContents';
import { ContentList } from '../components/contents/ContentList';
import { ContentDetail } from '../components/contents/ContentDetail';
import '../components/contents/ContentCard.css';
import '../components/contents/ContentDetail.css';
import NavigationBar from '../components/NavigationBar';
import Header from '../components/common/Header';

interface Content {
  id: string;
  [key: string]: any;
}

const ContentCenter: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = mockContents.find((c: Content) => c.id === selectedId);

  return (
    <div>
      <Header title="콘텐츠" />
      {!selected ? (
        <ContentList onCardClick={setSelectedId} contents={mockContents} />
      ) : (
        <div>
          <button style={{ margin: '24px 0 0 24px' }} onClick={() => setSelectedId(null)}>
            ← 목록으로
          </button>
          <ContentDetail {...selected} />
        </div>
      )}
      <NavigationBar />
    </div>
  );
};

export default ContentCenter;