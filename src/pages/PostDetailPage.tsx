import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Container as BaseContainer } from '../styles/CommonStyles';
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
import ConfirmationModal from '../components/common/ConfirmationModal';
import MeatballsIcon from '../assets/Meatballs_menu.svg?url';

// === 타입 정의 ===
interface PostAuthor {
  id: string;
  nickname: string;
}

interface CommentAuthor {
  id: string;
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

const Container = styled(BaseContainer)`
  background-color: #f8f9fa;
  padding: 1.5rem 1rem;
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
    margin-bottom: 0.9rem;
`;

const CommentForm = styled.form`
    display: flex;
    gap: 0.5rem;
    margin-top: 0.9rem;
    align-items: center;
`;

const CommentTextarea = styled.textarea`
    flex-grow: 1;
    padding: 0.3rem 0.4rem;
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    font-size: 0.95rem;
    line-height: 1.3;
    resize: vertical;
    min-height: 36px;
    &:focus {
        outline: none;
        border-color: #785CD2;
    }
`;

const CommentSubmitButton = styled.button`
    background-color: #785CD2;
    color: white;
    height: 50px;
    padding: 0 0.9rem;
    font-size: 0.95rem;
    font-weight: 600;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    &:hover {
        background-color: #785CD2;
    }
`;

const CommentList = styled.div`
  margin-top: 0.7rem;
`;

const CommentItem = styled.div`
  padding: 0.35rem 0;
  
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  position: relative;
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
  line-height: 1.45;
`;

const KebabButton = styled.button`
  margin-left: auto;
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #868e96;
  cursor: pointer;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 32px;
  right: 0;
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
  padding: 6px;
  z-index: 10;
  min-width: 120px;
`;

const MenuItem = styled.button`
  width: 100%;
  text-align: left;
  padding: 8px 10px;
  border: none;
  background: transparent;
  color: #495057;
  font-size: 0.9rem;
  border-radius: 6px;
  cursor: pointer;
  &:hover {
    background: #f8f9fa;
  }
`;

const ReplyBox = styled.div`
  margin-left: 2rem;
  margin-top: 0.35rem;
  padding-left: 0.75rem;
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
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  // 댓글 신고 모달 상태
  const [showCommentReportModal, setShowCommentReportModal] = useState(false);
  const [reportTargetCommentId, setReportTargetCommentId] = useState<string | null>(null);
  const [commentReportReason, setCommentReportReason] = useState('욕설/비방');
  const [commentReportEtc, setCommentReportEtc] = useState('');
  const [commentReportLoading, setCommentReportLoading] = useState(false);
  const [commentReportSuccess, setCommentReportSuccess] = useState(false);
  const [commentReportError, setCommentReportError] = useState('');
  const REPORT_REASONS = ['욕설/비방', '음란/선정성', '광고/홍보', '도배/스팸', '기타'];

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
  // 바깥 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleDocClick = () => setMenuOpenId(null);
    document.addEventListener('click', handleDocClick);
    return () => document.removeEventListener('click', handleDocClick);
  }, []);

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
              author: { id: user?.id || 'me', nickname: user?.nickname || '나' },
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
      // 차단 사용자 댓글이 필터된 최신 상태로 동기화
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
      // 서버에서 차단 사용자 댓글 필터가 적용되었으므로 최신 데이터 재조회
      queryClient.invalidateQueries({ queryKey: ['post', id] });
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
            <CommentHeader onClick={(e) => e.stopPropagation()}>
              <CommentAuthor>{comment.author.nickname}</CommentAuthor>
              <CommentDate>{new Date(comment.createdAt).toLocaleString()}</CommentDate>
              <KebabButton onClick={() => setMenuOpenId(prev => prev === comment.id ? null : comment.id)}>
                <img src={MeatballsIcon} alt="more" width={20} height={20} />
              </KebabButton>
              {menuOpenId === comment.id && (
                <DropdownMenu onClick={(e) => e.stopPropagation()}>
                  <MenuItem onClick={() => {
                    setReplyOpen(prev => ({ ...prev, [comment.id]: !prev[comment.id] }));
                    setMenuOpenId(null);
                  }}>답글 달기</MenuItem>
                  <MenuItem onClick={() => {
                    if (!useAuthStore.getState().accessToken) {
                      alert('로그인이 필요합니다.');
                      navigate('/login');
                      return;
                    }
                    setReportTargetCommentId(comment.id);
                    setCommentReportReason('욕설/비방');
                    setCommentReportEtc('');
                    setCommentReportError('');
                    setCommentReportSuccess(false);
                    setShowCommentReportModal(true);
                    setMenuOpenId(null);
                  }}>신고</MenuItem>
                  <MenuItem onClick={async () => {
                    try {
                      if (!useAuthStore.getState().accessToken) {
                        alert('로그인이 필요합니다.');
                        navigate('/login');
                        return;
                      }
                      await (await import('../api/user')).blockApi.blockUser(comment.author.id);
                      alert('해당 사용자를 차단했습니다.');
                      queryClient.invalidateQueries({ queryKey: ['post', id] });
                      setMenuOpenId(null);
                    } catch {
                      alert('차단 처리 중 오류가 발생했습니다.');
                    }
                  }}>사용자 차단</MenuItem>
                </DropdownMenu>
              )}
            </CommentHeader>
            <CommentContent>{comment.content}</CommentContent>
            {!comment.parentId && (
              <div style={{ marginTop: '0.35rem' }}>
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

        {/* 댓글 신고 모달 */}
        {showCommentReportModal && (
          <ConfirmationModal
            isOpen={showCommentReportModal}
            onRequestClose={() => {
              setShowCommentReportModal(false);
              setCommentReportSuccess(false);
              setCommentReportReason('욕설/비방');
              setCommentReportEtc('');
              setCommentReportError('');
            }}
            onConfirm={async () => {
              if (commentReportSuccess) {
                setShowCommentReportModal(false);
                setCommentReportSuccess(false);
                return;
              }
              if (!reportTargetCommentId) return;
              try {
                setCommentReportLoading(true);
                setCommentReportError('');
                await axiosInstance.post('/community/complaint', {
                  postId: id,
                  commentId: reportTargetCommentId,
                  reason: commentReportReason,
                  etcReason: commentReportReason === '기타' ? commentReportEtc : undefined,
                });
                setCommentReportSuccess(true);
              } catch (e) {
                setCommentReportError('신고 처리 중 오류가 발생했습니다.');
              } finally {
                setCommentReportLoading(false);
              }
            }}
            title="댓글 신고"
            confirmButtonText={commentReportSuccess ? '닫기' : (commentReportLoading ? '신고 중...' : '신고하기')}
            cancelButtonText="취소"
            showCancelButton={!commentReportSuccess}
          >
            {commentReportSuccess ? (
              <div style={{ color: '#28a745', fontSize: '1rem', margin: '1.5rem 0' }}>신고가 정상적으로 접수되었습니다.</div>
            ) : (
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.9rem', marginBottom: 8 }}>
                  불쾌한 콘텐츠에 대한 무관용 정책을 적용합니다. 자세한 내용은
                  <a href="/terms#zero-tolerance" target="_blank" rel="noopener noreferrer" style={{ color: '#785cd2', marginLeft: 6 }}>이용약관</a>을 확인하세요.
                </div>
                {REPORT_REASONS.map((reason) => (
                  <label key={reason} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <input
                      type="radio"
                      name="comment-report-reason"
                      value={reason}
                      checked={commentReportReason === reason}
                      onChange={() => setCommentReportReason(reason)}
                      disabled={commentReportLoading}
                    />
                    {reason}
                  </label>
                ))}
                {commentReportReason === '기타' && (
                  <input
                    type="text"
                    placeholder="신고 사유를 입력하세요"
                    value={commentReportEtc}
                    onChange={e => setCommentReportEtc(e.target.value)}
                    style={{ marginTop: 8, padding: 6, borderRadius: 4, border: '1px solid #ddd', width: '100%' }}
                    disabled={commentReportLoading}
                  />
                )}
                {commentReportError && <div style={{ color: '#dc3545', marginTop: 8 }}>{commentReportError}</div>}
              </div>
            )}
          </ConfirmationModal>
        )}

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
        
      </Container>
      <NavigationBar />
    </>
  );
};

export default PostDetailPage; 