import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { supportApi, CreateSupportDto, SupportInquiry } from '../api/support';
import ConfirmationModal from '../components/common/ConfirmationModal';
import PageLayout from '../components/Layout/PageLayout';
import SubmitButton from '../components/common/SubmitButton';

// 스타일 컴포넌트 정의 (상단으로 이동)
const FormContainer = styled.div`
  margin: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #785cd2;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const Select = styled.select`
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #785cd2;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const TextArea = styled.textarea`
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  min-height: 120px;
  
  &:focus {
    outline: none;
    border-color: #785cd2;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const InfoSection = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 25px;
`;

const InfoTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
`;

const InfoList = styled.ul`
  list-style: none;
  font-size: 0.8rem;
  padding: 0;
  margin: 0;
`;

const InfoItem = styled.li`
  color: #666;
  margin-bottom: 8px;
  padding-left: 20px;
  position: relative;
  
  &:before {
    content: "•";
    position: absolute;
    left: 0;
    color: #785cd2;
  }
`;


const InquiryContent = styled.div`
  padding: 16px;
  color: #555;
  line-height: 1.6;
`;

const ToggleIcon = styled.span`
  font-size: 1.2rem;
  color: #666;
  margin-left: 1em;
  cursor: pointer;
`;

const InquiryListTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
  padding-top: 30px;
  border-top: 1px solid #e0e0e0;
`;

const LoadingText = styled.div`
  text-align: center;
  color: #666;
  padding: 20px;
`;

const EmptyText = styled.div`
  text-align: center;
  color: #666;
  padding: 20px;
  font-style: italic;
`;

// 개선된 스타일 추가
const InquiryCard = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

const CardTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BadgeAndDate = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7em;
`;

const Badge = styled.span`
  background: #785cd2;
  color: #fff;
  border-radius: 8px;
  padding: 0.2em 0.7em;
  font-size: 0.9em;
  font-weight: 600;
  flex-shrink: 0;
`;

const DateText = styled.span`
  color: #888;
  font-size: 0.95em;
  flex-shrink: 0;
`;

const Title = styled.span`
  font-weight: 500;
  font-size: 1rem;
  color: #222;
  margin-top: 0.7em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const SupportPage: React.FC = () => {
  const [formData, setFormData] = useState<CreateSupportDto>({
    title: '',
    content: '',
    type: 'general',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [inquiries, setInquiries] = useState<SupportInquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedInquiries, setExpandedInquiries] = useState<Set<number>>(new Set());

  const inquiryTypes = [
    { value: 'general', label: '일반 문의' },
    { value: 'technical', label: '기술 문의' },
    { value: 'billing', label: '결제 문의' },
    { value: 'feature_request', label: '기능 요청' },
    { value: 'bug_report', label: '버그 신고' },
  ];

  // 내 문의내역 조회
  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const data = await supportApi.getMyInquiries();
      setInquiries(data);
    } catch (error) {
      console.error('문의내역 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 문의내역 조회
  useEffect(() => {
    fetchInquiries();
  }, []);

  // 문의내역 토글
  const toggleInquiry = (id: number) => {
    const newExpanded = new Set(expandedInquiries);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedInquiries(newExpanded);
  };

  // 문의 유형 한글 변환
  const getTypeLabel = (type: string) => {
    const typeMap = inquiryTypes.find(t => t.value === type);
    return typeMap ? typeMap.label : type;
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await supportApi.createInquiry(formData);
      setShowSuccessModal(true);
      setFormData({
        title: '',
        content: '',
        type: 'general',
      });
      // 문의 생성 후 문의내역 새로고침
      fetchInquiries();
    } catch (error) {
      console.error('문의 전송 실패:', error);
      alert('문의 전송에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout title="고객지원" showBackButton={true}>
      <FormContainer>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>문의 유형 *</Label>
            <Select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
            >
              {inquiryTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>제목 *</Label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="문의 제목을 입력해주세요"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>내용 *</Label>
            <TextArea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="문의 내용을 자세히 입력해주세요"
              rows={8}
              required
            />
          </FormGroup>

          <SubmitButton type="submit" disabled={isSubmitting} size="large">
            {isSubmitting ? '전송 중...' : '문의하기'}
          </SubmitButton>
        </Form>
      </FormContainer>

      <InfoSection>
        <InfoTitle>문의 전송 후 안내사항</InfoTitle>
        <InfoList>
          <InfoItem>문의 접수 확인 이메일이 발송됩니다.</InfoItem>
          <InfoItem>관리자가 검토 후 이메일로 답변드립니다.</InfoItem>
          <InfoItem>일반적으로 1-2일 내에 답변드립니다.</InfoItem>
          <InfoItem>긴급한 문의는 고객센터로 직접 연락해주세요.</InfoItem>
        </InfoList>
      </InfoSection>

      {/* 내 문의내역 섹션 */}
      <FormContainer>
        <InquiryListTitle>내 문의내역</InquiryListTitle>
        {loading ? (
          <LoadingText>문의내역을 불러오는 중...</LoadingText>
        ) : inquiries.length === 0 ? (
          <EmptyText>아직 문의내역이 없습니다.</EmptyText>
        ) : (
          inquiries.map((inquiry) => (
            <div key={inquiry.id}>
              <InquiryCard>
                <CardTopRow>
                  <BadgeAndDate>
                    <Badge>{getTypeLabel(inquiry.type)}</Badge>
                    <DateText>{formatDate(inquiry.createdAt)}</DateText>
                  </BadgeAndDate>
                  <ToggleIcon onClick={() => toggleInquiry(inquiry.id)}>
                    {expandedInquiries.has(inquiry.id) ? '▴' : '▾'}
                  </ToggleIcon>
                </CardTopRow>
                <Title>{inquiry.title}</Title>
                {expandedInquiries.has(inquiry.id) && (
                  <InquiryContent>
                    {inquiry.content}
                  </InquiryContent>
                )}
              </InquiryCard>
            </div>
          ))
        )}
      </FormContainer>

      <ConfirmationModal
        isOpen={showSuccessModal}
        onRequestClose={() => setShowSuccessModal(false)}
        title="문의 접수 완료"
        message="문의가 성공적으로 접수되었습니다. 확인 이메일을 발송했습니다. 빠른 시일 내에 답변드리도록 하겠습니다."
        confirmButtonText="확인"
        onConfirm={() => setShowSuccessModal(false)}
      />
    </PageLayout>
  );
};

export default SupportPage; 