import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import NavigationBar from '../components/NavigationBar';
import axiosInstance from '../api/axios';
import useAuthStore from '../store/authStore';
import type { User } from '../types/user';
import BackButton from '../components/common/BackButton';
import { PostDetailSkeleton } from '../components/common/Skeleton';
import PostDetailMain from '../components/community/PostDetailMain';
import LatestPostList from '../components/community/LatestPostList';
import PollVoteBox from '../components/community/PollVoteBox';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';
import type { Draft } from 'immer';

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

interface PollVote {
  userId: string;
  choice: number; // 0: 찬성, 1: 반대 등
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
  poll?: {
    question: string;
    options: string[];
    votes?: PollVote[]; // 임시: 실제 백엔드 연동 전까지 프론트 상태로 관리
  };
}

// === Styled Components (전면 개편) ===
// 광고 박스 (투명한 여백용)
const AdBox = styled.div`
  width: 100%;
  height: 6rem; /* 96px 높이 */
  background-color: transparent; /* 투명 배경 */
  margin-top: 1rem; /* 최신글 목록과의 간격 */
  border-radius: 0.5rem;
  /* 나중에 광고 추가 시 사용할 스타일 */
  /* background-color: #f9f9f9; */
  /* border: 1px solid #e0e0e0; */
`;

const Container = styled.div`
  background-color: #f8f9fa;
  min-height: 100vh;
  padding: 1.5rem 1rem 3rem 1rem;
`;

const PostContainer = styled.div`
  
  padding: 3rem 0.5rem 1rem;
  
`;

const CommentsSection = styled.div`
  padding: 0 0.5rem 1rem;
  
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
        border-color: #785CD2;
    }
`;

const CommentSubmitButton = styled.button`
    background-color: #785CD2;
    color: white;
    padding: 0.5rem 1rem;
    font-weight: 500;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    &:hover {
        background-color: #785CD2;
    }
`;

const CommentList = styled.div`
  margin-top: 1.5rem;
`;

const CommentItem = styled.div`
  padding: 0.5rem 0;
  
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


const ReplyBox = styled.div`
  margin-left: 2rem;
  margin-top: 0.5rem;
  padding-left: 1rem;
  border-left: 2px solid #f1f3f5;
`;

// 게시글 상세 fetch 함수 추가
const fetchPostDetail = async (id: string) => {
  const response = await axiosInstance.get(`/community/posts/${id}`);
  return response.data;
};

const postComment = async ({ postId, content }: { postId: string, content: string }) => {
  const response = await axiosInstance.post(`/community/posts/${postId}/comments`, { content });
  return response.data;
};

const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [newComment, setNewComment] = useState('');
  const [replyOpen, setReplyOpen] = useState<{ [commentId: string]: boolean }>({});
  const [replyContent, setReplyContent] = useState<{ [commentId: string]: string }>({});
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [latestPage, setLatestPage] = useState(1);
  const [latestTotal, setLatestTotal] = useState(0);
  const LATEST_LIMIT = 20;
  const queryClient = useQueryClient();

  // React Query: 게시글 상세
  const {
    data: post,
    isLoading,
    error
  } = useQuery({
    queryKey: ['post', id],
    queryFn: () => fetchPostDetail(id!),
    enabled: !!id
  });

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

  // 댓글 등록 mutation
  const commentMutation = useMutation({
    mutationFn: ({ postId, content }: { postId: string, content: string }) => postComment({ postId, content }),
    onSuccess: () => {
      // 게시글 상세 쿼리 invalidate (자동 새로고침)
      queryClient.invalidateQueries({ queryKey: ['post', id] });
      setNewComment('');
    },
    // optimistic update 예시 (immer 활용)
    onMutate: async ({ content }) => {
      await queryClient.cancelQueries({ queryKey: ['post', id] });
      const previousPost = queryClient.getQueryData(['post', id]);
      queryClient.setQueryData(['post', id], (old: any) =>
        produce(old, (draft: Draft<Post>) => {
          if (draft && draft.comments) {
            draft.comments.push({
              id: 'temp-' + Date.now(),
              content,
              author: { nickname: user?.nickname || '나' },
              createdAt: new Date().toISOString(),
              replies: []
            });
          }
        })
      );
      return { previousPost };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(['post', id], context.previousPost);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['post', id] });
    }
  });

  // 댓글 등록 핸들러
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    commentMutation.mutate({ postId: id!, content: newComment });
  };

  const handleReplySubmit = async (parentId: string) => {
    if (!replyContent[parentId]?.trim()) return;
    try {
      await axiosInstance.post(`/community/posts/${id}/comments/${parentId}/replies`, {
        content: replyContent[parentId],
      });
      setReplyContent((prev) => ({ ...prev, [parentId]: '' }));
      setReplyOpen((prev) => ({ ...prev, [parentId]: false }));
      fetchPostDetail(id!);
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

  if (isLoading) return (
    <Container style={{ position: 'relative' }}>
      <BackButton />
      <PostContainer>
        <PostDetailSkeleton />
      </PostContainer>
    </Container>
  );
  if (error) return <div style={{ color: 'red', textAlign: 'center', margin: '2rem 0' }}>게시글을 불러오는 중 오류가 발생했습니다.</div>;
  if (!post) return null;

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
                  style={{ fontSize: '0.9rem', color: '#785CD2', background: 'none', border: 'none', cursor: 'pointer' }}
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
          <PostDetailMain post={post} user={user as User} onEdit={handleEdit} onDelete={handleDelete} />
          <PollVoteBox post={post} user={user as User} />
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
        <div style={{  padding: '0 0.5rem 1rem', borderTop: '1px solid #f1f3f5' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '2rem 0 1.2rem', color: '#343a40' }}>최신글</h2>
          <LatestPostList
            posts={latestPosts}
            currentId={id}
            page={latestPage}
            totalPages={totalPages}
            onPageChange={setLatestPage}
          />
        </div>
        
        <AdBox />
      </Container>
      <NavigationBar />
    </>
  );
};

export default PostDetailPage; 