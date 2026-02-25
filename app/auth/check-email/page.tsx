export default function CheckEmailPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-900 via-blue-700 to-blue-100 px-6">
            <div className="w-full max-w-sm rounded-2xl bg-white/10 p-8 backdrop-blur-xl shadow-2xl text-center border border-white/20">
                <h1 className="text-2xl font-semibold text-white mb-4">Check your email</h1>
                <p className="text-white mb-4">We have sent you a magic link to your email. Please check your inbox and click the link to sign in.</p>
            </div>
        </main>
    );
}