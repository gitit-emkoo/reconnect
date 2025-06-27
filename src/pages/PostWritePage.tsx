import React, { useState, useEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import axiosInstance from "../api/axios";
import Tagify from '@yaireo/tagify/react';
import '@yaireo/tagify/dist/tagify.css';
import CustomRichTextEditor from '../components/common/CustomRichTextEditor';
import type { CustomEditorRef } from '../types/editor';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthStore from "../store/authStore";

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

  @media (max-width: 768px) {
    padding: 1rem 1rem 6rem 1rem;
  }
`;

const Header = styled.div`
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

const PageTitle = styled.h1`
  font-size: 1.8rem;
  color: #212529;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
    gap: 1rem;
  }
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.8rem;
  }
`;

const Select = styled.select`
  padding: 0.8rem 1rem;
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  flex-basis: 200px;
  min-width: 200px;
  max-width: 100%;
  background-color: white;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.7rem center;
  background-size: 1em;
  padding-right: 2.5rem;

  &:focus {
    outline: none;
    border-color: #FF69B4;
    box-shadow: 0 0 0 2px rgba(255, 105, 180, 0.2);
  }

  @media (max-width: 768px) {
    width: 100%;
    flex-basis: auto;
    min-width: 0;
    font-size: 0.9rem;
    padding: 0.6rem 2.5rem 0.6rem 0.8rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end; /* 데스크탑에서는 오른쪽 정렬 유지 */
  gap: 0.8rem;
  

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
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

  @media (max-width: 768px) {
    width: 100%;
    padding: 0.9rem;
    font-size: 0.95rem;
  }

  &:hover {
    background-color: #343a40;
  }

  &:disabled {
    background-color: #ced4da;
    cursor: not-allowed;
  }
`;

const TagInputWrapper = styled.div`
  flex: 1;
  min-width: 0;
  width: 100%;

  @media (max-width: 768px) {
    width: 100%;
    flex: none;
  }

  .tagify {
    width: 100%;
    min-width: 0;
    border-radius: 0.5rem;
    border: 1px solid #eee;
    background: #fafbfc;
    font-size: 1rem;
    box-shadow: none;
    padding: 0.5rem 0.7rem;

    @media (max-width: 768px) {
      width: 100%;
      font-size: 0.95rem;
      padding: 0.4rem 0.6rem;
    }
  }
  .tagify__input {
    min-width: 0;
    width: 100%;
    font-size: 1rem;
    color: #495057;
    
    @media (max-width: 768px) {
      font-size: 0.9rem;
    }
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

const PollOptionInput = styled.input`
  width: 90px;
  min-width: 60px;
  max-width: 120px;
  padding: 0.5rem 0.6rem;
  font-size: 1rem;
  border-radius: 0.4rem;
  border: 1px solid #eee;
  text-align: center;
  box-sizing: border-box;
`;

const PostWritePage: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const token = useAuthStore((state: any) => state.token);
    const editorRef = useRef<CustomEditorRef>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    // 커스텀 에디터 상태
    const [editorTitle, setEditorTitle] = useState('');
    const [editorContent, setEditorContent] = useState('');
    // 찬반토론 투표 상태
    const [pollQuestion, setPollQuestion] = useState('');
    const [pollOptions, setPollOptions] = useState([
      { option: '찬성', votes: 0 },
      { option: '반대', votes: 0 },
    ]);

    // 글 등록 mutation
    const { mutate: createPost, isPending: isSubmitting, error } = useMutation({
      mutationFn: (postData: any) => 
        axiosInstance.post('/community/posts', postData),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['posts'] });
        localStorage.removeItem('custom_rich_text_editor_draft_new');
        navigate('/community');
      },
      onError: (err: any) => {
        // 에러 처리는 여기서
        console.error("글 등록 실패:", err);
      }
    });

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

    // 카테고리 id로 이름 찾기
    const selectedCategoryName = useMemo(() => {
      return categories.find(cat => cat.id === categoryId)?.name || '';
    }, [categories, categoryId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const isPoll = selectedCategoryName === '찬반토론';
        const safeTags = Array.isArray(tags) ? tags : [];
        const postData: any = {
          title: editorTitle,
          content: editorContent,
          categoryId,
          tags: safeTags,
          isPollCategory: isPoll,
        };
        if (isPoll) {
          postData.poll = {
            question: pollQuestion,
            options: pollOptions.map(opt => opt.option),
          };
        }
        console.log('postData', postData);
        createPost(postData);
    };

    // react-polls용 투표 옵션 변경 핸들러
    const handlePollOptionChange = (idx: number, value: string) => {
      setPollOptions(opts => opts.map((opt, i) => i === idx ? { ...opt, option: value } : opt));
    };

    // 이미지 업로드 핸들러
    const handleImageAttach = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;
  
      const formData = new FormData();
      for (const file of files) {
        formData.append('images', file);
      }
  
      try {
        const res = await axiosInstance.post('/community/posts/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (editorRef.current && Array.isArray(res.data) && res.data.length > 0) {
          editorRef.current.insertImages(res.data);
        }
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
        alert('이미지 업로드에 실패했습니다.');
      } finally {
        // 입력 값 초기화
        if(e.target) e.target.value = '';
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
                    
                    {/* 커스텀 리치 텍스트 에디터 */}
                    <CustomRichTextEditor
                        ref={editorRef}
                        onTitleChange={setEditorTitle}
                        onContentChange={setEditorContent}
                        draftKey="custom_rich_text_editor_draft_new"
                    />
                    {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '0.5rem' }}>제목과 본문을 모두 작성해주세요.</p>}
                    <EditorDivider />
                    {/* 찬반토론 카테고리일 때만 투표 입력 UI */}
                    {selectedCategoryName === '찬반토론' && (
                      <div style={{ margin: '1.2rem 0 1.5rem 0', padding: '1rem', background: '#f8f9fa', borderRadius: '0.5rem' }}>
                        <div style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: '0.7rem', color: '#8A2BE2' }}>투표 항목 (찬반토론)</div>
                        <input
                          type="text"
                          value={pollQuestion}
                          onChange={e => setPollQuestion(e.target.value)}
                          placeholder="투표 질문을 입력하세요 (예: 이 정책에 찬성하십니까?)"
                          style={{ width: '100%', fontSize: '1rem', padding: '0.6rem', borderRadius: '0.4rem', border: '1px solid #eee', marginBottom: '0.7rem' }}
                        />
                        <div style={{ display: 'flex', gap: '0.7rem' }}>
                          {pollOptions.map((opt, idx) => (
                            <PollOptionInput
                              key={idx}
                              type="text"
                              value={opt.option}
                              onChange={e => handlePollOptionChange(idx, e.target.value)}
                            />
                          ))}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#888', marginTop: '0.5rem' }}>
                          (기본: 찬성/반대, 선택지명 수정 가능)
                        </div>
                      </div>
                    )}
                    <ButtonContainer>
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
                                태그를 입력해 주세요. 최대 5개까지 입력할 수 있습니다.
                            </div>
                        </TagInputWrapper>
                      <input 
                        type="file" 
                        ref={imageInputRef} 
                        multiple 
                        accept="image/*" 
                        style={{ display: 'none' }}
                        onChange={handleImageAttach}
                      />
                      <SubmitButton type="submit" disabled={isSubmitting}>
                          {isSubmitting ? '등록 중...' : '글 등록'}
                      </SubmitButton>
                    </ButtonContainer>
                </Form>
            </Container>
            <NavigationBar />
        </>
    );
};

export default PostWritePage; 