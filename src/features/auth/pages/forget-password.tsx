import { APP_CONFIG } from "@/core/configs";
import { Button, Input, Label, VokadashHead, lang } from "@/core/libs";
import { useAlert } from "@/features/_global";
import { ArrowRight, KeyRound, Loader2, Mail } from "lucide-react"; // Tambahkan Loader2
import { FormEventHandler, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const ForgetPassword = () => {
  const auth = useAuth();
  const alert = useAlert();
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);

  const submit: FormEventHandler = async (e) => {
    e?.preventDefault?.();
    try {
      await auth.forgotPassword(email);
      alert.success(`Link reset password telah dikirim ke ${email}.`);
      setIsSent(true);
    } catch (err: any) {
      alert.error(err.response?.data?.message || lang.text("errSystem"));
    }
  };

  return (
    <div className="relative">
      <VokadashHead>
        <title>{`${lang.text("forgetPassword")} | ${APP_CONFIG.appName}`}</title>
      </VokadashHead>

      <div className="space-y-8">
        <div className="flex gap-4 items-center text-center justify-start">
          <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500 shadow-xl shadow-blue-500/5">
            <KeyRound size={28} strokeWidth={1.5} />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-semibold tracking-tight text-blue-800">
              {lang.text("forgetPassword")}
            </h2>
            {/* <p className="text-[13px] text-slate-400">Masukkan email untuk menerima instruksi reset.</p> */}
          </div>
        </div>

        {!isSent ? (
          <form onSubmit={submit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="email" className="text-blue-800 text-[13px] ml-1">
                Alamat Email
              </Label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                  <Mail size={18} />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={({ target: { value } }) => setEmail(value)}
                  className="h-12 pl-12 bg-white/[0.03] border-blue-400 text-blue-900 placeholder:text-white/20 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all rounded-2xl"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={auth.isLoading} 
              className="relative w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-2xl transition-all shadow-lg shadow-blue-600/20 overflow-hidden group disabled:opacity-80"
            >
              {auth.isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-white/80" />
                  <span className="tracking-wide">Mengirim Instruksi...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>{lang.text("send")}</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
          </form>
        ) : (
          <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-3xl text-center space-y-4 animate-in fade-in zoom-in duration-500">
            <div className="mx-auto w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-2">
              <Mail size={24} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-900">Email Terkirim!</p>
              <p className="text-[12px] text-slate-600">
                Silakan periksa kotak masuk atau folder spam pada email <b>{email}</b>.
              </p>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => setIsSent(false)} 
              className="text-xs text-blue-400 hover:text-blue-300 hover:bg-white/5"
            >
              Gunakan email lain
            </Button>
          </div>
        )}

        <div className="text-center">
          <p className="text-[13px] text-slate-500">
            {lang.text("hasAccount")}{" "}
            <Link to="/auth/login" className="text-slate-600 hover:text-blue-400 font-medium transition-colors">
              {lang.text("login")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};