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

// 타입 정의
interface Draft {
  title: string;
  content: string;
}

export interface CustomEditorRef {
  insertImages: (urls: string[]) => void;
}

export interface CustomRichTextEditorProps {
  onTitleChange?: (title: string) => void;
  onContentChange?: (content: string) => void;
  initialTitle?: string;
  initialContent?: string;
  draftKey?: string;
}


// Styled Components
const EditorWrapper = styled.div`
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  padding: 20px 16px 12px 16px;
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
`;
const ToolButton = styled.button`
  background: transparent;
  color: #495057;
  border: none;
  border-radius: 4px;
  padding: 4px 7px;
  cursor: pointer;
  &:hover { background: #f1f3f5; }
`;
const EditorArea = styled.div`
  min-height: 160px;
  padding: 12px;
  outline: none;
`;
const Placeholder = styled.div`
  position: absolute;
  color: #adb5bd;
  pointer-events: none;
`;
const HiddenInput = styled.input`
  display: none;
`;

const format = (command: string, value?: string) => {
  document.execCommand(command, false, value);
};

const CustomRichTextEditor = forwardRef<CustomEditorRef, CustomRichTextEditorProps>(
  ({ onTitleChange, onContentChange, initialTitle = '', initialContent = '', draftKey = 'new' }, ref) => {
  
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [draftToLoad, setDraftToLoad] = useState<Draft | null>(null);
  const token = useAuthStore((state: any) => state.token);
  const finalDraftKey = `custom_rich_text_editor_draft_${draftKey}`;

  const saveDraft = useCallback(() => {
    if (onTitleChange || onContentChange) {
      const html = editorRef.current?.innerHTML || '';
      localStorage.setItem(finalDraftKey, JSON.stringify({ title, content: html }));
    }
  }, [title, finalDraftKey, onTitleChange, onContentChange]);

  useEffect(() => {
    const interval = setInterval(saveDraft, 3000);
    return () => clearInterval(interval);
  }, [saveDraft]);

  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle]);

  useEffect(() => {
    setContent(initialContent);
    if (editorRef.current && editorRef.current.innerHTML !== initialContent) {
      editorRef.current.innerHTML = initialContent;
    }
  }, [initialContent]);

  useEffect(() => {
    if (draftKey === 'new') {
      const draft = localStorage.getItem(finalDraftKey);
      if (draft) {
        const parsed = JSON.parse(draft);
        if (parsed.title || parsed.content) {
          setDraftToLoad(parsed);
          setShowDraftModal(true);
        }
      }
    }
  }, [finalDraftKey, draftKey]);

  const handleLoadDraft = () => {
    if (draftToLoad) {
      setTitle(draftToLoad.title);
      setContent(draftToLoad.content);
      if (editorRef.current) editorRef.current.innerHTML = draftToLoad.content;
    }
    setShowDraftModal(false);
  };

  const handleFormat = (cmd: string, value?: string) => {
    format(cmd, value);
    editorRef.current?.focus();
  };
  
  const insertImagesCallback = useCallback(() => {
      // ... (logic to insert images)
  }, []);

  useImperativeHandle(ref, () => ({ insertImages: insertImagesCallback }), [insertImagesCallback]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newContent = (e.target as HTMLDivElement).innerHTML;
    setContent(newContent);
    if (onContentChange) onContentChange(newContent);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if(onTitleChange) onTitleChange(newTitle);
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const formData = new FormData();
    for(let i=0; i < files.length; i++) formData.append('images', files[i]);
    
    try {
        const res = await axiosInstance.post('/community/posts/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
        });
        if(res.data && Array.isArray(res.data)) {
            res.data.forEach((url: string) => format('insertImage', url));
        }
    } catch(err) {
        console.error('Image upload failed', err);
    }
  };

  return (
    <>
      <EditorWrapper>
        {onTitleChange && (
            <TitleInput
            placeholder="제목을 입력하세요"
            value={title}
            onChange={handleTitleChange}
            />
        )}
        <Toolbar>
            <ToolButton onClick={() => handleFormat('bold')}><IconBold/></ToolButton>
            <ToolButton onClick={() => handleFormat('italic')}><IconItalic/></ToolButton>
            <ToolButton onClick={() => handleFormat('underline')}><IconUnderline/></ToolButton>
            <ToolButton onClick={() => handleFormat('justifyLeft')}><IconAlignLeft/></ToolButton>
            <ToolButton onClick={() => handleFormat('justifyCenter')}><IconAlignCenter/></ToolButton>
            <ToolButton onClick={() => handleFormat('justifyRight')}><IconAlignRight/></ToolButton>
            <ToolButton onClick={() => fileInputRef.current?.click()}>🖼️</ToolButton>
        </Toolbar>
        <div style={{position: 'relative'}}>
            <EditorArea ref={editorRef} contentEditable onInput={handleInput} />
            {(!content || content === '<br>') && <Placeholder>내용을 입력하세요</Placeholder>}
        </div>
        <HiddenInput ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} multiple />
      </EditorWrapper>
      <ConfirmationModal
        isOpen={showDraftModal}
        onRequestClose={() => setShowDraftModal(false)}
        onConfirm={handleLoadDraft}
        title="임시저장된 글"
        message="작성중이던 글이 있습니다. 불러오시겠습니까?"
      />
    </>
  );
});

export default CustomRichTextEditor;