import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface Post {
  id: string;
  title: string;
  author: { nickname: string };
  category: { name: string };
  createdAt: string;
  tags?: string[];
  _count?: { comments: number };
}

interface LatestPostListProps {
  posts: Post[];
  currentId?: string;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PostListItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.2rem 1.5rem;
  border-bottom: 1px solid #f1f3f5;
  &:last-child {
    border-bottom: none;
  }
`;
const PostHeaderCommunity = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;
const CategoryTagCommunity = styled.span<{ $bgcolor: string }>`
  background-color: ${props => props.$bgcolor};
  color: white;
  padding: 0.08rem 0.45rem;
  border-radius: 0.7rem;
  font-size: 0.82rem;
  font-weight: 500;
  line-height: 1.2;
  margin-right: 0.3rem;
`;
const PostTitleCommunity = styled(Link)`
  font-size: 1.01rem;
  font-weight: 700;
  color: #212529;
  text-decoration: none;
  margin-bottom: 0.2rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  max-height: 2.7em;
  line-height: 1.35;
  &:hover {
    text-decoration: underline;
  }
`;
const PostMetaCommunity = styled.div`
  font-size: 0.95rem;
  color: #adb5bd;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;
const CommentCount = styled.span`
  color: #FF69B4;
  font-weight: 600;
`;
const PaginationButton = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  padding: 0;
  cursor: ${({ $active }) => ($active ? 'pointer' : 'not-allowed')};
  display: flex;
  align-items: center;
`;
const PaginationNum = styled.span`
  font-size: 1.15rem;
  font-weight: 700;
  color: #868e96;
  margin: 0 0.7rem;
`;

function getCategoryColor(name: string) {
  switch (name) {
    case '부부관계':
      return '#FF69B4';
    case '결혼생활':
      return '#4F8CFF';
    case '챌린지인증':
      return '#FFA940';
    case '찬반토론':
      return '#52C41A';
    default:
      return '#f1f3f5';
  }
}

import LeftActive from '../../assets/direction=left, status=active, Mirror=True, size=large-3.svg';
import LeftInactive from '../../assets/direction=left, status=inactive, Mirror=False, size=large-3.svg';
import RightActive from '../../assets/direction=right, status=active, Mirror=True, size=large-3.svg';
import RightInactive from '../../assets/direction=right, status=inactive, Mirror=False, size=large-3.svg';

const LatestPostList: React.FC<LatestPostListProps> = ({ posts, currentId, page, totalPages, onPageChange }) => (
  <div>
    {posts.filter(p => p.id !== currentId).length === 0 ? (
      <p style={{ color: '#adb5bd', textAlign: 'center', margin: '2rem 0' }}>아직 작성된 글이 없습니다.</p>
    ) : (
      posts.filter(p => p.id !== currentId).map(post => (
        <PostListItem key={post.id}>
          <PostHeaderCommunity>
            <CategoryTagCommunity $bgcolor={getCategoryColor(post.category?.name)}>{post.category?.name}</CategoryTagCommunity>
            <PostTitleCommunity to={`/community/${post.id}`}>{post.title}</PostTitleCommunity>
          </PostHeaderCommunity>
          {/* 태그 표시 */}
          {post.tags && post.tags.length > 0 && (
            <div style={{
              margin: '0.18rem 0 0.08rem 0',
              display: 'block',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              maxWidth: '100%',
            }}>
              {post.tags.map(tag => (
                <span key={tag} style={{
                  display: 'inline-block',
                  background: '#f8f0fa',
                  color: '#b197fc',
                  fontSize: '0.82rem',
                  fontWeight: 400,
                  borderRadius: '0.7rem',
                  padding: '0.08rem 0.45rem',
                  marginRight: '0.18rem',
                  maxWidth: '120px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  verticalAlign: 'middle',
                }}>#{tag}</span>
              ))}
            </div>
          )}
          <PostMetaCommunity>
            <span>{post.author?.nickname}</span>
            <span>·</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            <span>·</span>
            <span>댓글 <CommentCount>{post._count?.comments ?? 0}</CommentCount></span>
          </PostMetaCommunity>
        </PostListItem>
      ))
    )}
    {/* 페이지네이션 */}
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
      <PaginationButton $active={page > 1} onClick={() => page > 1 && onPageChange(page - 1)}>
        {page > 1 ? <img src={LeftActive} alt="이전" width={36} /> : <img src={LeftInactive} alt="이전" width={36} />}
      </PaginationButton>
      <PaginationNum>{page}</PaginationNum>
      <PaginationButton $active={page < totalPages} onClick={() => page < totalPages && onPageChange(page + 1)}>
        {page < totalPages ? <img src={RightActive} alt="다음" width={36} /> : <img src={RightInactive} alt="다음" width={36} />}
      </PaginationButton>
    </div>
  </div>
);

export default LatestPostList; 