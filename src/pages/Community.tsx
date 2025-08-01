// src/pages/Community.tsx
import React, { useState } from "react";
import type { KeyboardEvent } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import axiosInstance from "../api/axios"; // 우리 백엔드용 axios 인스턴스
import LeftActive from '../assets/DirectionLeftActive.svg?url';
import LeftInactive from '../assets/DirectionLeftInactive.svg?url';
import RightActive from '../assets/DirectionRightActive.svg?url';
import RightInactive from '../assets/DirectionRightInactive.svg?url';
import WriteIcon from '../assets/Icon_Write.svg?url';
import LoadingSpinner from '../components/common/LoadingSpinner';
import PostListSkeleton from '../components/common/Skeleton';
import Header from '../components/common/Header';
import { useQuery } from '@tanstack/react-query';

// === 타입 정의 ===
interface PostAuthor {
  nickname: string;
}

interface PostCategory {
  id: string;
  name: string | { text: string };
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
}

type PostsResponse = { posts: Post[]; total: number };

// === Styled Components ===
// 광고 박스 (투명한 여백용)
const AdBox = styled.div`
  width: 100%;
  height: 10rem; 
  background-color: transparent; 
  margin-top: 1rem; 
  border-radius: 0.5rem;
`;

const Container = styled.div`
  background-color:rgb(255, 255, 255);
  min-height: 100vh;
  padding: 1rem 1rem 2rem 1rem; 
  
`;

const CategoryTabs = styled.div`
  display: flex;
  align-items: flex-start; 
  gap: 0.5rem;
  margin-bottom: 1rem;
  overflow-x: auto;
  -ms-overflow-style: none; 
  scrollbar-width: none; 
  &::-webkit-scrollbar {
    display: none; 
  }
`;

const TabButton = styled.button<{ $isActive: boolean }>`
  padding: 0.6rem 1rem;
  font-size: 0.8rem;
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
  background-color: #785CD2;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background-color: #343a40;
  }
`;

const PostListItem = styled.div`
  padding: 1rem 1.2rem;
  border-bottom: 1px solid #f1f3f5;

  &:last-child {
    border-bottom: none;
  }
`;

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
      return '#ced4da'; // 회색
  }
};

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

const FABContainer = styled.div`
  position: fixed;
  right: 1.5rem;
  bottom: 6.5rem;
  z-index: 10;
`;

const FABButton = styled(Link)`
  background: linear-gradient(90deg, #FF69B4 0%, #8A2BE2 100%);
  color: white;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: scale(1.05);
  }
`;


const PaginationBottom = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1.5rem;
  gap: 1rem;
`;

const PaginationButton = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  padding: 0;
  cursor: ${({ $active }) => ($active ? 'pointer' : 'not-allowed')};
  display: flex;
  align-items: center;
  opacity: ${({ $active }) => ($active ? 1 : 0.5)};
`;

const PaginationText = styled.span`
  font-size: 1rem;
  color: #495057;
  font-weight: 600;
`;

const getCategoryName = (name: string | { text: string }): string => {
  return typeof name === 'string' ? name : name.text;
};

// Fetch functions
const fetchPosts = async (categoryId: string | null, search: string, page: number, limit: number): Promise<PostsResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (categoryId) params.append('categoryId', categoryId);
  if (search) params.append('search', search);

  const { data } = await axiosInstance.get(`/community/posts?${params.toString()}`);
  return data;
};

const fetchCategories = async (): Promise<PostCategory[]> => {
  const { data } = await axiosInstance.get('/community/categories');
  return data;
};

const Community: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const limit = 10;

  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  const { data: postsData, isLoading: isPostsLoading } = useQuery({
    queryKey: ['posts', selectedCategory, searchQuery, currentPage],
    queryFn: () => fetchPosts(selectedCategory, searchQuery, currentPage, limit),
  });

  const posts = postsData?.posts || [];
  const totalPosts = postsData?.total || 0;
  const totalPages = Math.ceil(totalPosts / limit);

  const handleSearch = () => {
    setSearchQuery(searchTerm);
    setCurrentPage(1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleCategoryClick = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  return (
    <>
      <Header title="커뮤니티" />
      <Container>
        <CategoryTabs>
          <TabButton 
            $isActive={!selectedCategory} 
            onClick={() => handleCategoryClick(null)}
          >
            전체
          </TabButton>
          {isCategoriesLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', padding: '0.6rem 1rem' }}>
              <LoadingSpinner size={16} fullscreen={false} />
            </div>
          ) : categories?.map(cat => (
            <TabButton
              key={cat.id}
              $isActive={selectedCategory === cat.id}
              onClick={() => handleCategoryClick(cat.id)}
            >
              {getCategoryName(cat.name)}
            </TabButton>
          ))}
        </CategoryTabs>
        
        <SearchBarContainer>
          <SearchInput
            placeholder="제목, 내용, 태그를 검색해보세요." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <SearchButton onClick={handleSearch}>검색</SearchButton>
        </SearchBarContainer>

        {isPostsLoading ? (
          <PostListSkeleton />
        ) : (
          <>
            
              {posts.length > 0 ? posts.map((post: Post) => (
                <PostListItem key={post.id}>
                  <CategoryTag $bgcolor={getCategoryColor(getCategoryName(post.category.name))}>
                    {getCategoryName(post.category.name)}
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
                    <span>{post.author.nickname}</span>
                    <span>·</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span>·</span>
                    <CommentCount>댓글 {post._count?.comments || 0}</CommentCount>
                  </PostMeta>
                </PostListItem>
              )) : (
                <p style={{ color: '#888', textAlign: 'center', padding: '2rem 0' }}>게시글이 없습니다.</p>
              )}
           

            {totalPages > 1 && (
              <PaginationBottom>
                <PaginationButton $active={currentPage > 1} onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}>
                  <img src={currentPage > 1 ? LeftActive : LeftInactive} alt="이전" width={36} />
                </PaginationButton>
                <PaginationText>{currentPage} / {totalPages}</PaginationText>
                <PaginationButton $active={currentPage < totalPages} onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}>
                  <img src={currentPage < totalPages ? RightActive : RightInactive} alt="다음" width={36} />
                </PaginationButton>
              </PaginationBottom>
            )}
          </>
        )}
        
        <AdBox />
        
        <FABContainer>
          <FABButton to="/community/new">
            <img src={WriteIcon} alt="글쓰기" width="24" height="24" />
          </FABButton>
        </FABContainer>

      </Container>
      <NavigationBar />
    </>
  );
};

export default Community;