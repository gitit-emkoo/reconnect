import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import NavigationBar from "../components/NavigationBar";
import axiosInstance from "../api/axios";
import Tagify from '@yaireo/tagify/react';
import '@yaireo/tagify/dist/tagify.css';

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

const Input = styled.input`
  padding: 0.8rem 1rem;
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
  font-size: 1rem;
  color: #495057;
  flex-grow: 1;
  &:focus {
    outline: none;
    border-color: #FF69B4;
    box-shadow: 0 0 0 2px rgba(255, 105, 180, 0.2);
  }
`;

const EditorWrapper = styled.div`
  margin-top: 0.5rem;
  .toastui-editor-defaultUI {
    border-radius: 0.5rem;
    border-color: #dee2e6;
  }
  .toastui-editor-defaultUI:focus-within {
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

const PostWritePage: React.FC = () => {
    const navigate = useNavigate();
    const editorRef = useRef<Editor>(null);
    const [title, setTitle] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [tags, setTags] = useState<string[]>([]);

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
            const content = editorRef.current?.getInstance().getHTML() || '';
            const safeTags = Array.isArray(tags) ? tags : [];
            console.log('글 등록 요청 데이터:', { title, content, categoryId, tags: safeTags });
            await axiosInstance.post('/community/posts', {
                title,
                content,
                categoryId,
                tags: safeTags,
            });
            navigate('/community');
        } catch (err: any) {
            setError('글 등록에 실패했습니다.');
            console.log('글 등록 에러:', err);
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
                      <Input 
                          type="text" 
                          placeholder="제목을 입력하세요" 
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                      />
                    </FormRow>
                    
                    <div style={{ margin: '1rem 0' }}>
                        <Tagify
                            settings={{
                                whitelist: [],
                                maxTags: 5,
                                dropdown: {
                                    enabled: 0
                                },
                                placeholder: '태그를 입력하세요 (예: #소통, #공감)'
                            }}
                            value={tags}
                            onChange={(e: CustomEvent) => {
                                try {
                                    const val = JSON.parse((e.detail as any).value);
                                    if (Array.isArray(val)) {
                                        const tagArr = val.map((t: any) => t.value);
                                        console.log('Tagify onChange - 태그 배열:', tagArr);
                                        setTags(tagArr);
                                    } else {
                                        console.log('Tagify onChange - 빈 배열');
                                        setTags([]);
                                    }
                                } catch (err) {
                                    console.log('Tagify onChange - 파싱 에러:', err);
                                    setTags([]);
                                }
                            }}
                        />
                        <div style={{ fontSize: '0.4rem', color: '#888', marginTop: '0.3rem' }}>
                            태그는 최대 5개까지 입력할 수 있습니다.
                        </div>
                    </div>

                    <EditorWrapper>
                      <Editor
                          ref={editorRef}
                          initialValue=" "
                          previewStyle="vertical"
                          height="400px"
                          initialEditType="wysiwyg"
                          useCommandShortcut={true}
                          language="ko-KR"
                      />
                    </EditorWrapper>

                    {error && <p style={{ color: 'red', textAlign: 'right', marginTop: '0.5rem' }}>{error}</p>}
                    
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