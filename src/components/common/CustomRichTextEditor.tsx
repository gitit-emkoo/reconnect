import React, { useRef, useState, useEffect, useImperativeHandle, forwardRef, useCallback } from 'react';
import styled from 'styled-components';
import ConfirmationModal from './ConfirmationModal';
import { ReactComponent as IconBold } from '../../assets/icon_bold.svg';
import { ReactComponent as IconItalic } from '../../assets/icon_italic.svg';
import { ReactComponent as IconUnderline } from '../../assets/icon_underline.svg';
import { ReactComponent as IconAlignLeft } from '../../assets/icon_alignment_left.svg';
import { ReactComponent as IconAlignCenter } from '../../assets/icon_alignment_center.svg';
import { ReactComponent as IconAlignRight } from '../../assets/icon_alignment_right.svg';

// 타입 정의
interface Draft {
  title: string;
  content: string;
}

export interface CustomEditorRef {
  // insertImages 기능 제거
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

  @media (max-width: 768px) {
    padding: 12px 10px;
  }
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

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 8px;
  }

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

  @media (max-width: 768px) {
    gap: 4px;
    flex-wrap: wrap;
  }
`;
const ToolButton = styled.button`
  background: transparent;
  color: #495057;
  border: none;
  border-radius: 4px;
  padding: 4px 7px;
  cursor: pointer;
  
  svg {
    width: 18px;
    height: 18px;
  }

  &:hover { background: #f1f3f5; }
`;
const EditorContainer = styled.div`
  position: relative;
`;
const EditorArea = styled.div`
  min-height: 160px;
  padding: 12px;
  outline: none;
  line-height: 1.6;
  font-size: 0.95rem;

  @media (max-width: 768px) {
    min-height: 120px;
    padding: 8px;
    font-size: 0.9rem;
  }
`;
const Placeholder = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  color: #adb5bd;
  pointer-events: none;

  @media (max-width: 768px) {
    top: 8px;
    left: 8px;
  }
`;

const format = (command: string, value?: string) => {
  document.execCommand(command, false, value);
};

const CustomRichTextEditor = forwardRef<CustomEditorRef, CustomRichTextEditorProps>(
  ({ onTitleChange, onContentChange, initialTitle = '', initialContent = '', draftKey = 'new' }, ref) => {
  
  const editorRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [draftToLoad, setDraftToLoad] = useState<Draft | null>(null);
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

  useImperativeHandle(ref, () => ({}), []);

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
        </Toolbar>
        <EditorContainer>
            <EditorArea ref={editorRef} contentEditable onInput={handleInput} />
            {(!content || content === '<br>') && <Placeholder>내용을 입력하세요</Placeholder>}
        </EditorContainer>
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