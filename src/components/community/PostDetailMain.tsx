import React, { useState } from 'react';
import styled from 'styled-components';
import axiosInstance from '../../api/axios';
import ConfirmationModal from '../common/ConfirmationModal';

interface PostAuthor {
  nickname: string;
}
interface Post {
  id: string;
  title: string;
  content: string;
  author: PostAuthor;
  createdAt: string;
  tags?: string[];
  viewCount?: number;
  category: { name: string };
}

interface PostDetailMainProps {
  post: Post;
  user: any;
  onEdit: () => void;
  onDelete: () => void;
}

const PostHeader = styled.div`
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e9ecef;
`;
const CategoryTag = styled.span`
  font-size: 0.8rem;
  font-weight: 500;
  padding: 0.18rem 0.6rem;
  background:rgb(255, 230, 243);
  color: #ff69b4;
  border-radius: 0.25rem;
  margin-right: 0.5rem;
`;
const PostTitle = styled.h1`
  font-size: 1.2rem;
  font-weight: 600;
  color: #212529;
  margin:0.5rem 0.5rem 0.5rem 0;
`;
const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.8rem;
  color: #868e96;
`;
const AuthorName = styled.span`
  font-weight: 400;
`;
const PostMeta = styled.span`
  font-size: 0.8rem;
  color: #adb5bd;
`;
const PostContent = styled.div`
  padding: 2rem 0;
  font-size: 1.1rem;
  line-height: 1.7;
  color: #343a40;
  h1, h2, h3, h4, h5, h6 {
    margin-top: 1.5rem;
    margin-bottom: 1rem;
    font-weight: 600;
  }
  p {
    margin-bottom: 1rem;
  }
  img {
    max-width: 100%;
    height: auto;
    border-radius: 0.25rem;
  }
`;
const TagBadge = styled.span`
  display: inline-block;
  background:rgb(243, 243, 243);
  color:rgb(63, 63, 63);
  font-size: 0.85rem;
  font-weight: 500;
  border-radius: 0.75rem;
  padding: 0.15rem 0.7rem;
  margin-right: 0.3rem;
  margin-top: 0.3rem;
`;
const ViewCount = styled.span`
  color: #868e96;
  font-size: 0.8rem;
  margin-left: 0.5rem;
`;

const ReportButton = styled.button`
  background: #ffb347;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.4rem 1.2rem;
  font-weight: 600;
  cursor: pointer;
`;

const REPORT_REASONS = [
  '욕설/비방',
  '음란/선정성',
  '광고/홍보',
  '도배/스팸',
  '기타',
];

const PostDetailMain: React.FC<PostDetailMainProps> = ({ post, user, onEdit, onDelete }) => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('욕설/비방');
  const [etcReason, setEtcReason] = useState('');
  const [isReporting, setIsReporting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [reportError, setReportError] = useState('');

  const isOwnPost = user && post && (user.id === (post as any).authorId);

  const handleReport = async () => {
    setIsReporting(true);
    setReportError('');
    try {
      await axiosInstance.post('/community/complaint', {
        postId: post.id,
        reason: reportReason,
        etcReason: reportReason === '기타' ? etcReason : undefined,
      });
      setReportSuccess(true);
    } catch (err: any) {
      setReportError('신고 처리 중 오류가 발생했습니다.');
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <PostHeader>
      {post.category && <CategoryTag>{post.category.name}</CategoryTag>}
      <PostTitle>{post.title}</PostTitle>
      {post.tags && post.tags.length > 0 && (
        <div style={{ margin: '0.5rem 0' }}>
          {post.tags.map((tag, idx) => (
            <TagBadge key={idx}>#{tag}</TagBadge>
          ))}
        </div>
      )}
      <AuthorInfo>
        <AuthorName>{post.author.nickname}</AuthorName>
        <PostMeta>{new Date(post.createdAt).toLocaleString()}</PostMeta>
        {typeof post.viewCount === 'number' && (
          <ViewCount>조회수 {post.viewCount}</ViewCount>
        )}
      </AuthorInfo>
      {/* 본인 글일 때만 수정/삭제 버튼 노출 */}
      {isOwnPost && (
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          <button onClick={onEdit} style={{ background: '#785cd2', color: '#ffffff', border: 'none', borderRadius: '0.5rem', padding: '0.4rem 1.2rem', fontWeight: 600, cursor: 'pointer' }}>수정</button>
          <button onClick={onDelete} style={{ background: '#ff69b4', color: '#ffffff', border: 'none', borderRadius: '0.5rem', padding: '0.4rem 1.2rem', fontWeight: 600, cursor: 'pointer' }}>삭제</button>
        </div>
      )}
      {/* 본인 글이 아닐 때만 신고 버튼 노출 */}
      {!isOwnPost && (
        <div style={{ marginTop: '1rem' }}>
          <ReportButton onClick={() => setShowReportModal(true)}>신고</ReportButton>
        </div>
      )}
      <PostContent dangerouslySetInnerHTML={{ __html: post.content }} />

      {/* 신고 모달 */}
      {showReportModal && (
        <ConfirmationModal
          isOpen={showReportModal}
          onRequestClose={() => {
            setShowReportModal(false);
            setReportSuccess(false);
            setReportReason('욕설/비방');
            setEtcReason('');
            setReportError('');
          }}
          onConfirm={() => {
            if (reportSuccess) {
              setShowReportModal(false);
              setReportSuccess(false);
              setReportReason('욕설/비방');
              setEtcReason('');
              setReportError('');
            } else {
              handleReport();
            }
          }}
          title="게시글 신고"
          confirmButtonText={reportSuccess ? '닫기' : (isReporting ? '신고 중...' : '신고하기')}
          cancelButtonText="취소"
          showCancelButton={!reportSuccess}
        >
          {reportSuccess ? (
            <div style={{ color: '#28a745', fontSize: '1rem', margin: '1.5rem 0' }}>신고가 정상적으로 접수되었습니다.</div>
          ) : (
            <>
              <div style={{ marginBottom: '1.2rem', textAlign: 'left' }}>
                {REPORT_REASONS.map((reason) => (
                  <label key={reason} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <input
                      type="radio"
                      name="report-reason"
                      value={reason}
                      checked={reportReason === reason}
                      onChange={() => setReportReason(reason)}
                      disabled={isReporting}
                    />
                    {reason}
                  </label>
                ))}
                {reportReason === '기타' && (
                  <input
                    type="text"
                    placeholder="신고 사유를 입력하세요"
                    value={etcReason}
                    onChange={e => setEtcReason(e.target.value)}
                    style={{ marginTop: 8, padding: 6, borderRadius: 4, border: '1px solid #ddd', width: '100%' }}
                    disabled={isReporting}
                  />
                )}
              </div>
              {reportError && <div style={{ color: '#dc3545', marginBottom: 8 }}>{reportError}</div>}
            </>
          )}
        </ConfirmationModal>
      )}
    </PostHeader>
  );
};

export default PostDetailMain; 