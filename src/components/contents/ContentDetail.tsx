import React, { useState } from 'react';

interface ContentDetailProps {
  title: string;
  chip: string;
  thumbnail: string;
  content: string;
  createdAt: string;
}

export const ContentDetail: React.FC<ContentDetailProps> = ({
  title, chip, thumbnail, content, createdAt
}) => {
  const [like, setLike] = useState(0);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('링크가 복사되었습니다!');
  };

  return (
    <div className="content-detail">
      <img src={thumbnail} alt={title} className="detail-thumbnail" />
      <div className="chip">{chip}</div>
      <h2>{title}</h2>
      <div className="date">{createdAt}</div>
      <div className="content">{content}</div>
      <div className="actions">
        <button onClick={() => setLike(like + 1)}>♥ {like}</button>
        <button onClick={handleShare}>공유</button>
      </div>
    </div>
  );
}; 