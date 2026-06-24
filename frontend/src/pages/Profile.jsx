import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import PageWrapper from "../components/common/PageWrapper";
import { FaUserCircle, FaEnvelope, FaPhone, FaShieldAlt } from "react-icons/fa";

function Profile() {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <PageWrapper className="pt-32 pb-20 min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="bg-slate-900 px-8 py-10 text-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-500 rounded-full blur-3xl opacity-20"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
            
            <div className="relative z-10">
              <div className="w-24 h-24 bg-white/10 rounded-full mx-auto flex items-center justify-center text-white mb-4 border border-white/20 backdrop-blur-sm">
                <span className="text-4xl font-black">{user.name.charAt(0).toUpperCase()}</span>
              </div>
              <h1 className="text-3xl font-black text-white mb-1">{user.name}</h1>
              <span className="inline-block bg-white/10 px-3 py-1 rounded-lg text-sm text-slate-300 backdrop-blur-sm">
                {user.role === "admin" ? "Administrator" : "Member"}
              </span>
            </div>
          </div>

          <div className="p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Informasi Akun</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center text-xl flex-shrink-0">
                  <FaUserCircle />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-400 mb-1">Nama Lengkap</p>
                  <p className="font-bold text-slate-900 text-lg">{user.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center text-xl flex-shrink-0">
                  <FaEnvelope />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-400 mb-1">Email</p>
                  <p className="font-bold text-slate-900 text-lg">{user.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-50 text-green-500 flex items-center justify-center text-xl flex-shrink-0">
                  <FaPhone />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-400 mb-1">No. Handphone</p>
                  <p className="font-bold text-slate-900 text-lg">{user.phone || "Belum ditambahkan"}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center text-xl flex-shrink-0">
                  <FaShieldAlt />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-400 mb-1">Status Akun</p>
                  <p className="font-bold text-green-600 text-lg flex items-center gap-2">
                    Aktif
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

export default Profile;
