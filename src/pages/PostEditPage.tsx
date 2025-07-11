import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import axiosInstance from "../api/axios";
import Tagify from '@yaireo/tagify/react';
import '@yaireo/tagify/dist/tagify.css';
import CustomRichTextEditor from '../components/common/CustomRichTextEditor';
import LoadingSpinner from '../components/common/LoadingSpinner';

interface Category {
  id: string;
  name: string;
}

const Container = styled.div`
  background-color: #f8f9fa;
  min-height: 100vh;
  padding: 1.5rem 1rem 5rem 1rem;
`;
const Header = styled.div`
  margin-bottom: 1.5rem;
`;
const PageTitle = styled.h1`
  font-size: 2rem;
  color: #212529;
  font-weight: 700;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;
const FormRow = styled.div`
  display: flex;
  gap: 1rem;
`;
const Select = styled.select`
  padding: 0.8rem 1rem;
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
  font-size: 1rem;
  color: #495057;
  flex-basis: 30%;
  &:focus {
    outline: none;
    border-color: #FF69B4;
    box-shadow: 0 0 0 2px rgba(255, 105, 180, 0.2);
  }
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
`;
const SubmitButton = styled.button`
  background-color: #495057;
  color: white;
  padding: 0.8rem 2rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
  &:hover {
    background-color: #343a40;
  }
  &:disabled {
    background-color: #ced4da;
    cursor: not-allowed;
  }
`;

const PostEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [editorTitle, setEditorTitle] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [loading, setLoading] = useState(true);

  // 카테고리 목록 불러오기
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

  // 기존 글 데이터 불러오기
  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/community/posts/${id}`);
        const post = res.data;
        setEditorTitle(post.title);
        setEditorContent(post.content);
        setCategoryId(post.category?.id || '');
        setTags(post.tags || []);
      } catch (e) {
        setError('글 정보를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const safeTags = Array.isArray(tags) ? tags : [];
      await axiosInstance.patch(`/community/posts/${id}`, {
        title: editorTitle,
        content: editorContent,
        categoryId,
        tags: safeTags,
      });
      navigate(`/community/${id}`);
    } catch (err: any) {
      setError('글 수정에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <Container>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <LoadingSpinner size={48} fullscreen={false} />
      </div>
    </Container>
  );
  if (error) return <Container><p style={{ color: 'red' }}>{error}</p></Container>;

  return (
    <>
      <Container>
        <Header>
          <PageTitle>글 수정</PageTitle>
        </Header>
        <Form onSubmit={handleSubmit}>
          <FormRow>
            <Select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </Select>
          </FormRow>
          <div style={{ margin: '1rem 0' }}>
            <Tagify
              settings={{
                whitelist: [],
                maxTags: 5,
                dropdown: { enabled: 0 }
              }}
              inputProps={{
                placeholder: '태그를 입력하세요 (예: #소통, #공감)'
              }}
              value={tags}
              onChange={(e: CustomEvent) => {
                try {
                  const val = JSON.parse((e.detail as any).value);
                  if (Array.isArray(val)) {
                    const tagArr = val.map((t: any) => t.value);
                    setTags(tagArr);
                  } else {
                    setTags([]);
                  }
                } catch (err) {
                  setTags([]);
                }
              }}
            />
            <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.3rem' }}>
              태그는 최대 5개까지 입력할 수 있습니다.
            </div>
          </div>
          {/* 커스텀 리치 텍스트 에디터 */}
          <CustomRichTextEditor
            onTitleChange={setEditorTitle}
            onContentChange={setEditorContent}
            initialTitle={editorTitle}
            initialContent={editorContent}
            draftKey={`custom_rich_text_editor_draft_edit_${id || ''}`}
          />
          {error && <p style={{ color: 'red', textAlign: 'right', marginTop: '0.5rem' }}>{error}</p>}
          <ButtonContainer>
            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? <LoadingSpinner size={20} fullscreen={false} /> : '수정하기'}
            </SubmitButton>
          </ButtonContainer>
        </Form>
      </Container>
      <NavigationBar />
    </>
  );
};

export default PostEditPage; 