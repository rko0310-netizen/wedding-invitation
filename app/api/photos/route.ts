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

    // 업로드한 본인만 취소(삭제)할 수 있도록 파일에 비밀 키를 심어둔다
    const uploadToken = crypto.randomUUID();

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
          appProperties: { uploadToken },
        }),
      }
    );

    const uploadUrl = session.headers.get('location');
    if (!uploadUrl) throw new Error(`업로드 세션 발급 실패 (${session.status})`);

    return NextResponse.json({ uploadUrl, uploadToken });
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

// 업로드를 취소한 하객이 방금 올린 사진을 되돌린다.
// 업로드 시 발급한 비밀 키가 일치하는 파일만 삭제하므로 남의 사진은 지울 수 없다.
export async function DELETE(req: NextRequest) {
  try {
    const { drive, folderId } = getDriveClient();
    const { fileId, uploadToken } = await req.json();

    if (!fileId || !uploadToken) {
      console.error('Delete rejected: 요청 필드 누락', { hasFileId: !!fileId, hasUploadToken: !!uploadToken });
      return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
    }

    const file = await drive.files.get({
      fileId,
      fields: 'appProperties, parents',
    });

    const matches =
      file.data.appProperties?.uploadToken === uploadToken &&
      file.data.parents?.includes(folderId);

    if (!matches) {
      console.error('Delete rejected: 키 불일치', {
        파일에_키가_저장됨: !!file.data.appProperties?.uploadToken,
        키_일치: file.data.appProperties?.uploadToken === uploadToken,
        폴더_소속: !!file.data.parents?.includes(folderId),
      });
      return NextResponse.json({ error: '삭제 권한이 없습니다.' }, { status: 403 });
    }

    await drive.files.delete({ fileId });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('Delete error:', error?.message ?? error);
    return NextResponse.json({ error: '사진 삭제에 실패했습니다.' }, { status: 500 });
  }
}
