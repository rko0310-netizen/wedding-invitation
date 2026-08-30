import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export const dynamic = 'force-dynamic';

function getDriveClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  if (!clientId || !clientSecret || !refreshToken || !folderId) {
    throw new Error(`Missing env: clientId=${!!clientId}, clientSecret=${!!clientSecret}, refreshToken=${!!refreshToken}, folderId=${!!folderId}`);
  }

  const auth = new google.auth.OAuth2(clientId, clientSecret);
  auth.setCredentials({ refresh_token: refreshToken });
  return { drive: google.drive({ version: 'v3', auth }), auth, folderId };
}

export async function GET() {
  try {
    const { drive, folderId } = getDriveClient();

    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'files(id, name, description, createdTime)',
      orderBy: 'createdTime desc',
      pageSize: 1000,
    });

    const files = response.data.files || [];

    // 프론트엔드에서 기대하는 형식으로 변환
    const photos = files.map(file => ({
      id: file.id,
      image_url: `https://lh3.googleusercontent.com/d/${file.id}=w1200`,
      uploader_name: file.description || '익명의 하객',
      created_at: file.createdTime
    }));

    return NextResponse.json(photos);
  } catch (error: any) {
    console.error('Fetch error:', error?.message ?? error);
    return NextResponse.json({ error: '사진을 불러오는데 실패했습니다.' }, { status: 500 });
  }
}

// 하객 휴대폰이 구글 드라이브로 직접 업로드할 수 있는 세션 URL을 발급한다.
// 서버를 거치지 않으므로 Vercel의 4.5MB 요청 제한을 받지 않고 원본이 그대로 저장된다.
export async function POST(req: NextRequest) {
  try {
    const { auth, folderId } = getDriveClient();

    const { fileName, mimeType, size, uploader_name } = await req.json();

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!mimeType || !allowedMimeTypes.includes(mimeType)) {
      return NextResponse.json({ error: '허용되지 않는 파일 형식입니다.' }, { status: 400 });
    }

    if (typeof size !== 'number' || size > 20 * 1024 * 1024) {
      return NextResponse.json({ error: '파일 용량은 20MB를 초과할 수 없습니다.' }, { status: 400 });
    }

    const { token } = await auth.getAccessToken();

    // Origin을 전달해야 브라우저가 이 세션 URL로 직접 PUT 할 수 있다(CORS)
    const origin = req.headers.get('origin') ?? new URL(req.url).origin;

    const session = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&fields=id',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Upload-Content-Type': mimeType,
          Origin: origin,
        },
        body: JSON.stringify({
          name: `${Date.now()}-${fileName}`,
          description: uploader_name || '익명의 하객',
          parents: [folderId],
        }),
      }
    );

    const uploadUrl = session.headers.get('location');
    if (!uploadUrl) throw new Error(`업로드 세션 발급 실패 (${session.status})`);

    return NextResponse.json({ uploadUrl });
  } catch (error: any) {
    console.error('Upload URL error:', error?.message ?? error);
    return NextResponse.json({ error: '업로드 준비 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 업로드가 끝난 파일을 링크로 볼 수 있게 공개한다.
export async function PATCH(req: NextRequest) {
  try {
    const { drive } = getDriveClient();
    const { fileId } = await req.json();

    if (!fileId || typeof fileId !== 'string') {
      return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
    }

    await drive.permissions.create({
      fileId,
      requestBody: { role: 'reader', type: 'anyone' },
    });

    return NextResponse.json({ url: `https://lh3.googleusercontent.com/d/${fileId}=w1200` });
  } catch (error: any) {
    console.error('Publish error:', error?.message ?? error);
    return NextResponse.json({ error: '사진 공개 설정에 실패했습니다.' }, { status: 500 });
  }
}
