import AuthLayout from '@/components/auth/AuthLayout';
import SignupForm from '@/components/auth/SignupForm';

export default function SignupPage() {
  return (
    <AuthLayout
      title="시작해보세요!"
      subtitle="Stocker 계정을 만들고 주식 투자의 세계로 들어가세요"
      logoIcon={
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      }
      alternateLink={{
        text: "이미 계정이 있으신가요?",
        href: "/login",
        linkText: "로그인"
      }}
      footerText="회원가입하면 이용약관 및 개인정보처리방침에 동의하는 것으로 간주됩니다."
    >
      <SignupForm />
    </AuthLayout>
  );
} 