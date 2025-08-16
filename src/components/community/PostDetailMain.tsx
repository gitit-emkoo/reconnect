import React, { useState } from 'react';
import styled from 'styled-components';
import axiosInstance from '../../api/axios';
import ConfirmationModal from '../common/ConfirmationModal';
import { blockApi } from '../../api/user';
import LoginModal from '../common/LoginModal';
import useAuthStore from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import MeatballsIcon from '../../assets/Meatballs_menu.svg?url';

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
  position: relative;
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

const ActionArea = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;

const KebabButton = styled.button`
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  cursor: pointer;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 36px;
  right: 0;
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
  padding: 6px;
  z-index: 10;
  min-width: 140px;
`;

const MenuItem = styled.button`
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  border: none;
  background: transparent;
  color: #495057;
  font-size: 0.95rem;
  border-radius: 6px;
  cursor: pointer;
  &:hover { background: #f8f9fa; }
`;

const REPORT_REASONS = [
  '욕설/비방',
  '음란/선정성',
  '광고/홍보',
  '도배/스팸',
  '기타',
];

const PostDetailMain: React.FC<PostDetailMainProps> = ({ post, user, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const [showReportModal, setShowReportModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reportReason, setReportReason] = useState('욕설/비방');
  const [etcReason, setEtcReason] = useState('');
  const [isReporting, setIsReporting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [reportError, setReportError] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isAuthenticated } = useAuthStore();

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

  const handleBlock = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    try {
      await blockApi.blockUser((post as any).authorId);
      alert('해당 사용자를 차단했습니다. 이후 이 사용자의 게시물과 댓글이 목록에서 숨겨집니다.');
      // 차단 직후 글 목록으로 이동
      navigate('/community');
    } catch (e) {
      alert('차단 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <PostHeader onClick={() => setMenuOpen(false)}>
      <ActionArea onClick={(e) => { e.stopPropagation(); }}>
        <KebabButton onClick={() => setMenuOpen(prev => !prev)}>
          <img src={MeatballsIcon} alt="more" width={22} height={22} />
        </KebabButton>
        {menuOpen && (
          <DropdownMenu>
            {isOwnPost ? (
              <>
                <MenuItem onClick={() => { setMenuOpen(false); onEdit(); }}>수정</MenuItem>
                <MenuItem onClick={() => { setMenuOpen(false); onDelete(); }}>삭제</MenuItem>
              </>
            ) : (
              <>
                <MenuItem onClick={() => { setMenuOpen(false); setShowReportModal(true); }}>신고</MenuItem>
                <MenuItem onClick={() => { setMenuOpen(false); handleBlock(); }}>사용자 차단</MenuItem>
              </>
            )}
          </DropdownMenu>
        )}
      </ActionArea>
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
                <div style={{ fontSize: '0.9rem', marginBottom: 8 }}>
                  불쾌한 콘텐츠에 대한 무관용 정책을 적용합니다. 자세한 내용은
                  <a href="/terms#zero-tolerance" target="_blank" rel="noopener noreferrer" style={{ color: '#785cd2', marginLeft: 6 }}>이용약관</a>을 확인하세요.
                </div>
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

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </PostHeader>
  );
};

export default PostDetailMain; 