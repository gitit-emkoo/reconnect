import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ReactComponent as LeftActive } from '../../assets/DirectionLeftActive.svg';
import { ReactComponent as LeftInactive } from '../../assets/DirectionLeftInactive.svg';
import { ReactComponent as RightActive } from '../../assets/DirectionRightActive.svg';
import { ReactComponent as RightInactive } from '../../assets/DirectionRightInactive.svg';

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
  padding: 1rem 0 1rem;
  border-bottom: 1px solid #f1f3f5;

  &:last-child {
    border-bottom: none;
  }
`;

const CategoryTag = styled.span<{ $bgcolor: string }>`
  background-color: ${props => props.$bgcolor};
  color: white;
  padding: 0.15rem 0.6rem;
  border-radius: 0.8rem;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.4;
  display: inline-block;
  margin-bottom: 0.5rem;
`;

const PostTitle = styled(Link)`
  font-size: 0.95rem;
  font-weight: 600;
  color: #212529;
  text-decoration: none;
  line-height: 1.4;
  
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;

  &:hover {
    text-decoration: underline;
  }
`;

const TagContainer = styled.div`
  margin-top: 0.4rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Tag = styled.span`
  background-color: #f1f3f5;
  color: #868e96;
  padding: 0.2rem 0.6rem;
  border-radius: 0.8rem;
  font-size: 0.75rem;
  font-weight: 500;
  margin-right: 0.4rem;
`;

const PostMeta = styled.div`
  font-size: 0.8rem;
  color: #868e96;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
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
    case '결혼생활':
      return '#FF69B4';
    case '부부관계':
      return '#4F8CFF';
    case '챌린지인증':
      return '#FFA940';
    case '찬반토론':
      return '#52C41A';
    default:
      return '#f1f3f5';
  }
}

const LatestPostList: React.FC<LatestPostListProps> = ({ posts, currentId, page, totalPages, onPageChange }) => (
  <div>
    {posts.filter(p => p.id !== currentId).length === 0 ? (
      <p style={{ color: '#adb5bd', textAlign: 'center', margin: '2rem 0' }}>아직 작성된 글이 없습니다.</p>
    ) : (
      posts.filter(p => p.id !== currentId).map(post => (
        <PostListItem key={post.id}>
          <CategoryTag $bgcolor={getCategoryColor(post.category?.name)}>
            {post.category?.name}
          </CategoryTag>
          <PostTitle to={`/community/${post.id}`}>{post.title}</PostTitle>
          {post.tags && post.tags.length > 0 && (
            <TagContainer>
              {post.tags.map(tag => (
                <Tag key={tag}>#{tag}</Tag>
              ))}
            </TagContainer>
          )}
          <PostMeta>
            <span>{post.author?.nickname}</span>
            <span>·</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            <span>·</span>
            <CommentCount>댓글 {post._count?.comments ?? 0}</CommentCount>
          </PostMeta>
        </PostListItem>
      ))
    )}
    {/* 페이지네이션 */}
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
      <PaginationButton $active={page > 1} onClick={() => page > 1 && onPageChange(page - 1)}>
        {page > 1 ? <LeftActive width={36} /> : <LeftInactive width={36} />}
      </PaginationButton>
      <PaginationNum>{page}</PaginationNum>
      <PaginationButton $active={page < totalPages} onClick={() => page < totalPages && onPageChange(page + 1)}>
        {page < totalPages ? <RightActive width={36} /> : <RightInactive width={36} />}
      </PaginationButton>
    </div>
  </div>
);

export default LatestPostList; 