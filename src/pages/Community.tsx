// src/pages/Community.tsx
import React, { useState } from "react";
import type { KeyboardEvent } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import axiosInstance from "../api/axios"; // 우리 백엔드용 axios 인스턴스
import LeftActive from '../assets/direction=left, status=active, Mirror=True, size=large-3.svg';
import LeftInactive from '../assets/direction=left, status=inactive, Mirror=False, size=large-3.svg';
import RightActive from '../assets/direction=right, status=active, Mirror=True, size=large-3.svg';
import RightInactive from '../assets/direction=right, status=inactive, Mirror=False, size=large-3.svg';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Header from '../components/common/Header';
import { useQuery } from '@tanstack/react-query';
import WriteIcon from '../assets/Icon_Write.svg?react';

// === 타입 정의 ===
// (나중에 src/types/community.ts 같은 파일로 분리하면 좋습니다)
interface PostAuthor {
  nickname: string;
}

interface PostCategory {
  id: string;
  name: string;
}

interface Post {
  id: string;
  title: string;
  author: PostAuthor;
  category: PostCategory;
  createdAt: string;
  _count: {
    comments: number;
  };
  tags?: string[];
  // views, likes는 나중에 추가될 수 있습니다.
  // views: number;
  // likes: number;
}

type PostsResponse = { posts: Post[]; total: number };

// === Styled Components (전면 개편) ===
const Container = styled.div`
  background-color: #f8f9fa; /* 밝은 회색 배경 */
  min-height: 100vh;
  padding: 1rem 1rem 5rem 1rem;
`;

const CategoryTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  overflow-x: auto; /* 모바일에서 스크롤 가능하도록 */
`;

const TabButton = styled.button<{ $isActive: boolean }>`
  padding: 0.6rem 1rem;
  font-size: 0.95rem;
  font-weight: 600;
  border: 1px solid ${props => props.$isActive ? '#FF69B4' : '#ced4da'};
  border-radius: 1.5rem;
  background-color: ${props => props.$isActive ? '#FF69B4' : 'white'};
  color: ${props => props.$isActive ? 'white' : '#495057'};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  flex-shrink: 0;

  &:hover {
    background-color: ${props => props.$isActive ? '#f55aab' : '#e9ecef'};
    border-color: ${props => props.$isActive ? '#f55aab' : '#adb5bd'};
  }
`;

const SearchBarContainer = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  gap: 0.5rem;
`;

const SearchInput = styled.input`
  flex-grow: 1;
  padding: 0.8rem 1rem;
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #FF69B4;
    box-shadow: 0 0 0 2px rgba(255, 105, 180, 0.2);
  }
`;

const SearchButton = styled.button`
  padding: 0 1.2rem;
  background-color: #495057;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background-color: #343a40;
  }
`;

const PostListContainer = styled.div`
  
  
`;

const PostListItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.2rem 1.5rem;
  border-bottom: 1px solid #f1f3f5;
  &:last-child {
    border-bottom: none;
  }
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

// 카테고리별 색상 매핑 함수
const getCategoryColor = (name: string) => {
  switch (name) {
    case '부부관계':
      return '#FF69B4'; // 분홍
    case '결혼생활':
      return '#4F8CFF'; // 파랑
    case '챌린지인증':
      return '#FFA940'; // 주황
    case '찬반토론':
      return '#52C41A'; // 초록
    default:
      return '#f1f3f5'; // 회색
  }
};

const CategoryTag = styled.span<{ $bgcolor: string }>`
  background-color: ${props => props.$bgcolor};
  color: white;
  padding: 0.08rem 0.45rem;
  border-radius: 0.7rem;
  font-size: 0.82rem;
  font-weight: 500;
  line-height: 1.2;
  margin-right: 0.3rem;
`;

const PostTitle = styled(Link)`
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

const PostMeta = styled.div`
  font-size: 0.95rem;
  color: #adb5bd;
  display: flex;
  align-items: center;
  gap: 0.75rem; /* 아이템 간 간격 */
`;

const CommentCount = styled.span`
  color: #FF69B4;
  font-weight: 600;
`;

const FABContainer = styled.div`
  position: fixed;
  right: 1.5rem;
  bottom: 8rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  z-index: 10;
`;

const FABButton = styled.div`
  background: linear-gradient(90deg, #FF69B4 0%, #8A2BE2 100%);
  color: white;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: background 0.2s;
  position: relative;
  &:hover {
    background: linear-gradient(90deg, #f55aab 0%, #7c1fa0 100%);
  }
  svg {
    fill: white;
    stroke: white;
    width: 24px;
    height: 24px;
  }
`;


const PaginationTop = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 0.7rem;
  font-size: 1rem;
  color: #868e96;
`;

const PaginationBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
`;

const PaginationButton = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  padding: 0;
  cursor: ${({ $active }) => ($active ? 'pointer' : 'not-allowed')};
  display: flex;
  align-items: center;
`;

const PaginationText = styled.span`
  font-size: 1.08rem;
  color: #868e96;
  font-weight: 600;
  margin: 0 0.3rem;
`;

// 게시글 목록 fetch 함수
const fetchPosts = async (categoryId: string | null, search: string, page: number, limit: number) => {
  const params: { categoryId?: string; search?: string; page?: number; limit?: number } = { page, limit };
  if (categoryId) params.categoryId = categoryId;
  if (search) params.search = search;
  const response = await axiosInstance.get('/community/posts', { params });
  return response.data;
};

// 카테고리 목록 fetch 함수
const fetchCategories = async () => {
  const res = await axiosInstance.get('/community/categories');
  return [...res.data].sort((a, b) => {
    if (a.name === '찬반토론') return -1;
    if (b.name === '찬반토론') return 1;
    return 0;
  });
};

const Community: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const POSTS_PER_PAGE = 20;

  const {
    data: postsData,
    isLoading: isPostsLoading,
    error: postsError,
  } = useQuery<PostsResponse>({
    queryKey: ['posts', activeCategory, activeSearch, currentPage],
    queryFn: () => fetchPosts(activeCategory, activeSearch, currentPage, POSTS_PER_PAGE),
    placeholderData: (previousData) => previousData,
  });

  const {
    data: categories,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useQuery<PostCategory[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const handleSearch = () => setActiveSearch(searchTerm);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (isPostsLoading || isCategoriesLoading) {
    return (
      <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <LoadingSpinner size={48} />
      </Container>
    );
  }

  if (postsError || categoriesError) {
    return (
      <Container style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <p>데이터를 불러오는 중 오류가 발생했습니다.</p>
        <p style={{ color: 'red', marginTop: '1rem' }}>
          {postsError?.message || categoriesError?.message}
        </p>
      </Container>
    );
  }

  const posts = postsData?.posts || [];
  const totalPosts = postsData?.total || 0;
  const totalPages = Math.max(1, Math.ceil(totalPosts / POSTS_PER_PAGE));

  return (
    <>
      <Header title="커뮤니티" />
      <Container>
        <CategoryTabs>
          <TabButton $isActive={!activeCategory} onClick={() => setActiveCategory(null)}>전체</TabButton>
          {(categories || []).map((cat) => (
            <TabButton
              key={cat.id}
              $isActive={activeCategory === cat.id}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.name}
            </TabButton>
          ))}
        </CategoryTabs>
        <SearchBarContainer>
          <SearchInput
            type="text"
            placeholder="제목, 내용, 태그로 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <SearchButton onClick={handleSearch}>검색</SearchButton>
        </SearchBarContainer>
        <PaginationTop>
          <span>{currentPage} / {totalPages}</span>
          <PaginationButton $active={currentPage > 1} onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}>
            {currentPage > 1 ? <img src={LeftActive} alt="이전" width={36} /> : <img src={LeftInactive} alt="이전" width={36} />}
          </PaginationButton>
          <PaginationButton $active={currentPage < totalPages} onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}>
            {currentPage < totalPages ? <img src={RightActive} alt="다음" width={36} /> : <img src={RightInactive} alt="다음" width={36} />}
          </PaginationButton>
        </PaginationTop>
        <PostListContainer>
          {isPostsLoading && <LoadingSpinner size={48} />}
          {postsError && <p style={{ color: 'red' }}>{String(postsError)}</p>}
          {!isPostsLoading && !postsError && (
            posts.length > 0 ? posts.map((post: Post) => (
              <PostListItem key={post.id}>
                <PostHeader>
                  <CategoryTag $bgcolor={getCategoryColor(post.category.name)}>{post.category.name}</CategoryTag>
                  <PostTitle to={`/community/${post.id}`}>{post.title}</PostTitle>
                </PostHeader>
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
                    {post.tags.map((tag: string) => (
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
                <PostMeta>
                  <span>{post.author.nickname}</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  <CommentCount>댓글 {post._count?.comments || 0}</CommentCount>
                </PostMeta>
              </PostListItem>
            )) : <p style={{ color: '#888', textAlign: 'center', margin: '2rem 0' }}>게시글이 없습니다.</p>
          )}
        </PostListContainer>
        <PaginationBottom>
          <PaginationButton $active={currentPage > 1} onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}>
            {currentPage > 1 ? <img src={LeftActive} alt="이전" width={36} /> : <img src={LeftInactive} alt="이전" width={36} />}
          </PaginationButton>
          <PaginationText>{currentPage} / {totalPages}</PaginationText>
          <PaginationButton $active={currentPage < totalPages} onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}>
            {currentPage < totalPages ? <img src={RightActive} alt="다음" width={36} /> : <img src={RightInactive} alt="다음" width={36} />}
          </PaginationButton>
        </PaginationBottom>
        <FABContainer onClick={() => navigate('/community/new')}>
          <FABButton><WriteIcon /></FABButton>
        </FABContainer>
      </Container>
      <NavigationBar />
    </>
  );
};

export default Community;