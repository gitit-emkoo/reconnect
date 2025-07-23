import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axiosInstance from '../api/axios';
import PageLayout from '../components/Layout/PageLayout';

const TabContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;
const TabButton = styled.button<{ active: boolean }>`
  padding: 0.7rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px 8px 0 0;
  background: ${({ active }) => (active ? 'linear-gradient(90deg, #ff69b4, #785cd2)' : '#f8f9fa')};
  color: ${({ active }) => (active ? '#fff' : '#888')};
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  border-bottom: 2px solid ${({ active }) => (active ? '#785cd2' : 'transparent')};
`;
const SearchBar = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.2rem;
`;
const SearchInput = styled.input`
  flex: 1;
  padding: 0.7rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
`;
const SearchButton = styled.button`
  padding: 0.7rem 1.2rem;
  background: linear-gradient(90deg, #ff69b4, #785cd2);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
`;
const Th = styled.th`
  background: #f8f9fa;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #e9ecef;
`;
const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e9ecef;
  vertical-align: middle;
  font-size: 0.97rem;
`;
const Tr = styled.tr`
  &:hover { background: #f8f9fa; }
`;
const ReasonBadge = styled.span`
  background: #ffe0e6;
  color: #d6336c;
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 0.92rem;
`;
const DeleteButton = styled.button`
  background: #ff6b6b;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 14px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  &:hover { background: #e03131; }
`;

interface Complaint {
  id: string;
  post?: { id: string; title: string } | null;
  comment?: { id: string; content: string } | null;
  reporter?: { id: string; nickname: string; email: string } | null;
  reason: string;
  etcReason?: string;
  createdAt: string;
}
interface Post {
  id: string;
  title: string;
  author?: { nickname: string };
  createdAt: string;
  viewCount?: number;
}

const CommunityAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'complaints' | 'posts'>('complaints');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [complaintsLoading, setComplaintsLoading] = useState(true);
  const [complaintsError, setComplaintsError] = useState('');
  const [complaintSearch, setComplaintSearch] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState('');
  const [postSearch, setPostSearch] = useState('');
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      setComplaintsLoading(true);
      setComplaintsError('');
      try {
        const { data } = await axiosInstance.get('/community/complaints');
        setComplaints(data);
      } catch (err) {
        setComplaintsError('신고 내역을 불러오는 데 실패했습니다.');
      } finally {
        setComplaintsLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setPostsLoading(true);
      setPostsError('');
      try {
        const { data } = await axiosInstance.get('/community/posts?limit=100');
        setPosts(data.posts || []);
      } catch (err) {
        setPostsError('게시글을 불러오는 데 실패했습니다.');
      } finally {
        setPostsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm('정말 이 게시글을 삭제하시겠습니까?')) return;
    setDeletingPostId(postId);
    try {
      await axiosInstance.delete(`/community/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      setComplaints((prev) => prev.filter((c) => c.post?.id !== postId));
      alert('게시글이 삭제되었습니다.');
    } catch (err) {
      alert('게시글 삭제에 실패했습니다.');
    } finally {
      setDeletingPostId(null);
    }
  };

  // 신고내역 검색 필터
  const filteredComplaints = complaints.filter((c) => {
    const keyword = complaintSearch.toLowerCase();
    return (
      (c.post?.title?.toLowerCase().includes(keyword) || '') ||
      (c.comment?.content?.toLowerCase().includes(keyword) || '') ||
      (c.reporter?.nickname?.toLowerCase().includes(keyword) || '') ||
      (c.reporter?.email?.toLowerCase().includes(keyword) || '') ||
      (c.reason?.toLowerCase().includes(keyword) || '') ||
      (c.etcReason?.toLowerCase().includes(keyword) || '')
    );
  });

  // 게시글 검색 필터
  const filteredPosts = posts.filter((p) => {
    const keyword = postSearch.toLowerCase();
    return (
      p.title.toLowerCase().includes(keyword) ||
      (p.author?.nickname?.toLowerCase().includes(keyword) || '')
    );
  });

  return (
    <PageLayout title="커뮤니티 관리">
      <TabContainer>
        <TabButton active={activeTab === 'complaints'} onClick={() => setActiveTab('complaints')}>신고 내역</TabButton>
        <TabButton active={activeTab === 'posts'} onClick={() => setActiveTab('posts')}>게시글 관리</TabButton>
      </TabContainer>

      {activeTab === 'complaints' && (
        <>
          <SearchBar>
            <SearchInput
              placeholder="신고자, 사유, 게시글/댓글 내용 등 검색"
              value={complaintSearch}
              onChange={e => setComplaintSearch(e.target.value)}
            />
            <SearchButton onClick={() => {}}>검색</SearchButton>
          </SearchBar>
          {complaintsLoading && <div>로딩 중...</div>}
          {complaintsError && <div style={{ color: 'red' }}>{complaintsError}</div>}
          {!complaintsLoading && !complaintsError && (
            <Table>
              <thead>
                <tr>
                  <Th>유형</Th>
                  <Th>게시글/댓글</Th>
                  <Th>신고자</Th>
                  <Th>사유</Th>
                  <Th>일시</Th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map((c) => (
                  <Tr key={c.id}>
                    <Td>{c.post ? '게시글' : '댓글'}</Td>
                    <Td>
                      {c.post ? (
                        <span>[{c.post.id.slice(-4)}] {c.post.title}</span>
                      ) : c.comment ? (
                        <span>[{c.comment.id.slice(-4)}] {c.comment.content.slice(0, 20)}...</span>
                      ) : '-'}
                    </Td>
                    <Td>{c.reporter ? `${c.reporter.nickname} (${c.reporter.email})` : '-'}</Td>
                    <Td>
                      <ReasonBadge>{c.reason}</ReasonBadge>
                      {c.etcReason && <span style={{ marginLeft: 6, color: '#555' }}>({c.etcReason})</span>}
                    </Td>
                    <Td>{new Date(c.createdAt).toLocaleString()}</Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          )}
        </>
      )}

      {activeTab === 'posts' && (
        <>
          <SearchBar>
            <SearchInput
              placeholder="제목, 작성자 검색"
              value={postSearch}
              onChange={e => setPostSearch(e.target.value)}
            />
            <SearchButton onClick={() => {}}>검색</SearchButton>
          </SearchBar>
          {postsLoading && <div>로딩 중...</div>}
          {postsError && <div style={{ color: 'red' }}>{postsError}</div>}
          {!postsLoading && !postsError && (
            <Table>
              <thead>
                <tr>
                  <Th>제목</Th>
                  <Th>작성자</Th>
                  <Th>작성일</Th>
                  <Th>조회수</Th>
                  <Th>관리</Th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((p) => (
                  <Tr key={p.id}>
                    <Td>{p.title}</Td>
                    <Td>{p.author?.nickname || '-'}</Td>
                    <Td>{new Date(p.createdAt).toLocaleString()}</Td>
                    <Td>{typeof p.viewCount === 'number' ? p.viewCount : '-'}</Td>
                    <Td>
                      <DeleteButton onClick={() => handleDeletePost(p.id)} disabled={deletingPostId === p.id}>
                        {deletingPostId === p.id ? '삭제 중...' : '삭제'}
                      </DeleteButton>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          )}
        </>
      )}
    </PageLayout>
  );
};

export default CommunityAdmin; 