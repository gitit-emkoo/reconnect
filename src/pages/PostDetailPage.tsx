import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import NavigationBar from '../components/NavigationBar';
import axiosInstance from '../api/axios';
import axios from 'axios'; // Axios 에러 타입 확인을 위해 import
import { AuthContext } from '../contexts/AuthContext';
import BackButton from '../components/common/BackButton';
import LeftActive from '../assets/direction=left, status=active, Mirror=True, size=large-3.svg';
import LeftInactive from '../assets/direction=left, status=inactive, Mirror=False, size=large-3.svg';
import RightActive from '../assets/direction=right, status=active, Mirror=True, size=large-3.svg';
import RightInactive from '../assets/direction=right, status=inactive, Mirror=False, size=large-3.svg';
import LoadingSpinner from '../components/common/LoadingSpinner';

// === 타입 정의 ===
interface PostAuthor {
  nickname: string;
}

interface CommentAuthor {
  nickname: string;
}

interface Comment {
  id: string;
  content: string;
  author: CommentAuthor;
  createdAt: string;
  parentId?: string | null;
  replies?: Comment[];
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: PostAuthor;
  createdAt: string;
  comments: Comment[];
  category: { name: string }; // 카테고리 정보 추가
  tags?: string[];
  viewCount?: number;
}

// === Styled Components (전면 개편) ===
const Container = styled.div`
  background-color: #f8f9fa;
  min-height: 100vh;
  padding: 1.5rem 1rem 5rem 1rem;
`;

const PostContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const PostHeader = styled.div`
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e9ecef;
`;

const CategoryTag = styled.span`
  font-size: 0.97rem;
  font-weight: 600;
  padding: 0.18rem 0.6rem;
  background: #f1f3f5;
  color: #868e96;
  border-radius: 0.25rem;
  margin-right: 0.5rem;
`;

const PostTitle = styled.h1`
  font-size: 1.15rem;
  font-weight: 700;
  color: #212529;
  margin-bottom: 0.5rem;
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.97rem;
  color: #868e96;
`;

const AuthorName = styled.span`
  font-weight: 600;
`;

const PostMeta = styled.span`
  font-size: 0.95rem;
  color: #adb5bd;
`;

const PostContent = styled.div`
  padding: 2rem 0;
  font-size: 1.1rem;
  line-height: 1.7;
  color: #343a40;
  // prose-mirror, toast-ui 등에서 생성된 태그 스타일링
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

const CommentsSection = styled.div`
  margin-top: 2rem;
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const CommentsTitle = styled.h3`
    font-size: 1.25rem;
    font-weight: 600;
    color: #343a40;
    margin-bottom: 1.5rem;
`;

const CommentForm = styled.form`
    display: flex;
    gap: 0.5rem;
    margin-top: 1.5rem;
`;

const CommentTextarea = styled.textarea`
    flex-grow: 1;
    padding: 0.8rem 1rem;
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    font-size: 1rem;
    resize: vertical;
    min-height: 40px;
    &:focus {
        outline: none;
        border-color: #8d6e63;
    }
`;

const CommentSubmitButton = styled.button`
    background-color: #8d6e63;
    color: white;
    padding: 0.5rem 1rem;
    font-weight: 500;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    &:hover {
        background-color: #6d4c41;
    }
`;

const CommentList = styled.div`
  margin-top: 1.5rem;
`;

const CommentItem = styled.div`
  padding: 1.5rem 0;
  border-top: 1px solid #f1f3f5;
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

const CommentAuthor = styled.span`
  font-weight: 600;
  font-size: 0.95rem;
  color: #212529;
`;

const CommentDate = styled.span`
  font-size: 0.85rem;
  color: #868e96;
`;

const CommentContent = styled.p`
  color: #495057;
  line-height: 1.6;
`;

const TagBadge = styled.span`
  display: inline-block;
  background: #ffe0f0;
  color: #d63384;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 0.75rem;
  padding: 0.15rem 0.7rem;
  margin-right: 0.3rem;
  margin-top: 0.3rem;
`;

const ViewCount = styled.span`
  color: #868e96;
  font-size: 0.95rem;
  margin-left: 0.5rem;
`;

const ReplyBox = styled.div`
  margin-left: 2rem;
  margin-top: 0.5rem;
  padding-left: 1rem;
  border-left: 2px solid #f1f3f5;
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

const PaginationTop = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  color: #868e96;
`;

const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyOpen, setReplyOpen] = useState<{ [commentId: string]: boolean }>({});
  const [replyContent, setReplyContent] = useState<{ [commentId: string]: string }>({});
  const { user } = useContext(AuthContext);
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [latestPage, setLatestPage] = useState(1);
  const [latestTotal, setLatestTotal] = useState(0);
  const LATEST_LIMIT = 20;

  const fetchPost = async () => {
    try {
      setLoading(true);
      console.log(`상세 게시글 요청. ID: ${id}`);
      const response = await axiosInstance.get(`/community/posts/${id}`);
      console.log('상세 게시글 응답 데이터:', response.data);
      setPost(response.data);
    } catch (err) {
      setError("게시글을 불러오는 중 오류가 발생했습니다.");
      console.error(`상세 게시글(ID: ${id}) 로딩 실패 에러:`, err);
      if (axios.isAxiosError(err)) {
        console.error("Axios 에러 상세 응답:", err.response?.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  // 최신글 목록 불러오기
  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const res = await axiosInstance.get(`/community/posts?limit=${LATEST_LIMIT}&page=${latestPage}`);
        setLatestPosts(res.data.posts || res.data);
        setLatestTotal(res.data.total || 0);
      } catch (e) {
        setLatestPosts([]);
        setLatestTotal(0);
      }
    };
    fetchLatestPosts();
  }, [latestPage]);

  const totalPages = Math.max(1, Math.ceil(latestTotal / LATEST_LIMIT));

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    const commentData = { content: newComment };
    console.log(`댓글 등록 요청. ID: ${id}, 데이터:`, commentData);

    try {
        await axiosInstance.post(`/community/posts/${id}/comments`, commentData);
        setNewComment('');
        console.log('댓글 등록 성공, 게시글 데이터 새로고침');
        fetchPost(); 
    } catch (err) {
        alert("댓글 등록에 실패했습니다. 개발자 콘솔을 확인해주세요.");
        console.error('댓글 등록 실패 에러:', err);
        if (axios.isAxiosError(err)) {
          console.error("Axios 에러 상세 응답:", err.response?.data);
        }
    }
  };

  const handleReplySubmit = async (parentId: string) => {
    if (!replyContent[parentId]?.trim()) return;
    try {
      await axiosInstance.post(`/community/posts/${id}/comments/${parentId}/replies`, {
        content: replyContent[parentId],
      });
      setReplyContent((prev) => ({ ...prev, [parentId]: '' }));
      setReplyOpen((prev) => ({ ...prev, [parentId]: false }));
      fetchPost();
    } catch (err) {
      alert('대댓글 등록에 실패했습니다.');
    }
  };

  // 글 삭제 핸들러
  const handleDelete = async () => {
    if (!window.confirm('정말 이 글을 삭제하시겠습니까?')) return;
    try {
      await axiosInstance.delete(`/community/posts/${id}`);
      alert('글이 삭제되었습니다.');
      navigate('/community');
    } catch (err) {
      alert('글 삭제에 실패했습니다.');
    }
  };

  // 글 수정 핸들러(페이지 이동)
  const handleEdit = () => {
    navigate(`/community/${id}/edit`);
  };

  if (loading) return <Container><LoadingSpinner size={48} /></Container>;
  if (error) return <Container><p style={{ color: 'red' }}>{error}</p></Container>;
  if (!post) return <Container><p>게시글을 찾을 수 없습니다.</p></Container>;

  const renderComments = (comments: Comment[], parentId: string | null = null) => {
    return comments
      .filter((c) => (parentId ? c.parentId === parentId : !c.parentId))
      .map((comment) => (
        <div key={comment.id}>
          <CommentItem>
            <CommentHeader>
              <CommentAuthor>{comment.author.nickname}</CommentAuthor>
              <CommentDate>{new Date(comment.createdAt).toLocaleString()}</CommentDate>
            </CommentHeader>
            <CommentContent>{comment.content}</CommentContent>
            {!comment.parentId && (
              <div style={{ marginTop: '0.5rem' }}>
                <button
                  style={{ fontSize: '0.9rem', color: '#8d6e63', background: 'none', border: 'none', cursor: 'pointer' }}
                  onClick={() => setReplyOpen((prev) => ({ ...prev, [comment.id]: !prev[comment.id] }))}
                >
                  답글 달기
                </button>
                {replyOpen[comment.id] && (
                  <ReplyBox>
                    <CommentForm onSubmit={e => { e.preventDefault(); handleReplySubmit(comment.id); }}>
                      <CommentTextarea
                        placeholder="답글을 입력하세요."
                        value={replyContent[comment.id] || ''}
                        onChange={e => setReplyContent((prev) => ({ ...prev, [comment.id]: e.target.value }))}
                      />
                      <CommentSubmitButton type="submit">등록</CommentSubmitButton>
                    </CommentForm>
                  </ReplyBox>
                )}
              </div>
            )}
          </CommentItem>
          <ReplyBox>
            {renderComments(comments, comment.id)}
          </ReplyBox>
        </div>
      ));
  };

  return (
    <>
      <Container style={{ position: 'relative' }}>
        <BackButton />
        <PostContainer>
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
                <button onClick={handleEdit} style={{ background: '#ffe0e0', color: '#d63384', border: 'none', borderRadius: '0.5rem', padding: '0.4rem 1.2rem', fontWeight: 600, cursor: 'pointer' }}>수정</button>
                <button onClick={handleDelete} style={{ background: '#f8d7da', color: '#721c24', border: 'none', borderRadius: '0.5rem', padding: '0.4rem 1.2rem', fontWeight: 600, cursor: 'pointer' }}>삭제</button>
              </div>
            )}
          </PostHeader>
          <PostContent dangerouslySetInnerHTML={{ __html: post.content }} />
        </PostContainer>

        <CommentsSection>
            <CommentsTitle>댓글 ({post.comments.length}개)</CommentsTitle>
            <CommentForm onSubmit={handleCommentSubmit}>
                <CommentTextarea 
                    placeholder="따뜻한 댓글을 남겨주세요."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <CommentSubmitButton type="submit">등록</CommentSubmitButton>
            </CommentForm>
            <CommentList>
              {renderComments(post.comments)}
            </CommentList>
        </CommentsSection>

        {/* 최신글 목록 */}
        <div style={{ marginTop: '3rem', background: '#fff', borderRadius: '0.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '2rem' }}>
          {/* 상단 페이지네이션(오른쪽 정렬, 1/20 형식) */}
          <PaginationTop>
            <span>{latestPage} / {totalPages}</span>
          </PaginationTop>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.2rem', color: '#343a40' }}>최신글</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {latestPosts.filter(p => p.id !== id).map(post => (
              <li key={post.id} style={{ borderBottom: '1px solid #f1f3f5', padding: '0.7rem 0' }}>
                <Link to={`/community/${post.id}`} style={{ textDecoration: 'none', color: '#212529', display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                  {post.category && <span style={{ background: '#f1f3f5', color: '#868e96', padding: '0.2rem 0.7rem', borderRadius: '0.25rem', fontSize: '0.9rem', fontWeight: 600 }}>{post.category.name}</span>}
                  <span style={{ fontWeight: 600, flex: 1 }}>{post.title}</span>
                  <span style={{ color: '#868e96', fontSize: '0.95rem' }}>{post.author?.nickname}</span>
                  <span style={{ color: '#adb5bd', fontSize: '0.95rem' }}>{new Date(post.createdAt).toLocaleDateString()}</span>
                </Link>
              </li>
            ))}
          </ul>
          {/* 페이지네이션 */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
            <PaginationButton $active={latestPage > 1} onClick={() => latestPage > 1 && setLatestPage(p => Math.max(1, p - 1))}>
              {latestPage > 1 ? <img src={LeftActive} alt="이전" width={36} /> : <img src={LeftInactive} alt="이전" width={36} />}
            </PaginationButton>
            <PaginationNum>{latestPage}</PaginationNum>
            <PaginationButton $active={latestPage < totalPages} onClick={() => latestPage < totalPages && setLatestPage(p => Math.min(totalPages, p + 1))}>
              {latestPage < totalPages ? <img src={RightActive} alt="다음" width={36} /> : <img src={RightInactive} alt="다음" width={36} />}
            </PaginationButton>
          </div>
        </div>
      </Container>
      <NavigationBar />
    </>
  );
};

export default PostDetailPage; 