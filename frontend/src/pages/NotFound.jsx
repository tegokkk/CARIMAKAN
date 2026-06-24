import { FaArrowLeft, FaExclamationTriangle } from "react-icons/fa";
import PageWrapper from "../components/common/PageWrapper";
import RetroButton from "../components/common/RetroButton";
import RetroWindow from "../components/common/RetroWindow";

function NotFound() {
  return (
    <PageWrapper className="flex min-h-screen items-center justify-center px-4 py-16">
      <RetroWindow title="Error.404" className="w-full max-w-2xl">
        <div className="p-8 text-center md:p-12">
          <div className="mx-auto grid h-24 w-24 place-items-center border-2 border-[#281712] bg-[#aa3000] text-4xl text-white retro-shadow">
            <FaExclamationTriangle />
          </div>
          <h1 className="retro-headline mt-8 text-[5rem] leading-none text-[#aa3000] md:text-[7rem]">404</h1>
          <h2 className="retro-headline mt-4 text-3xl text-[#281712]">Halaman tidak ditemukan</h2>
          <p className="mx-auto mt-4 max-w-md leading-7 text-[#5c4037]">
            File halaman yang kamu cari tidak ada di direktori CariMakan OS.
          </p>
          <div className="mt-8">
            <RetroButton to="/" variant="primary" className="px-7 py-4">
              <FaArrowLeft /> Kembali ke Beranda
            </RetroButton>
          </div>
        </div>
      </RetroWindow>
    </PageWrapper>
  );
}

export default NotFound;
