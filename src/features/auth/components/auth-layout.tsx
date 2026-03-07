import { VokadashHead } from "@/core/libs";
import { PropsWithChildren } from "react";

const defaultBg = "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop";

export interface AuthLayoutProps extends PropsWithChildren {
  title?: string;
  description?: string;
  image?: string;
  siteTitle?: string;
}

export const AuthLayout = ({ description, title, children, image, siteTitle }: AuthLayoutProps) => {
  return (
    <>
      {siteTitle && (
        <VokadashHead>
          <title>{siteTitle}</title>
        </VokadashHead>
      )}
      
      <div className="relative w-full min-h-screen flex justify-center items-center overflow-hidden">
        
        {/* Layer 1: Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-500"
          style={{ backgroundImage: `url(${image || defaultBg})` }}
        />

        {/* Layer 2: Overlay (Gelap/Biru untuk kontras) */}
        <div className="absolute inset-0 z-10 bg-blue-600/80 backdrop-blur-[2px]" />

        {/* Layer 3: Content (Login Form) */}
        <div className="relative z-20 md:w-[60vw] w-[98vw] flex flex-col items-center justify-center p-6">
          
          <div className="w-full space-y-8">
            {(title || description) && (
              <div className="space-y-2 text-center w-full mx-auto flex flex-col justify-center items-center">
                {title && (
                  <h1 className="text-2xl md:text-4xl font-extrabold uppercase w-max tracking-tight text-white drop-shadow-md">
                    {"Perpustakaan Digital"}
                  </h1>
                )}
                {description && (
                  <p className="text-blue-100 font-medium opacity-90">
                    {"MENGELOLA BUKU PERPUS" || description}
                  </p>
                )}
              </div>
            )}

            {/* Form Container */}
            <div className="bg-white/95 h-max md:h-[56vh] w-[100%] md:w-[72%] mx-auto backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};