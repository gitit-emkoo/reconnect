import React, { useRef, useState, useEffect, useImperativeHandle, forwardRef, useCallback } from 'react';
import styled from 'styled-components';
import ConfirmationModal from './ConfirmationModal';
import { ReactComponent as IconBold } from '../../assets/icon_bold.svg';
import { ReactComponent as IconItalic } from '../../assets/icon_italic.svg';
import { ReactComponent as IconUnderline } from '../../assets/icon_underline.svg';
import { ReactComponent as IconAlignLeft } from '../../assets/icon_alignment_left.svg';
import { ReactComponent as IconAlignCenter } from '../../assets/icon_alignment_center.svg';
import { ReactComponent as IconAlignRight } from '../../assets/icon_alignment_right.svg';
import axiosInstance from '../../api/axios';
import useAuthStore from '../../store/authStore';
import type { CustomEditorRef, CustomRichTextEditorProps, Draft } from '../../types/editor';

// Styled Components (화이트톤, 기존 폼과 통일)
const EditorWrapper = styled.div`
  background: #fff;
  border-radius: 8px;
  border: none;
  padding: 20px 16px 12px 16px;
  max-width: 100%;
  box-shadow: none;
  margin: 0;
`;
const TitleInput = styled.input`
  width: 100%;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  background: transparent;
  color: #212529;
  margin-bottom: 12px;
  outline: none;
  padding: 4px 0;
  &::placeholder {
    color: #adb5bd;
    font-weight: 500;
  }
`;
const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  overflow-x: auto;
  white-space: nowrap;
`;
const ToolButton = styled.button<{active?: boolean}>`
  background: ${({active}) => active ? '#e9ecef' : 'transparent'};
  color: #495057;
  border: none;
  border-radius: 4px;
  padding: 4px 7px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.15s;
  &:hover { background: #f1f3f5; }
`;
const EditorArea = styled.div`
  min-height: 160px;
  background: #fff;
  color: #212529;
  border-radius: 6px;
  border: none;
  padding: 12px;
  font-size: 1rem;
  outline: none;
  margin-bottom: 8px;
  white-space: pre-wrap;
  position: relative;
  transition: border 0.15s;
`;
const Placeholder = styled.div`
  position: absolute;
  top: 12px;
  left: 16px;
  color: #adb5bd;
  pointer-events: none;
  font-size: 1rem;
`;


const HiddenInput = styled.input`
  display: none;
`;

// Helper for execCommand
const format = (command: string, value?: string) => {
  document.execCommand(command, false, value);
};

const CustomRichTextEditor = forwardRef<CustomEditorRef, CustomRichTextEditorProps>(({ onTitleChange, onContentChange, initialTitle = '', initialContent = '', draftKey = 'custom_rich_text_editor_draft_new' }, ref) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [draftToLoad, setDraftToLoad] = useState<Draft | null>(null);
  const token = useAuthStore((state: any) => state.token);
  const lastSelection = useRef<Range | null>(null);

  // 임시저장 로직 최적화
  const saveDraft = useCallback(() => {
    const html = editorRef.current?.innerHTML || '';
    localStorage.setItem(draftKey, JSON.stringify({ title, content: html }));
  }, [title, content, draftKey]);

  useEffect(() => {
    const interval = setInterval(saveDraft, 3000);
    return () => clearInterval(interval);
  }, [saveDraft]);

  // 최초 마운트 1회만 초기값 세팅
  const didMount = useRef(false);
  useEffect(() => {
    if (!didMount.current) {
      setTitle(initialTitle);
      setContent(initialContent);
      if (editorRef.current) editorRef.current.innerHTML = initialContent;
      didMount.current = true;
    }
  }, [initialTitle, initialContent]);

  // 새글쓰기에서만 임시저장 불러오기 모달 띄우기
  useEffect(() => {
    if (draftKey === 'custom_rich_text_editor_draft_new') {
      const draft = localStorage.getItem(draftKey);
      if (draft) {
        const { title, content } = JSON.parse(draft);
        if (title || content) {
          setDraftToLoad({ title, content });
          setShowDraftModal(true);
        }
      }
    }
  }, [draftKey]);

  // 모달 핸들러 메모이제이션
  const handleLoadDraft = useCallback(() => {
    if (draftToLoad) {
      setTitle(draftToLoad.title);
      setContent(draftToLoad.content);
      if (editorRef.current) editorRef.current.innerHTML = draftToLoad.content;
    }
    setShowDraftModal(false);
  }, [draftToLoad]);

  const handleIgnoreDraft = useCallback(() => {
    setShowDraftModal(false);
  }, []);

  // 툴바 핸들러 메모이제이션
  const handleFormat = useCallback((cmd: string, value?: string) => {
    format(cmd, value);
    editorRef.current?.focus();
  }, []);

  // 외부에서 이미지 삽입을 위한 핸들 expose
  useImperativeHandle(ref, () => ({
    insertImages: useCallback((urls: string[]) => {
      const editor = editorRef.current;
      if (!editor) return;

      if (lastSelection.current) {
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(lastSelection.current);
      } else {
        editor.focus();
      }
      
      urls.forEach(url => {
        format('insertImage', url);
        const br = document.createElement('br');
        const selection = window.getSelection();
        if (selection?.rangeCount) {
          const range = selection.getRangeAt(0);
          range.insertNode(br);
          range.setStartAfter(br);
          range.collapse(true);
        }
      });
      setContent(editor.innerHTML);
    }, [])
  }), []);

  // 에디터 입력 핸들러 메모이제이션
  const handleInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    setContent((e.target as HTMLDivElement).innerHTML);
  }, []);

  const handleBlur = useCallback(() => {
    const selection = window.getSelection();
    if (selection?.rangeCount) {
      lastSelection.current = selection.getRangeAt(0).cloneRange();
    }
  }, []);

  // 이미지 업로드
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
  
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }
  
    try {
      const res = await axiosInstance.post('/community/posts/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (Array.isArray(res.data) && res.data.length > 0) {
        const editor = editorRef.current;
        if (editor) {
          editor.focus(); // 에디터에 포커스
          res.data.forEach((url: string) => format('insertImage', url));
          setContent(editor.innerHTML); // 내용 업데이트
        }
      }
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다.');
    }
  
    // 입력 값 초기화
    e.target.value = '';
  };

  // 이미지 URL 삽입
  const handleImageUrl = () => {
    const url = prompt('이미지 URL을 입력하세요');
    if (url) handleFormat('insertImage', url);
  };

  // 링크 삽입
  const handleLink = () => {
    const url = prompt('링크 주소를 입력하세요');
    if (url) handleFormat('createLink', url);
  };

  // 정렬
  const handleAlign = (align: 'left'|'center'|'right') => {
    handleFormat('justify' + align.charAt(0).toUpperCase() + align.slice(1));
  };

  // 제목/내용 변경 시 부모로 전달
  useEffect(() => {
    if (onTitleChange) onTitleChange(title);
  }, [title, onTitleChange]);
  useEffect(() => {
    if (onContentChange) onContentChange(content);
  }, [content, onContentChange]);

  return (
    <>
      <EditorWrapper>
        <TitleInput
          placeholder="제목을 입력하세요"
          value={title}
          onChange={e => setTitle(e.target.value)}
          maxLength={60}
        />
        <Toolbar>
          <ToolButton type="button" onClick={() => handleFormat('bold')} title="굵게">
            <IconBold width={20} />
          </ToolButton>
          <ToolButton type="button" onClick={() => handleFormat('italic')} title="이탤릭">
            <IconItalic width={20} />
          </ToolButton>
          <ToolButton type="button" onClick={() => handleFormat('underline')} title="밑줄">
            <IconUnderline width={20} />
          </ToolButton>
          <ToolButton type="button" onClick={() => handleAlign('left')} title="왼쪽 정렬">
            <IconAlignLeft width={20} />
          </ToolButton>
          <ToolButton type="button" onClick={() => handleAlign('center')} title="가운데 정렬">
            <IconAlignCenter width={20} />
          </ToolButton>
          <ToolButton type="button" onClick={() => handleAlign('right')} title="오른쪽 정렬">
            <IconAlignRight width={20} />
          </ToolButton>
          <ToolButton type="button" onClick={() => fileInputRef.current?.click()} title="이미지 업로드">🖼️</ToolButton>
          <ToolButton type="button" onClick={handleImageUrl} title="이미지 URL">🌐</ToolButton>
          <ToolButton type="button" onClick={handleLink} title="링크">🔗</ToolButton>
          <HiddenInput
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </Toolbar>
        <div style={{position: 'relative'}}>
          <EditorArea
            ref={editorRef}
            contentEditable
            spellCheck={false}
            onInput={handleInput}
            onBlur={handleBlur}
            style={{minHeight: 160}}
          />
          {(!content || content === '<br>') && (
            <Placeholder>내용을 적어주세요</Placeholder>
          )}
        </div>
      </EditorWrapper>
      <ConfirmationModal
        isOpen={showDraftModal}
        onRequestClose={handleIgnoreDraft}
        onConfirm={handleLoadDraft}
        title="임시저장 불러오기"
        message="임시저장된 글이 있습니다. 불러올까요?"
        confirmButtonText="예"
        cancelButtonText="아니오"
      />
    </>
  );
});

export default React.memo(CustomRichTextEditor); 