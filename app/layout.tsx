export const metadata = {
  title: 'GitHub App Ops',
  description: 'AI deployment orchestration for GitHub, Vercel, and Netlify',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
