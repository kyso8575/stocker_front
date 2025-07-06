import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <AuthLayout
      title="환영합니다!"
      subtitle="Stocker에 로그인하여 주식 투자를 시작하세요"
      logoIcon={
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
      }
      alternateLink={{
        text: "계정이 없으신가요?",
        href: "/signup",
        linkText: "회원가입"
      }}
    >
      <LoginForm />
    </AuthLayout>
  );
} 