# Website Phan Anh Bao Luc Hoc Duong

Website React + Vite de hoc sinh/phu huynh gui phan anh nhanh, luu du lieu vao Google Form va redirect sang Zalo nhom sau khi gui thanh cong.

## Tinh nang

- Landing page co CTA + khu vuc QR truy cap nhanh
- Form phan anh gom:
  - Ban la ai?
  - Van de gap phai
  - Muc do khan cap
  - Thoi gian, dia diem, mo ta ngan (optional)
- Validate client-side cho cac truong bat buoc
- Chan submit lap khi dang gui
- Gui Google Form qua endpoint `formResponse`
- Tu dong soan noi dung tin nhan tu du lieu form
- Tu dong copy noi dung vao clipboard va mo Zalo share sau khi gui thanh cong

## Cai dat local

```bash
npm install
cp .env.example .env
npm run dev
```

Neu dung Windows PowerShell va bi chan `npm`, hay dung `npm.cmd`.

## Cau hinh bien moi truong

Tao file `.env` theo mau `.env.example`:

- `VITE_ZALO_GROUP_URL`: link nhom Zalo nhan thong tin
- `VITE_ZALO_SHARE_URL`: link share cua Zalo (mac dinh `https://zalo.me/share`)
- `VITE_GOOGLE_FORM_ACTION_URL`: link form response cua Google Form
- `VITE_GOOGLE_ENTRY_*`: ID tung truong trong Google Form (dang `entry.xxxxx`)

### Cach lay `entry.*` trong Google Form

1. Mo Google Form > Preview.
2. Xem source trang (View Page Source).
3. Tim chuoi `entry.` de lay dung ID cua tung cau hoi.

## Build

```bash
npm run build
npm run preview
```

## Deploy Vercel

1. Push code len GitHub.
2. Import project vao Vercel.
3. Them cac Environment Variables giong `.env.example` cho `Preview` va `Production`.
4. Deploy va kiem tra:
   - Submit hop le -> redirect dung Zalo nhom
   - Submit thieu truong bat buoc -> hien loi, khong gui
   - Nhan nut gui nhieu lan -> khong tao request lap

# S-Zone