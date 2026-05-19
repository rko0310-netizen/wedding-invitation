import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

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

    // 2. 파일 확장자 및 용량 검증 (서버사이드)
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      return NextResponse.json({ error: '허용되지 않는 파일 형식입니다.' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
      return NextResponse.json({ error: '파일 용량은 10MB를 초과할 수 없습니다.' }, { status: 400 });
    }

    // 3. Supabase Storage에 파일 업로드
    const fileName = `${uuidv4()}.${fileExtension}`;
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('guest_photos')
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) throw uploadError;

    // 4. 공개 URL 가져오기
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('guest_photos')
      .getPublicUrl(fileName);

    // 5. DB에 메타데이터 저장
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
