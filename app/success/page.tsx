export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-green-600 mb-4">
        Payment Successful!
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        Thank you for your purchase. Your credits have been added to your
        account.
      </p>
    </div>
  );
}
