// src/pages/Community.tsx
import React, { useEffect, useState } from "react";
import type { KeyboardEvent } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import axiosInstance from "../api/axios"; // 우리 백엔드용 axios 인스턴스
import axios from "axios"; // Axios 에러 타입 확인을 위해 import

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
  viewCount?: number;
  // views, likes는 나중에 추가될 수 있습니다.
  // views: number;
  // likes: number;
}

// === Styled Components (전면 개편) ===
const Container = styled.div`
  background-color: #f8f9fa; /* 밝은 회색 배경 */
  min-height: 100vh;
  padding: 1rem 1rem 5rem 1rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  color: #343a40;
  font-weight: 700;
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
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
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

const CategoryTag = styled.span`
  background-color: #f1f3f5;
  color: #868e96;
  padding: 0.2rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
`;

const PostTitle = styled(Link)`
  font-size: 1.1rem;
  font-weight: 600;
  color: #212529;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const PostMeta = styled.div`
  font-size: 0.85rem;
  color: #868e96;
  display: flex;
  align-items: center;
  gap: 0.75rem; /* 아이템 간 간격 */
`;

const CommentCount = styled.span`
  color: #FF69B4;
  font-weight: 600;
`;

const ViewCount = styled.span`
  color: #868e96;
  font-size: 0.95rem;
  margin-left: 0.5rem;
`;

const FABContainer = styled.div`
  position: fixed;
  right: 1.5rem;
  bottom: 5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  z-index: 10;
`;

const FABButton = styled.div`
  background-color: #FF69B4; /* 분홍색 */
  color: white;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f55aab;
  }
`;

const FABLabel = styled.span`
  margin-top: 0.25rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #555;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 2px 8px;
  border-radius: 5px;
`;

const TagBadge = styled.span`
  display: inline-block;
  background: #ffe0f0;
  color: #d63384;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 0.75rem;
  padding: 0.15rem 0.7rem;
  margin-right: 0.3rem;
  margin-top: 0.3rem;
`;

const Community: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<PostCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 입력을 위한 상태
  const [activeSearch, setActiveSearch] = useState(''); // 실제 검색 트리거를 위한 상태

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get('/community/categories');
        setCategories(res.data);
      } catch (e) {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const params: { categoryId?: string; search?: string } = {};
        if (selectedCategory) params.categoryId = selectedCategory;
        if (activeSearch) params.search = activeSearch;

        console.log("게시글 목록 요청. params:", params);
        const response = await axiosInstance.get('/community/posts', { params });
        console.log("게시글 목록 응답 데이터:", response.data);
        setPosts(response.data);
      } catch (err) {
        setError("게시글을 불러오는 중 오류가 발생했습니다.");
        console.error("게시글 목록 로딩 실패 에러:", err);
        if (axios.isAxiosError(err)) {
          console.error("Axios 에러 상세 응답:", err.response?.data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [selectedCategory, activeSearch]); // activeSearch가 바뀔 때마다 실행

  const handleSearch = () => {
    setActiveSearch(searchTerm);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      <Container>
        <Header>
          <Title>커뮤니티</Title>
        </Header>

        <CategoryTabs>
          <TabButton $isActive={!selectedCategory} onClick={() => setSelectedCategory(null)}>전체</TabButton>
          {categories.map(cat => (
            <TabButton 
              key={cat.id} 
              $isActive={selectedCategory === cat.id}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
            </TabButton>
          ))}
        </CategoryTabs>

        <SearchBarContainer>
          <SearchInput 
            type="text"
            placeholder="제목, 내용으로 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <SearchButton onClick={handleSearch}>검색</SearchButton>
        </SearchBarContainer>
        
        <PostListContainer>
          {loading && <p>게시글을 불러오는 중...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {!loading && !error && (
            posts.length > 0 ? posts.map(post => (
              <PostListItem key={post.id}>
                <PostHeader>
                  <CategoryTag>{post.category.name}</CategoryTag>
                  <PostTitle to={`/community/${post.id}`}>{post.title}</PostTitle>
                </PostHeader>
                <PostMeta>
                  <span>{post.author.nickname}</span>
                  <span>·</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  <span>·</span>
                  <span>댓글 <CommentCount>{post._count.comments}</CommentCount></span>
                  {/* 조회수 표시 */}
                  {typeof post.viewCount === 'number' && (
                    <ViewCount>조회수 {post.viewCount}</ViewCount>
                  )}
                </PostMeta>
                {/* 태그 뱃지 표시 */}
                {post.tags && post.tags.length > 0 && (
                  <div style={{ marginTop: '0.5rem' }}>
                    {post.tags.map((tag, idx) => (
                      <TagBadge key={idx}>#{tag}</TagBadge>
                    ))}
                  </div>
                )}
              </PostListItem>
            )) : <p>아직 작성된 글이 없습니다.</p>
          )}
        </PostListContainer>
        
        <FABContainer onClick={() => navigate('/community/new')}>
          <FABButton>+</FABButton>
          <FABLabel>글쓰기</FABLabel>
        </FABContainer>

      </Container>
      <NavigationBar />
    </>
  );
};

export default Community;