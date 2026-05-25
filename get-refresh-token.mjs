import http from 'http';
import { exec } from 'child_process';

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3001';
const SCOPE = 'https://www.googleapis.com/auth/drive';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('사용법: CLIENT_ID=... CLIENT_SECRET=... node get-refresh-token.mjs');
  process.exit(1);
}

const authUrl =
  `https://accounts.google.com/o/oauth2/v2/auth` +
  `?client_id=${CLIENT_ID}` +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
  `&response_type=code` +
  `&scope=${encodeURIComponent(SCOPE)}` +
  `&access_type=offline` +
  `&prompt=consent`;

console.log('\n아래 URL을 브라우저에서 열어 본인 구글 계정으로 로그인하세요:\n');
console.log(authUrl);
console.log('\n로그인 완료 후 자동으로 토큰이 발급됩니다...\n');

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT_URI);
  const code = url.searchParams.get('code');
  if (!code) return;

  res.end('<script>window.close()</script>인증 완료! 터미널을 확인하세요.');

  const params = new URLSearchParams({
    code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    grant_type: 'authorization_code',
  });

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  const tokens = await response.json();

  if (tokens.refresh_token) {
    console.log('✅ 발급 완료! 아래 값을 Vercel 환경변수에 등록하세요:\n');
    console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}\n`);
  } else {
    console.error('❌ 실패:', JSON.stringify(tokens, null, 2));
  }

  server.close();
});

server.listen(3001);
