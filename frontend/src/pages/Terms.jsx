import PageWrapper from "../components/common/PageWrapper";
import RetroWindow from "../components/common/RetroWindow";

function Terms() {
  return (
    <PageWrapper className="min-h-screen px-4 py-16">
      <div className="section-shell max-w-4xl">
        <RetroWindow title="Ketentuan.txt">
          <article className="p-7 md:p-10">
            <h1 className="retro-headline inline-block border-b-4 border-[#281712] pb-3 text-4xl uppercase text-[#aa3000] md:text-5xl">
              Syarat & Ketentuan
            </h1>
            <p className="mt-6 retro-system-copy text-[#5c4037]">
              Terakhir diperbarui: {new Date().toLocaleDateString("id-ID")}
            </p>
            <div className="mt-8 space-y-6 text-base leading-8 text-[#5c4037]">
              <p>
                Dengan mengakses atau menggunakan platform CariMakan, kamu setuju untuk terikat oleh Syarat dan Ketentuan ini.
              </p>
              <section>
                <h2 className="retro-system-copy inline-block bg-[#281712] px-2 py-1 text-[#fff8f6]">1. Akun Pengguna</h2>
                <p className="mt-3">
                  Kamu bertanggung jawab menjaga kerahasiaan kata sandi dan akun. Pastikan informasi yang diberikan saat pendaftaran akurat dan lengkap.
                </p>
              </section>
              <section>
                <h2 className="retro-system-copy inline-block bg-[#281712] px-2 py-1 text-[#fff8f6]">2. Pesanan dan Pembayaran</h2>
                <p className="mt-3">
                  Semua pesanan bergantung pada ketersediaan restoran mitra. Harga yang tertera dapat berubah sewaktu-waktu sesuai data layanan.
                </p>
              </section>
              <section>
                <h2 className="retro-system-copy inline-block bg-[#281712] px-2 py-1 text-[#fff8f6]">3. Batasan Tanggung Jawab</h2>
                <p className="mt-3">
                  CariMakan bertindak sebagai perantara antara pengguna dan restoran mitra. Kualitas makanan dan proses operasional restoran berada pada tanggung jawab masing-masing mitra.
                </p>
              </section>
            </div>
          </article>
        </RetroWindow>
      </div>
    </PageWrapper>
  );
}

export default Terms;
