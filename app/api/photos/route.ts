import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { google } from 'googleapis';
import { Readable } from 'stream';

export const dynamic = 'force-dynamic';

// 구글 드라이브 인증 설정
const auth = new google.auth.JWT(
  process.env.GOOGLE_CLIENT_EMAIL,
  null,
  process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  ['https://www.googleapis.com/auth/drive.file']
);

const drive = google.drive({ version: 'v3', auth });

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('guest_photos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const uploaderName = formData.get('uploader_name') as string;
    const password = formData.get('password') as string;

    // 1. 비밀번호 검증
    if (password !== process.env.UPLOAD_PASSWORD) {
      return NextResponse.json({ error: '비밀번호가 일치하지 않습니다.' }, { status: 401 });
    }

    if (!file) {
      return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 });
    }

    // 2. 파일 확장자 및 용량 검증
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
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

    // 5. 직접 접근 가능한 이미지 URL 생성
    // 구글 드라이브의 직접 링크 포맷 중 하나를 사용합니다.
    const publicUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;

    // 6. DB에 메타데이터 저장
    const { error: dbError } = await supabaseAdmin
      .from('guest_photos')
      .insert([
        { 
          image_url: publicUrl, 
          uploader_name: uploaderName || '익명의 하객'
        }
      ]);

    if (dbError) throw dbError;

    return NextResponse.json({ message: '성공적으로 업로드되었습니다.', url: publicUrl });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
