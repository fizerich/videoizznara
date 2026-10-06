// ============================================================================
//  SATU-SATUNYA FAIL YANG PERLU DIEDIT UNTUK VIDEO REVIEW BARU
//  Tukar maklumat di bawah, simpan, dan render semula (lihat README).
//  Video 9:16 dan 1:1 menggunakan data yang sama.
// ============================================================================

export type Review = {
  nama: string; // nama reviewer — kekalkan ejaan asal (huruf besar/kecil)
  bintang: number; // 1–5
  teks: string; // teks review — salin SEPERTI ASAL, jangan ubah makna
};

export type Cawangan = {
  nama: string; // cth 'Jejawi'
  alamat: string; // alamat ringkas yang dipaparkan di outro
};

export type VideoData = {
  nama: string;
  cawangan: Cawangan[]; // semua cawangan dipaparkan di outro (CTA umum)
  waktuOperasi: string; // satu waktu untuk semua cawangan
  whatsapp: string;
  cta: string;
  disclaimer: string;
  // Nama fail muzik dalam folder public/music, cth 'lagu.mp3'.
  // Biar '' (kosong) jika tak mahu muzik. Lalai: muzik sintesis bebas hak cipta
  // yang dijana oleh `npm run audio:reviews`.
  muzik: string;
  reviews: Review[];
};

export const data: VideoData = {
  nama: 'Klinik Pergigian Izznara',
  // CTA umum — kedua-dua cawangan dipaparkan di outro.
  cawangan: [
    {nama: 'Jejawi', alamat: 'Taman Jejawi, 02600 Arau, Perlis'},
    {nama: 'Mergong', alamat: 'Pusat Perdagangan Tuanku Haminah, Alor Setar'},
  ],

  // SILA SAHKAN untuk Jejawi: waktu ini diambil dari laman web cawangan Mergong
  // ("Setiap hari, 9.00 pagi – 6.00 petang").
  waktuOperasi: 'Setiap hari · 9.00 pagi – 6.00 petang',

  whatsapp: '011-7027 2360',
  cta: 'Jom Book Appointment',
  disclaimer: 'Review daripada pelanggan di Google',

  muzik: 'latar-review.wav',

  reviews: [
    {
      nama: 'Zuri Yati',
      bintang: 5,
      teks: 'Dah repeat berkali2 di klinik ni...mmg terbaik..servis mantap..doktor buat keja sgt2 teliti..buat temu janji siap2 klu nk cepat..',
    },
    {
      nama: 'nor hayati hassan',
      bintang: 5,
      teks: 'Servis yg sangat2 baik, Doktor dan staff sangat friendly.. anak2 pun suka ke klinik gigi setelah berurusan dgn pihak klinik Izznara jejawi',
    },
    {
      nama: 'Nor Zatul Effah Hasan',
      bintang: 5,
      teks: 'Alhmdlh...sgt berpuas hati dgn rawatan gigi di klinik ini..Gigi saya pecah ..doktor buat tampalan...cantik mcm gigi yg asal...terima kasih doktor n staff klinik Pergigian Klinik Izznara..',
    },
  ],
};

// Ringkasan nama cawangan, cth 'Jejawi · Mergong'
export const namaCawangan = data.cawangan.map((c) => c.nama).join(' · ');
