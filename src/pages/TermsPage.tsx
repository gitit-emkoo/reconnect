
// import { useNavigate } from 'react-router-dom'; // PageLayout에서 처리

import PageLayout from '../components/Layout/PageLayout'; // PageLayout 임포트
import TermsContent from './TermsContent';


const TermsPage = () => (
  <PageLayout title="이용약관">
    <TermsContent />
  </PageLayout>
);

export default TermsPage; 