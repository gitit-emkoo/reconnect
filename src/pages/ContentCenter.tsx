import React, { useState, useEffect } from 'react';
import { ContentList } from '../components/contents/ContentList';
import { ContentDetail } from '../components/contents/ContentDetail';
import '../components/contents/ContentCard.css';
import NavigationBar from '../components/NavigationBar';
import Header from '../components/common/Header';
import MobileOnlyBanner from '../components/common/MobileOnlyBanner';
import { fetchContents } from '../api/content';
import { Content } from '../types/content';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorModal from '../components/common/ErrorModal';

const ContentCenter: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getContents = async () => {
      try {
        setLoading(true);
        const data = await fetchContents();
        setContents(data);
      } catch (err) {
        setError('콘텐츠를 불러오는 데 실패했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getContents();
  }, []);

  const selected = contents.find((c: Content) => c.id === selectedId);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <MobileOnlyBanner />
      <Header title="관계 가이드" />
      {error && <ErrorModal open={!!error} message={error} onClose={() => setError(null)} />}
      {!selected ? (
        <ContentList onCardClick={setSelectedId} contents={contents} />
      ) : (
        <div>
          <ContentDetail
            id={selected.id}
            onBack={() => setSelectedId(null)}
          />
        </div>
      )}
      <NavigationBar />
    </div>
  );
};

export default ContentCenter;