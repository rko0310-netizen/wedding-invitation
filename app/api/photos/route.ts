import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { Readable } from 'stream';

export const dynamic = 'force-dynamic';

// 구글 드라이브 인증 설정
const auth = new google.auth.JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/drive'],
});

const drive = google.drive({ version: 'v3', auth });

export async function GET() {
  try {
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    
    // 구글 드라이브 폴더 내 파일 목록 조회
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'files(id, name, description, createdTime)',
      orderBy: 'createdTime desc',
    });

    const files = response.data.files || [];

    // 프론트엔드에서 기대하는 형식으로 변환
    const photos = files.map(file => ({
      id: file.id,
      image_url: `https://drive.google.com/uc?export=view&id=${file.id}`,
      uploader_name: file.description || '익명의 하객',
      created_at: file.createdTime
    }));

    return NextResponse.json(photos);
  } catch (error: any) {
    console.error('Fetch error:', error);
    return NextResponse.json({ error: '사진을 불러오는데 실패했습니다.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const uploaderName = formData.get('uploader_name') as string;

    if (!file) {
      return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 });
    }

    // 2. 파일 확장자 및 MIME 타입, 용량 검증
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !allowedExtensions.includes(fileExtension) || !allowedMimeTypes.includes(file.type)) {
      return NextResponse.json({ error: '허용되지 않는 파일 형식입니다.' }, { status: 400 });
    }

    if (file.size > 20 * 1024 * 1024) { // 20MB
      return NextResponse.json({ error: '파일 용량은 20MB를 초과할 수 없습니다.' }, { status: 400 });
    }

    // 3. Google Drive에 파일 업로드
    const buffer = Buffer.from(await file.arrayBuffer());
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    const driveResponse = await drive.files.create({
      requestBody: {
        name: `${Date.now()}-${file.name}`,
        description: uploaderName || '익명의 하객', // 하객 이름을 파일 설명에 저장
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID!],
      },
      media: {
        mimeType: file.type,
        body: stream,
      },
      fields: 'id',
    });

    const fileId = driveResponse.data.id;

    if (!fileId) throw new Error('구글 드라이브 업로드에 실패했습니다.');

    // 4. 파일 공개 권한 설정 (누구나 링크로 볼 수 있게)
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    const publicUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;

    return NextResponse.json({ message: '성공적으로 업로드되었습니다.', url: publicUrl });
  } catch (error: any) {
    console.error('Upload error:', error?.message ?? error);
    return NextResponse.json({ error: '업로드 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
