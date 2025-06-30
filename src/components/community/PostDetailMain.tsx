import React from 'react';
import styled from 'styled-components';

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
  background: #f1f3f5;
  color: #868e96;
  border-radius: 0.25rem;
  margin-right: 0.5rem;
`;
const PostTitle = styled.h1`
  font-size: 1.2rem;
  font-weight: 600;
  color: #212529;
  margin-bottom: 0.5rem;
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
  background: #ffe0f0;
  color: #d63384;
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

const PostDetailMain: React.FC<PostDetailMainProps> = ({ post, user, onEdit, onDelete }) => (
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
    {user && post && (user.id === (post as any).authorId) && (
      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
        <button onClick={onEdit} style={{ background: '#785cd2', color: '#ffffff', border: 'none', borderRadius: '0.5rem', padding: '0.4rem 1.2rem', fontWeight: 600, cursor: 'pointer' }}>수정</button>
        <button onClick={onDelete} style={{ background: '#ff69b4', color: '#ffffff', border: 'none', borderRadius: '0.5rem', padding: '0.4rem 1.2rem', fontWeight: 600, cursor: 'pointer' }}>삭제</button>
      </div>
    )}
    <PostContent dangerouslySetInnerHTML={{ __html: post.content }} />
  </PostHeader>
);

export default PostDetailMain; 