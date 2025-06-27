import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PageLayout from '../components/Layout/PageLayout';
import Header from '../components/common/Header';
import { ADMIN_CONFIG } from '../config/admin';
import useAuthStore from '../store/authStore';
import {
  fetchContents,
  createContent,
  updateContent,
  deleteContent,
} from '../api/content';
import { Content, ContentType } from '../types/content';
import LoadingSpinner from '../components/common/LoadingSpinner';
import CustomRichTextEditor from '../components/common/CustomRichTextEditor';

const AdminContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const ContentList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const ContentCard = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const ContentTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #333;
`;

const ContentTypeChip = styled.span`
  background: #ff6fcb;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  margin-bottom: 8px;
  display: inline-block;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #333;
  font-size: 14px;
`;

const Input = styled.input`
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ variant }) => {
    switch (variant) {
      case 'primary':
        return `
          background: #667eea;
          color: white;
          &:hover { background: #5a6fd8; }
        `;
      case 'danger':
        return `
          background: #dc3545;
          color: white;
          &:hover { background: #c82333; }
        `;
      default:
        return `
          background: #6c757d;
          color: white;
          &:hover { background: #5a6268; }
        `;
    }
  }}
`;

const AddButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 600;
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-start;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
`;

const ContentAdmin: React.FC = () => {
  const [contents, setContents] = useState<Content[]>([]);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const user = useAuthStore((state) => state.user);

  const [formData, setFormData] = useState<Partial<Content>>({
    title: '',
    body: '',
    type: ContentType.ARTICLE,
    isPremium: false,
  });

  useEffect(() => {
    if (user) {
      if (user.email && ADMIN_CONFIG.isAdmin(user.email, user.role)) {
        setIsAuthorized(true);
        loadContents();
      } else {
        window.location.href = '/dashboard';
      }
    }
  }, [user]);

  const loadContents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchContents();
      setContents(data);
    } catch (err) {
      setError('콘텐츠를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (content: Content) => {
    setSelectedContent(content);
    setFormData(content);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelectedContent(null);
    setFormData({
      title: '',
      body: '',
      type: ContentType.ARTICLE,
      isPremium: false,
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (isSaving) return;

    if (!formData.title || !formData.body) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    setIsSaving(true);
    try {
      if (isEditing && selectedContent) {
        await updateContent(selectedContent.id, formData);
      } else {
        await createContent(formData);
      }
      setShowModal(false);
      loadContents();
    } catch (err) {
      alert(`저장에 실패했습니다: ${err}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('정말 이 콘텐츠를 삭제하시겠습니까?')) {
      try {
        await deleteContent(id);
        loadContents();
      } catch (err) {
        alert(`삭제에 실패했습니다: ${err}`);
      }
    }
  };
  
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    setFormData((prev) => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
    }));
  };
  
  const handleBodyChange = (content: string) => {
    setFormData((prev) => ({ ...prev, body: content }));
  };

  if (!user || !isAuthorized) {
    return <LoadingSpinner />;
  }

  return (
    <PageLayout title="콘텐츠 관리">
      <Header title="콘텐츠 관리" />
      <AdminContainer>
        <AddButton onClick={handleAdd}>+ 새 콘텐츠 추가</AddButton>
        {loading && <LoadingSpinner />}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && !error && (
          <ContentList>
            {contents.map((content) => (
              <ContentCard key={content.id} onClick={() => handleEdit(content)}>
                <ContentTypeChip>{content.type}</ContentTypeChip>
                <ContentTitle>{content.title}</ContentTitle>
              </ContentCard>
            ))}
          </ContentList>
        )}
        {showModal && (
          <Modal>
            <ModalContent>
              <h2>{isEditing ? '콘텐츠 수정' : '새 콘텐츠 추가'}</h2>
              <Form onSubmit={(e) => e.preventDefault()}>
                <FormGroup>
                  <Label>제목</Label>
                  <Input
                    name="title"
                    value={formData.title || ''}
                    onChange={handleFormChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>유형</Label>
                  <Select
                    name="type"
                    value={formData.type || 'ARTICLE'}
                    onChange={handleFormChange}
                  >
                    {Object.values(ContentType).map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label>내용</Label>
                   <CustomRichTextEditor
                    initialContent={formData.body || ''}
                    onContentChange={handleBodyChange}
                  />
                </FormGroup>
                <FormGroup>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Input
                      type="checkbox"
                      name="isPremium"
                      checked={formData.isPremium || false}
                      onChange={handleFormChange}
                      style={{ width: 'auto' }}
                    />
                    프리미엄 콘텐츠
                  </label>
                </FormGroup>
              </Form>
              <ButtonGroup>
                {isEditing && selectedContent && (
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(selectedContent.id)}
                  >
                    삭제
                  </Button>
                )}
                <Button onClick={() => setShowModal(false)} disabled={isSaving}>취소</Button>
                <Button variant="primary" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? '저장 중...' : '저장'}
                </Button>
              </ButtonGroup>
            </ModalContent>
          </Modal>
        )}
      </AdminContainer>
    </PageLayout>
  );
};

export default ContentAdmin; 