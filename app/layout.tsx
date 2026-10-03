export const metadata = {
  title: 'GitHub App Ops',
  description: 'Lightweight AI agent system for safe GitHub and Vercel deployments.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/globals.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
