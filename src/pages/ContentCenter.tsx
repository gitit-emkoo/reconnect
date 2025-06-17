import React, { useState } from 'react';
import { mockContents } from '../mocks/mockContents';
import { ContentList } from '../components/contents/ContentList';
import { ContentDetail } from '../components/contents/ContentDetail';
import '../components/contents/ContentCard.css';
import NavigationBar from '../components/NavigationBar';
import Header from '../components/common/Header';
import MobileOnlyBanner from '../components/common/MobileOnlyBanner';

interface Content {
  id: string;
  [key: string]: any;
}

const ContentCenter: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = mockContents.find((c: Content) => c.id === selectedId);

  return (
    <div>
      <MobileOnlyBanner />
      <Header title="관계 가이드" />
      {!selected ? (
        <ContentList onCardClick={setSelectedId} contents={mockContents} />
      ) : (
        <div>
          <ContentDetail {...selected} onBack={() => setSelectedId(null)} />
        </div>
      )}
      <NavigationBar />
    </div>
  );
};

export default ContentCenter;