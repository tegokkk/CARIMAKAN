import PageWrapper from "../components/common/PageWrapper";
import RetroWindow from "../components/common/RetroWindow";

function Privacy() {
  return (
    <PageWrapper className="min-h-screen px-4 py-16">
      <div className="section-shell max-w-4xl">
        <RetroWindow title="Privasi.txt">
          <article className="p-7 md:p-10">
            <h1 className="retro-headline inline-block border-b-4 border-[#281712] pb-3 text-4xl uppercase text-[#aa3000] md:text-5xl">
              Kebijakan Privasi
            </h1>
            <p className="mt-6 retro-system-copy text-[#5c4037]">
              Terakhir diperbarui: {new Date().toLocaleDateString("id-ID")}
            </p>
            <div className="mt-8 space-y-6 text-base leading-8 text-[#5c4037]">
              <p>
                Selamat datang di CariMakan. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi kamu saat menggunakan layanan kami.
              </p>
              <section>
                <h2 className="retro-system-copy inline-block bg-[#281712] px-2 py-1 text-[#fff8f6]">1. Informasi yang Kami Kumpulkan</h2>
                <p className="mt-3">
                  Kami mengumpulkan informasi yang kamu berikan secara langsung, seperti nama, alamat email, nomor telepon, alamat pengiriman, serta data transaksi yang diperlukan untuk memproses pesanan.
                </p>
              </section>
              <section>
                <h2 className="retro-system-copy inline-block bg-[#281712] px-2 py-1 text-[#fff8f6]">2. Penggunaan Informasi</h2>
                <p className="mt-3">
                  Informasi digunakan untuk memproses pesanan, meningkatkan kualitas layanan, menyesuaikan pengalaman pengguna, dan mengirim pembaruan layanan jika diperlukan.
                </p>
              </section>
              <section>
                <h2 className="retro-system-copy inline-block bg-[#281712] px-2 py-1 text-[#fff8f6]">3. Keamanan Data</h2>
                <p className="mt-3">
                  Kami menerapkan langkah keamanan yang wajar untuk melindungi data pribadi dari akses, perubahan, atau penghapusan yang tidak sah.
                </p>
              </section>
            </div>
          </article>
        </RetroWindow>
      </div>
    </PageWrapper>
  );
}

export default Privacy;
