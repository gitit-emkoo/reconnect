import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import axiosInstance from "../api/axios";
import Tagify from '@yaireo/tagify/react';
import '@yaireo/tagify/dist/tagify.css';
import CustomRichTextEditor from '../components/common/CustomRichTextEditor';

// === 타입 정의 ===
interface Category {
  id: string;
  name: string;
}

// === Styled Components (전면 개편) ===
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

const TagInputWrapper = styled.div`
  margin: 1rem 0;
  width: 100%;
  .tagify {
    width: 100%;
    min-width: 0;
    border-radius: 0.5rem;
    border: 1px solid #eee;
    background: #fafbfc;
    font-size: 1rem;
    box-shadow: none;
    padding: 0.5rem 0.7rem;
  }
  .tagify__input {
    min-width: 0;
    width: 100%;
    font-size: 1rem;
    color: #495057;
  }
  .tagify__input::placeholder {
    color: #adb5bd;
    opacity: 1;
  }
`;

const EditorDivider = styled.hr`
  border: none;
  border-top: 1px solid #eee;
  margin: 2rem 0 1.2rem 0;
`;

const PostWritePage: React.FC = () => {
    const navigate = useNavigate();
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [tags, setTags] = useState<string[]>([]);
    // 커스텀 에디터 상태
    const [editorTitle, setEditorTitle] = useState('');
    const [editorContent, setEditorContent] = useState('');

    // 카테고리 목록 불러오기
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axiosInstance.get('/community/categories');
                setCategories(res.data);
                if (res.data.length > 0) setCategoryId(res.data[0].id);
            } catch (e) {
                setCategories([]);
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        try {
            const safeTags = Array.isArray(tags) ? tags : [];
            await axiosInstance.post('/community/posts', {
                title: editorTitle,
                content: editorContent,
                categoryId,
                tags: safeTags,
            });
            // 글 등록 성공 시 임시저장 삭제
            localStorage.removeItem('custom_rich_text_editor_draft_new');
            navigate('/community');
        } catch (err: any) {
            setError('글 등록에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Container>
                <Header>
                  <PageTitle>새 글 작성</PageTitle>
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
                    <TagInputWrapper>
                        <Tagify
                            settings={{
                              whitelist: [],
                              maxTags: 5,
                              dropdown: { enabled: 0 },
                              placeholder: '태그를 입력하세요 (예: #소통, #공감)',
                              enforceWhitelist: false,
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
                    </TagInputWrapper>
                    
                    {/* 커스텀 리치 텍스트 에디터 */}
                    <CustomRichTextEditor
                        onTitleChange={setEditorTitle}
                        onContentChange={setEditorContent}
                        draftKey="custom_rich_text_editor_draft_new"
                    />
                    {error && <p style={{ color: 'red', textAlign: 'right', marginTop: '0.5rem' }}>{error}</p>}
                    <EditorDivider />
                    <ButtonContainer>
                      <SubmitButton type="submit" disabled={isSubmitting}>
                          {isSubmitting ? '등록 중...' : '등록하기'}
                      </SubmitButton>
                    </ButtonContainer>
                </Form>
            </Container>
            <NavigationBar />
        </>
    );
};

export default PostWritePage; 